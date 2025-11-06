from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter(tags=["n8n Integration"])

class N8NSetupRequest(BaseModel):
    post_links: List[str]
    comment_criteria: str
    reply_messages: List[str]
    dm_messages: List[str]
    must_follow: bool = False
    follow_message: Optional[str] = None

class N8NRunRequest(BaseModel):
    session_string: str
    task_id: int

class N8NResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    error: Optional[str] = None

@router.post("/n8n/setup", response_model=N8NResponse)
def n8n_setup_automation(request: N8NSetupRequest):
    """
    فارسی: Setup automation task برای n8n
    English: Setup automation task for n8n
    
    Input:
    {
        "post_links": ["https://instagram.com/p/..."],
        "comment_criteria": "#giveaway",
        "reply_messages": ["پاسخ 1", "پاسخ 2"],
        "dm_messages": ["پیام 1", "پیام 2"],
        "must_follow": true,
        "follow_message": "لطفا فالو کنید"
    }
    
    Output:
    {
        "success": true,
        "data": {
            "task_id": 1,
            "message": "Task created successfully"
        }
    }
    """
    try:
        # Simulate task creation
        task_id = 1  # In production, save to database
        return N8NResponse(
            success=True,
            data={
                "task_id": task_id,
                "message": "Task created successfully",
                "timestamp": str(__import__('datetime').datetime.now())
            }
        )
    except Exception as e:
        return N8NResponse(
            success=False,
            data={},
            error=str(e)
        )

@router.post("/n8n/run", response_model=N8NResponse)
def n8n_run_automation(request: N8NRunRequest):
    """
    فارسی: Run automation task برای n8n
    English: Run automation task for n8n
    
    Input:
    {
        "session_string": "session_xyz",
        "task_id": 1
    }
    
    Output:
    {
        "success": true,
        "data": {
            "replies_sent": 5,
            "dms_sent": 3,
            "status": "completed"
        }
    }
    """
    try:
        # Simulate automation execution
        return N8NResponse(
            success=True,
            data={
                "replies_sent": 5,
                "dms_sent": 3,
                "status": "completed",
                "timestamp": str(__import__('datetime').datetime.now())
            }
        )
    except Exception as e:
        return N8NResponse(
            success=False,
            data={},
            error=str(e)
        )

@router.get("/n8n/status/{task_id}")
def get_task_status(task_id: int):
    """
    فارسی: Get task status
    English: Get task status
    """
    return {
        "task_id": task_id,
        "status": "completed",
        "progress": 100
    }

@router.post("/n8n/webhook")
def n8n_webhook(data: Dict[str, Any]):
    """
    فارسی: Webhook برای n8n
    English: Webhook endpoint for n8n
    """
    return {
        "received": True,
        "data_keys": list(data.keys())
    }
