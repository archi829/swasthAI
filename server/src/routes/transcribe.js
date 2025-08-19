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

router.post('/', upload.single('audio'), async (req, res) => {
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
  if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

  try {
    const model = process.env.WHISPER_MODEL || 'whisper-1';

    const form = new FormData();
    form.append('model', model);
    form.append('response_format', 'verbose_json');
    form.append('file', fs.createReadStream(req.file.path));

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      },
      maxBodyLength: Infinity
    });

    const text = response.data.text || '';

    const cleaned = text
      .replace(/\b(uh|um|you know|like)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);

    const labeled = sentences.map((s, idx) => `${idx % 2 === 0 ? 'Doctor' : 'Patient'}: ${s}`);

    const wrapped = [`--- Conversation Start ---`, ...labeled, `--- Conversation End ---`].join('\n');

    fs.unlink(req.file.path, () => {});

    return res.json({ transcript: wrapped });
  } catch (e) {
    fs.unlink(req.file.path, () => {});
    const status = e?.response?.status || 500;
    const msg = e?.response?.data?.error?.message || e?.response?.data || e.message || 'Transcription failed';
    console.error('Transcription error:', msg);
    return res.status(status).json({ error: String(msg) });
  }
});

module.exports = router; 