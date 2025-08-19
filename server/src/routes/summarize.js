const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

function tryExtractJson(text) {
  if (!text) return null;
  try {
    // Strip code fences if present
    const cleaned = text.replace(/^```[a-zA-Z]*\n?|```$/g, '');
    return JSON.parse(cleaned);
  } catch (_) {
    // Try to find first JSON object in the text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch (_) {}
    }
    return null;
  }
}

router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body || {};
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Missing transcript' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing GROQ_API_KEY' });

    const model = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';

    const systemPrompt = `You are a clinical scribe. Given a raw doctor-patient conversation transcript, produce:
- A concise summary preserving all medical details
- 5-10 review points (1-2 lines each) suitable for quick approve/reject
Constraints:
- Keep natural conversational tone, not formal notes
- Remove fillers (uh, um, you know)
- Keep medical details intact
- Output strictly in JSON with keys: summary (string), points (string[])`;

    const userPrompt = `Transcript:\n${transcript}`;

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    };

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      payload,
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );

    const content = response.data?.choices?.[0]?.message?.content || '';
    const parsed = tryExtractJson(content);
    if (!parsed || typeof parsed.summary !== 'string' || !Array.isArray(parsed.points)) {
      return res.status(502).json({ error: 'Invalid model response', raw: content });
    }

    return res.json({ summary: parsed.summary, points: parsed.points });
  } catch (e) {
    const status = e?.response?.status || 500;
    const msg = e?.response?.data?.error?.message || e?.response?.data || e.message || 'Summarization failed';
    console.error('Summarize error:', msg);
    return res.status(status).json({ error: String(msg) });
  }
});

module.exports = router; 