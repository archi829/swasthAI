const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tmp = path.join(__dirname, '..', '..', 'uploads', 'tmp');
    fs.mkdirSync(tmp, { recursive: true });
    cb(null, tmp);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext || '.webm'}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

function withDefaultAsrQuery(url) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('task')) u.searchParams.set('task', 'transcribe');
    if (!u.searchParams.has('encode')) u.searchParams.set('encode', 'true');
    return u.toString();
  } catch {
    return url;
  }
}

async function callLocalWhisper(filePath) {
  const base = process.env.LOCAL_WHISPER_URL;
  if (!base) return null;
  const url = withDefaultAsrQuery(base);
  const form = new FormData();
  // Common local servers expect 'audio_file'
  form.append('audio_file', fs.createReadStream(filePath));
  const resp = await axios.post(url, form, { headers: { ...form.getHeaders() }, maxBodyLength: Infinity });
  const text = resp.data?.text || resp.data?.result || resp.data?.transcript || (typeof resp.data === 'string' ? resp.data : '');
  return String(text || '');
}

async function callDeepgram(filePath) {
  if (!process.env.DEEPGRAM_API_KEY) {
    const err = new Error('Missing DEEPGRAM_API_KEY');
    err.status = 500;
    throw err;
  }
  const model = process.env.DEEPGRAM_MODEL || 'nova-2';
  const endpoint = `https://api.deepgram.com/v1/listen?model=${encodeURIComponent(model)}&punctuate=true&smart_format=true`;
  // Try to guess content type from extension; default to audio/webm
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.wav' ? 'audio/wav' : ext === '.mp3' ? 'audio/mpeg' : 'audio/webm';
  const resp = await axios.post(endpoint, fs.createReadStream(filePath), {
    headers: {
      Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      'Content-Type': contentType
    },
    maxBodyLength: Infinity
  });
  const text = resp.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
  return String(text || '');
}

async function callOpenAIWhisper(filePath) {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error('Missing OPENAI_API_KEY');
    err.status = 500;
    throw err;
  }
  const model = process.env.WHISPER_MODEL || 'whisper-1';
  const form = new FormData();
  form.append('model', model);
  form.append('response_format', 'verbose_json');
  form.append('file', fs.createReadStream(filePath));
  const headers = {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    ...form.getHeaders()
  };
  if (process.env.OPENAI_ORG_ID) headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;
  if (process.env.OPENAI_PROJECT) headers['OpenAI-Project'] = process.env.OPENAI_PROJECT;
  const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
    headers,
    maxBodyLength: Infinity
  });
  return String(response.data?.text || '');
}

function formatTranscript(rawText) {
  const cleaned = rawText
    .replace(/\b(uh|um|you know|like)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const labeled = sentences.map((s, idx) => `${idx % 2 === 0 ? 'Doctor' : 'Patient'}: ${s}`);
  return [`--- Conversation Start ---`, ...labeled, `--- Conversation End ---`].join('\n');
}

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

  const strategy = (process.env.TRANSCRIBE_STRATEGY || 'auto').toLowerCase();

  try {
    let text = '';

    if (strategy === 'local') {
      if (!process.env.LOCAL_WHISPER_URL) {
        return res.status(500).json({ error: 'LOCAL_WHISPER_URL not set for local transcription strategy' });
      }
      text = await callLocalWhisper(req.file.path);
    } else if (strategy === 'deepgram') {
      text = await callDeepgram(req.file.path);
    } else if (strategy === 'openai') {
      text = await callOpenAIWhisper(req.file.path);
    } else {
      // auto: prefer local, then deepgram, then openai
      if (!text && process.env.LOCAL_WHISPER_URL) {
        try {
          text = await callLocalWhisper(req.file.path);
        } catch (e) {
          console.error('Local whisper failed, trying Deepgram/OpenAI:', e?.response?.data || e.message);
        }
      }
      if (!text && process.env.DEEPGRAM_API_KEY) {
        try {
          text = await callDeepgram(req.file.path);
        } catch (e) {
          console.error('Deepgram failed, trying OpenAI:', e?.response?.data || e.message);
        }
      }
      if (!text) {
        text = await callOpenAIWhisper(req.file.path);
      }
    }

    const wrapped = formatTranscript(text);
    fs.unlink(req.file.path, () => {});
    return res.json({ transcript: wrapped });
  } catch (e) {
    fs.unlink(req.file.path, () => {});
    const status = e.status || e?.response?.status || 500;
    const msg = e?.response?.data?.error?.message || e?.response?.data || e.message || 'Transcription failed';
    console.error('Transcription error:', msg);
    return res.status(status).json({ error: String(msg) });
  }
});

module.exports = router; 