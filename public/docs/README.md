
# FastAPI Stub for HR Interview App (Optional)

This minimal API lets candidates focus on the **frontend** while providing realistic endpoints.

## Endpoints
- `POST /api/interviews/upload` — Upload audio/video file (mp3, wav, mp4, mov; <= 100MB).
- `GET /api/interviews` — List interviews.
- `GET /api/interviews/{id}` — Get single interview details.
- `POST /api/interviews/{id}/transcribe` — Start simulated transcription (2s delay), attaches sample transcript & analysis.
- `GET /api/interviews/{id}/status` — Current status.

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export UPLOAD_DIR=./uploads
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Provided data
- `../sample_transcript.json` — Transcript with `{start, end, text}`.
- `../sample_analysis.json` — Summary, sentiment, keywords, Q&A.
