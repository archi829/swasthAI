const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify password again before showing sensitive data
router.post('/verify', auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Missing password' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Incorrect password' });
    return res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 