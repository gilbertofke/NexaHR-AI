
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from uuid import uuid4
from datetime import datetime
import os, shutil, time, json

UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Interview Transcription Stub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptItem(BaseModel):
    start: float
    end: float
    text: str

class Analysis(BaseModel):
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    keywords: Optional[List[str]] = None
    questions: Optional[List[Dict[str, str]]] = None
    hrMetrics: Optional[Dict[str, int]] = None
    redFlags: Optional[List[str]] = None
    strengths: Optional[List[str]] = None
    recommendations: Optional[str] = None
    interviewQuality: Optional[str] = None

class Interview(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    filename: str
    original_name: str
    file_size: int
    file_path: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    status: str = "uploaded"  # uploaded, processing, completed, failed
    transcript: Optional[List[TranscriptItem]] = None
    analysis: Optional[Analysis] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

DB: Dict[str, Interview] = {}

def _load_sample(path: str):
    with open(path, "r") as f:
        return json.load(f)

SAMPLE_TRANSCRIPT = _load_sample(os.path.join(os.path.dirname(__file__), "sample_transcript.json"))
SAMPLE_ANALYSIS = _load_sample(os.path.join(os.path.dirname(__file__), "sample_analysis.json"))

@app.post("/api/interviews/upload", response_model=Interview)
async def upload_interview(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    allowed = {".mp3", ".wav", ".mp4", ".mov"}
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported format {ext}")
    contents = await file.read()
    if len(contents) > 100 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (>100MB)")
    file_id = str(uuid4())
    stored_name = f"{file_id}{ext}"
    out_path = os.path.join(UPLOAD_DIR, stored_name)
    with open(out_path, "wb") as f:
        f.write(contents)
    interview = Interview(
        id=file_id,
        filename=stored_name,
        original_name=file.filename,
        file_size=len(contents),
        file_path=out_path,
        status="uploaded",
    )
    DB[file_id] = interview
    return interview

@app.get("/api/interviews", response_model=List[Interview])
async def list_interviews():
    return sorted(DB.values(), key=lambda x: x.upload_date, reverse=True)

@app.get("/api/interviews/{interview_id}", response_model=Interview)
async def get_interview(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    return DB[interview_id]

@app.delete("/api/interviews/{interview_id}")
async def delete_interview(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    try:
        file_path = DB[interview_id].file_path
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass
    del DB[interview_id]
    return {"ok": True}

def _simulate_transcription(interview_id: str):
    # Simulate processing
    try:
        DB[interview_id].status = "processing"
        DB[interview_id].updated_at = datetime.utcnow()
        time.sleep(2)  # simulate queue
        # attach sample transcript & randomized analysis
        DB[interview_id].transcript = [TranscriptItem(**t) for t in SAMPLE_TRANSCRIPT["transcript"]]
        # randomize analysis
        sentiments = ["positive", "neutral", "negative"]
        import random
        random.seed()
        base_keywords = SAMPLE_ANALYSIS.get("keywords") or []
        sampled_keywords = random.sample(base_keywords, k=min(len(base_keywords), max(3, len(base_keywords)//2))) if base_keywords else []
        hr_metrics = {
            "overallScore": random.randint(6, 10),
            "communicationSkills": random.randint(6, 10),
            "technicalCompetency": random.randint(6, 10),
            "problemSolving": random.randint(6, 10),
            "culturalFit": random.randint(6, 10),
            "experience": random.randint(6, 10),
        }
        DB[interview_id].analysis = Analysis(
            summary=SAMPLE_ANALYSIS.get("summary") or "Candidate shows promise with areas to explore further.",
            sentiment=random.choice(sentiments),
            keywords=sampled_keywords,
            questions=SAMPLE_ANALYSIS.get("questions"),
            hrMetrics=hr_metrics,
            redFlags=SAMPLE_ANALYSIS.get("redFlags") or [],
            strengths=SAMPLE_ANALYSIS.get("strengths") or [],
            recommendations=SAMPLE_ANALYSIS.get("recommendations") or "Proceed to next round with focused technical evaluation.",
            interviewQuality=random.choice(["excellent", "good", "fair"]) ,
        )
        DB[interview_id].status = "completed"
        DB[interview_id].updated_at = datetime.utcnow()
    except Exception as e:
        DB[interview_id].status = "failed"
        DB[interview_id].updated_at = datetime.utcnow()

@app.post("/api/interviews/{interview_id}/transcribe")
async def transcribe(interview_id: str, background_tasks: BackgroundTasks):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    interview = DB[interview_id]
    if interview.status in {"processing", "completed"}:
        return {"ok": True, "status": interview.status}
    background_tasks.add_task(_simulate_transcription, interview_id)
    return {"ok": True, "status": "processing"}

@app.get("/api/interviews/{interview_id}/status")
async def status(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"status": DB[interview_id].status}
