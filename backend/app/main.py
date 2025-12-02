# backend/app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from . import models
from .auth import router as auth_router
from .expenses import router as expenses_router
from .trips import router as trips_router
from .reports import router as reports_router

# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExpeApp Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# STATIC MEDIA (for receipt images)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MEDIA_DIR = os.path.join(BASE_DIR, "media")
os.makedirs(MEDIA_DIR, exist_ok=True)

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

# Routers
app.include_router(auth_router)
app.include_router(expenses_router)
app.include_router(trips_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {"message": "ExpeApp FastAPI backend running"}
