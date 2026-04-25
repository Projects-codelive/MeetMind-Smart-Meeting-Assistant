const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

const getUserId = (req) => {
  const clerkId = req.headers['x-clerk-user-id'];
  if (!clerkId) return '0000000000000000000000001';
  return clerkId;
};

router.post('/qa', async (req, res) => {
  try {
    const { meetingId, question } = req.body;
    
    if (!meetingId || !question) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const answer = await aiController.answerQuestion(meetingId, question);
      res.json({ answer });
    } catch (error) {
      res.status(500).json({ error: 'Failed to answer question' });
    }
  } catch (error) {
    console.error('Q&A Error:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

router.post('/summary/:meetingId', async (req, res) => {
  try {
    const { summary } = req.body;
    res.json({ summary });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

router.get('/briefing', async (req, res) => {
  try {
    res.json({ briefing: '' });
  } catch (error) {
    console.error('Briefing Error:', error);
    res.status(500).json({ error: 'Failed to get briefing' });
  }
});

router.post('/latejoin', async (req, res) => {
  try {
    const { transcript, joinTimestamp } = req.body;
    
    try {
      const summary = await aiController.generateLateJoinerSummary(transcript, joinTimestamp);
      res.json({ summary });
    } catch (error) {
      res.json({ summary: 'No transcript available.' });
    }
  } catch (error) {
    console.error('Late Joiner Error:', error);
    res.json({ summary: 'No transcript available.' });
  }
});

module.exports = router;