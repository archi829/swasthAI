# Altos – Healthcare Assistant (Frontend + Backend)

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB URI)
- Optional transcription providers:
  - Deepgram API key (no Docker/OpenAI)
  - OR OpenAI key (Whisper)
  - OR Local Whisper server (Docker)
- Optional summarization providers:
  - Local Python service (Pegasus/BART via FastAPI)
  - OR Groq API key

## Clone & Install
```powershell
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git altos
cd .\altos
npm install
cd .\server
npm install
```

## Configure Environment (backend)
Create `server/.env` with ONE of the following strategies.

### Option A: Deepgram transcription + Local summarizer (recommended, no OpenAI)
```dotenv
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/altos
JWT_SECRET=change_me

# Transcription via Deepgram
TRANSCRIBE_STRATEGY=deepgram
DEEPGRAM_API_KEY=dg-REPLACE_ME

# Summarization via local Python service
SUMMARIZE_STRATEGY=local
SUMMARIZER_URL=http://127.0.0.1:8050/summarize
```

### Option B: Deepgram transcription + Groq summarization
```dotenv
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/altos
JWT_SECRET=change_me

TRANSCRIBE_STRATEGY=deepgram
DEEPGRAM_API_KEY=dg-REPLACE_ME

SUMMARIZE_STRATEGY=groq
GROQ_API_KEY=grq-REPLACE_ME
GROQ_MODEL=llama-3.1-70b-versatile
```

### Option C: Local Whisper transcription
```dotenv
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/altos
JWT_SECRET=change_me

TRANSCRIBE_STRATEGY=local
LOCAL_WHISPER_URL=http://127.0.0.1:9000/asr

# Summarizer can be local or groq (choose one)
SUMMARIZE_STRATEGY=local
SUMMARIZER_URL=http://127.0.0.1:8050/summarize
```

### Option D: OpenAI Whisper transcription (requires active billing)
```dotenv
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/altos
JWT_SECRET=change_me

TRANSCRIBE_STRATEGY=openai
OPENAI_API_KEY=sk-REPLACE_ME
WHISPER_MODEL=whisper-1

# Optional org/project headers if your key requires them
# OPENAI_ORG_ID=org_XXXXXXXX
# OPENAI_PROJECT=proj_XXXXXXXX

# Summarizer can be local or groq (choose one)
SUMMARIZE_STRATEGY=groq
GROQ_API_KEY=grq-REPLACE_ME
GROQ_MODEL=llama-3.1-70b-versatile
```

## Start Local Summarizer (only if using `SUMMARIZE_STRATEGY=local`)
```powershell
cd .\services\summarizer
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8050
```

## Start Backend
```powershell
cd .\server
npm run dev
```
- Health check: `http://127.0.0.1:4000/api/health`

## Start Frontend
```powershell
cd ..
npm run dev
```
- App: `http://localhost:5173`

## App Guide
- Patients: `/patients`
  - Login/Register, upload PDFs (date of visit required), list/download own docs
  - “View Older Records” is locked until password re-verification
- Doctors: `/doctors`
  - Voice to Text: record → transcription via configured provider
  - AI Summary: generates a concise medical summary
  - Review & Approve: 1–2 line points with Approve (green) / Reject (red)

## Troubleshooting
- Proxy 401 or 502
  - Backend not running or env missing. Check `/api/health`.
- Port in use (EADDRINUSE: 4000)
  - Kill the process on 4000 or change `PORT` in `.env` and update proxy in `vite.config.ts`.
- OpenAI 401/Quota
  - Invalid key or no active billing on the account/project. Prefer Deepgram or local.
- “Transcription failed” with local Whisper
  - Ensure `LOCAL_WHISPER_URL` is reachable. For Docker option:
    ```powershell
    docker run --rm -p 9000:9000 -e ASR_MODEL=small onerahmet/openai-whisper-asr-webservice:latest
    ```
- Patients docs hidden after login
  - Re-enter password in the “Unlock Older Records” box to view.

## Deploy Notes
- `.gitignore` excludes `node_modules`, `server/uploads`, and env files.
- Use secrets in CI/CD; never commit API keys.
