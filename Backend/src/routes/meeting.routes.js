const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');
const { PAGINATION } = require('../config/constants');

// Helper to get userId - either from Clerk or use dev user
const getUserId = async (req) => {
  const clerkId = req.headers['x-clerk-user-id'];
  if (!clerkId) {
    // Return dev user ID for development
    return '0000000000000000000000001';
  }
  
  const authController = require('../controllers/auth.controller');
  const user = await authController.getUserProfile(clerkId);
  return user?._id || '0000000000000000000000001';
};

router.post('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const meeting = await meetingController.createMeeting(userId, req.body);
    res.status(201).json(meeting);
  } catch (error) {
    console.error('Create Meeting Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    
    const result = await meetingController.getMeetings(userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Get Meetings Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const meeting = await meetingController.getMeetingById(req.params.id, userId);
    res.json(meeting);
  } catch (error) {
    console.error('Get Meeting Error:', error);
    res.status(404).json({ error: 'Meeting not found' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const meeting = await meetingController.updateMeeting(req.params.id, userId, req.body);
    res.json(meeting);
  } catch (error) {
    console.error('Update Meeting Error:', error);
    res.status(404).json({ error: 'Meeting not found' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    await meetingController.deleteMeeting(req.params.id, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Meeting Error:', error);
    res.status(404).json({ error: 'Meeting not found' });
  }
});

router.get('/:id/transcript', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const transcript = await meetingController.getMeetingTranscript(req.params.id, userId);
    res.json(transcript);
  } catch (error) {
    console.error('Get Transcript Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/actions', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const actions = await meetingController.getMeetingActions(req.params.id, userId);
    res.json(actions);
  } catch (error) {
    console.error('Get Actions Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/actions/:actionId', async (req, res) => {
  try {
    const userId = await getUserId(req);
    
    const { status } = req.body;
    const action = await meetingController.updateActionItem(req.params.id, userId, req.params.actionId, status);
    res.json(action);
  } catch (error) {
    console.error('Update Action Error:', error);
    res.status(404).json({ error: 'Action item not found' });
  }
});

module.exports = router;