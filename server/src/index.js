const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const transcribeRoutes = require('./routes/transcribe');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  const key = process.env.OPENAI_API_KEY || '';
  res.json({
    ok: true,
    openaiKey: Boolean(key && key.startsWith('sk-')),
    whisperModel: process.env.WHISPER_MODEL || 'whisper-1',
    mongoConnected: mongoose.connection?.readyState === 1
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/transcribe', transcribeRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/altos';

// Start HTTP server regardless of DB status
app.listen(PORT, () => {
  const masked = (process.env.OPENAI_API_KEY || '').replace(/^(sk-..).+(..)$/,'$1***$2');
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  console.log(`OpenAI key detected: ${Boolean(process.env.OPENAI_API_KEY)} ${masked ? `(mask: ${masked})` : ''}`);
});

// Retry Mongo connection without crashing the process
const connectWithRetry = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
      setTimeout(connectWithRetry, 3000);
    });
};

connectWithRetry(); 