from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import os

router = APIRouter(tags=["Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    username: str
    password: str

class SessionLoginRequest(BaseModel):
    instagram_username: str
    session_string: str

class DirectLoginRequest(BaseModel):
    instagram_username: str
    instagram_password: str

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register")
def register(request: LoginRequest):
    # اینجا کد ثبت نام کاربر را اضافه کنید
    return {"msg": "User registered successfully"}

@router.post("/login/jwt")
def login_jwt(request: LoginRequest):
    # Check credentials and return JWT token
    access_token = create_access_token(data={"sub": request.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login/session")
def login_session(request: SessionLoginRequest):
    # Save session string for later use
    return {"msg": "Session saved", "session_id": request.session_string[:20]}

@router.post("/login/direct")
def login_direct(request: DirectLoginRequest):
    # Direct Instagram login will be handled by automation module
    return {"msg": "Direct login initiated", "status": "pending"}

def get_current_user(token: str = None):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return username
