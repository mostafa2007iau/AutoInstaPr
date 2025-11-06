from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    instagram_username = Column(String)
    instagram_session = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AutomationTask(Base):
    __tablename__ = "automation_tasks"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_links = Column(JSON)  # List of post URLs
    comment_criteria = Column(String)  # Condition text
    reply_messages = Column(JSON)  # List of reply messages
    dm_messages = Column(JSON)  # List of DM messages
    must_follow = Column(Boolean, default=False)
    follow_message = Column(String)  # Custom follow message
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AutomationLog(Base):
    __tablename__ = "automation_logs"
    
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("automation_tasks.id"))
    comment_id = Column(String)
    commenter_username = Column(String)
    message_sent = Column(Text)
    message_type = Column(String)  # "reply" or "dm"
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # "success" or "failed"
