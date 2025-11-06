from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from automation import router as automation_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Instagram Automation API",
    description="Automation tool similar to ManyChat without official API key",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(automation_router, prefix="/api/automation", tags=["Automation"])

@app.get("/")
def read_root():
    return {
        "message": "Instagram Automation API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
