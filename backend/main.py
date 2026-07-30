# FastAPI app entry point
# Must do the following on startup:
# 1. Load the ResNet model from models/best_resnet.pth into memory ONCE
# 2. Load classes.json ONCE and store as a list
# 3. Set up CORS to allow requests from frontend origin
# 4. Include routers: auth router and api router
# 5. Health check endpoint: GET / → { "status": "Breedify backend running" }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from ml.model import load_model
from auth.routes import router as auth_router
from api.routes import router as api_router
from config import CLASSES_PATH
import json
import os

model = None
class_names = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names
    # Load model once on startup
    model = load_model()
    
    # Load classes.json once
    path = CLASSES_PATH
    if not os.path.exists(path):
        # Fallback to default relative path if config path does not exist
        path = "../models/classes.json"
        
    with open(path, "r", encoding="utf-8") as f:
        class_names = json.load(f) # Load 26 breed names
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten to frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(api_router, prefix="/api")

@app.get("/")
def health():
    return {"status": "Breedify backend running", "breeds_loaded": len(class_names)}
