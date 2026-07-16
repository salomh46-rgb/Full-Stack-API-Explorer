from __future__ import annotations

from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).parent.resolve()

app = FastAPI(
    title="Full-Stack API Explorer",
    description="Production-ready FastAPI backend with static file hosting and a JSON API.",
    version="1.0.0",
)

# Frontend logic is handled separately in the client-side files.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/data")
def get_data() -> dict[str, str]:
    """Return the JSON payload used by the frontend explorer UI."""
    return {
        "title": "Full-Stack API Explorer",
        "description": "This data was fetched from the backend API.",
        "status": "ok",
    }


app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
