from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Path as FastAPIPath, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy import String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

BASE_DIR = Path(__file__).parent.resolve()
DATABASE_PATH = BASE_DIR / "api_explorer.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


class Base(DeclarativeBase):
    pass


class ProjectData(Base):
    __tablename__ = "project_data"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Full-Stack API Explorer",
    description="Production-ready FastAPI backend with static file hosting, SQLite persistence, and a JSON API.",
    version="1.0.0",
    lifespan=lifespan,
)

# Frontend logic is handled separately in the client-side files.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProjectDataCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=1000)


class ProjectDataUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=1000)


class ProjectDataRead(BaseModel):
    id: int
    title: str
    description: str


class ProjectDataResponse(BaseModel):
    title: str
    description: str
    status: str
    projects: list[ProjectDataRead]


def serialize_projects(db: Session) -> list[ProjectDataRead]:
    projects = db.query(ProjectData).order_by(ProjectData.id.asc()).all()
    return [
        ProjectDataRead(
            id=project.id,
            title=project.title,
            description=project.description,
        )
        for project in projects
    ]


@app.get("/api/data", response_model=ProjectDataResponse)
def get_data(db: Session = Depends(get_db)) -> ProjectDataResponse:
    """Return the explorer payload and the persisted project records."""
    return ProjectDataResponse(
        title="Full-Stack API Explorer",
        description="This data was fetched from the backend API.",
        status="ok",
        projects=serialize_projects(db),
    )


@app.post("/api/data", response_model=ProjectDataRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectDataCreate, db: Session = Depends(get_db)) -> ProjectDataRead:
    """Add a new project record to the SQLite database."""
    project = ProjectData(title=payload.title.strip(), description=payload.description.strip())
    db.add(project)
    db.commit()
    db.refresh(project)

    return ProjectDataRead(id=project.id, title=project.title, description=project.description)


@app.put("/api/data/{project_id}", response_model=ProjectDataRead)
def update_project(
    project_id: int = FastAPIPath(..., gt=0),
    payload: ProjectDataUpdate = None,
    db: Session = Depends(get_db),
) -> ProjectDataRead:
    """Update an existing project record in the SQLite database."""
    project = db.get(ProjectData, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project.title = payload.title.strip()
    project.description = payload.description.strip()
    db.commit()
    db.refresh(project)

    return ProjectDataRead(id=project.id, title=project.title, description=project.description)


@app.delete("/api/data/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int = FastAPIPath(..., gt=0),
    db: Session = Depends(get_db),
) -> None:
    """Delete an existing project record from the SQLite database."""
    project = db.get(ProjectData, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()


app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
