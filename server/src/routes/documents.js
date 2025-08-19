const express = require('express');
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const Document = require('../models/Document');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new Error('Only PDF files allowed'));
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Create/upload document
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { date_of_visit, hospital_name } = req.body;
    if (!date_of_visit || !req.file) return res.status(400).json({ error: 'Missing fields' });
    const file_path = `/uploads/${req.file.filename}`;
    const doc = await Document.create({
      user_id: req.user.id,
      file_path,
      date_of_visit,
      hospital_name,
      uploaded_at: new Date()
    });
    res.json({ id: doc._id, file_url: file_path, date_of_visit: doc.date_of_visit, hospital_name: doc.hospital_name });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List user's documents
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ user_id: req.user.id }).sort({ uploaded_at: -1 });
    res.json(
      docs.map((d) => ({ id: String(d._id), date_of_visit: d.date_of_visit, hospital_name: d.hospital_name, file_url: d.file_path }))
    );
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 