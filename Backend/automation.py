from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from instagrapi import Client
from typing import List, Optional
import random
import re

router = APIRouter(tags=["Automation"])

class AutomationSetupRequest(BaseModel):
    post_links: List[str]
    comment_criteria: str
    reply_messages: List[str]
    dm_messages: List[str]
    must_follow: bool = False
    follow_message: Optional[str] = None

class AutomationRunRequest(BaseModel):
    session_string: str
    task_id: int

# Global storage (در production از database استفاده کنید)
tasks_storage = {}

@router.post("/setup")
def setup_task(request: AutomationSetupRequest):
    """
    فارسی: وظیفه اتوماسیون را تنظیم کن
    English: Setup automation task
    """
    task_id = len(tasks_storage) + 1
    tasks_storage[task_id] = {
        "post_links": request.post_links,
        "comment_criteria": request.comment_criteria,
        "reply_messages": request.reply_messages,
        "dm_messages": request.dm_messages,
        "must_follow": request.must_follow,
        "follow_message": request.follow_message
    }
    return {"task_id": task_id, "msg": "Task saved successfully"}

@router.post("/run")
def run_automation(request: AutomationRunRequest):
    """
    فارسی: اتوماسیون را اجرا کن
    English: Run automation
    """
    if request.task_id not in tasks_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks_storage[request.task_id]
    client = Client()
    
    try:
        # Load session
        client.load_settings(request.session_string)
        
        results = {
            "replies_sent": 0,
            "dms_sent": 0,
            "errors": []
        }
        
        # Process each post
        for post_link in task["post_links"]:
            try:
                # Extract post ID from URL
                post_id = extract_post_id(post_link)
                media = client.media_info(post_id)
                
                # Get comments
                comments = client.media_comments(post_id)
                
                for comment in comments:
                    # Check if comment matches criteria
                    if matches_criteria(comment.text, task["comment_criteria"]):
                        # Check if user is follower
                        user_id = comment.user.pk
                        
                        if task["must_follow"]:
                            is_follower = client.user_followers(user_id)
                            if not is_follower:
                                # Send follow required message
                                send_dm(client, user_id, task["follow_message"])
                                continue
                        
                        # Send random reply
                        reply_msg = random.choice(task["reply_messages"])
                        try:
                            client.media_comments_create(post_id, reply_msg, replied_to_comment_id=comment.id)
                            results["replies_sent"] += 1
                        except:
                            pass
                        
                        # Send random DM
                        dm_msg = random.choice(task["dm_messages"])
                        send_dm(client, user_id, dm_msg)
                        results["dms_sent"] += 1
            
            except Exception as e:
                results["errors"].append(str(e))
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extract_post_id(post_url: str):
    """Extract Instagram post ID from URL"""
    match = re.search(r'/p/([^/]+)/', post_url)
    return match.group(1) if match else None

def matches_criteria(text: str, criteria: str):
    """Check if comment text matches criteria"""
    keywords = criteria.lower().split(",")
    text_lower = text.lower()
    return any(keyword.strip() in text_lower for keyword in keywords)

def send_dm(client: Client, user_id: int, message: str):
    """Send direct message"""
    try:
        client.send_message(user_id, message)
        return True
    except:
        return False

@router.get("/tasks/{task_id}")
def get_task(task_id: int):
    """
    فارسی: وظیفه را دریافت کن
    English: Get task details
    """
    if task_id not in tasks_storage:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_storage[task_id]

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """
    فارسی: وظیفه را حذف کن
    English: Delete task
    """
    if task_id in tasks_storage:
        del tasks_storage[task_id]
        return {"msg": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

@router.post("/n8n/setup")
def n8n_setup_automation(request: AutomationSetupRequest):
    """
    Endpoint optimized for n8n integration
    فارسی: Endpoint برای اتصال n8n
    """
    return setup_task(request)

@router.post("/n8n/run")
def n8n_run_automation(request: AutomationRunRequest):
    """
    Endpoint optimized for n8n integration
    فارسی: Endpoint اجرا برای n8n
    """
    return run_automation(request)
