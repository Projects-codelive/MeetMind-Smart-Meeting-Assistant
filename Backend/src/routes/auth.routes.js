const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email, name, avatar } = req.body;
    
    const user = await authController.createUser({
      id: clerkId,
      emailAddresses: [{ emailAddress: email }],
      fullName: name,
      imageUrl: avatar
    });
    
    res.json(user);
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'user.created' || type === 'user.updated') {
      await authController.createUser(data);
    } else if (type === 'user.deleted') {
      await authController.deleteUser(data.id);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const clerkId = req.headers['x-clerk-user-id'];
    
    // For development without Clerk, use a default user
    if (!clerkId) {
      const authController = require('../controllers/auth.controller');
      const user = await authController.getUserProfile('dev-user-001');
      if (user) {
        return res.json(user);
      }
      // Create dev user if not exists
      const newUser = await authController.createUser({
        id: 'dev-user-001',
        emailAddresses: [{ emailAddress: 'dev@localhost' }],
        fullName: 'Development User',
        imageUrl: ''
      });
      return res.json(newUser);
    }

    const user = await authController.getUserProfile(clerkId);
    res.json(user);
  } catch (error) {
    console.error('Get Me Error:', error);
    // Return mock user for development
    res.json({
      _id: '0000000000000000000000001',
      clerkId: 'dev-user',
      email: 'dev@localhost',
      name: 'Development User',
      plan: 'free',
      meetingsCount: 0,
      connectedIntegrations: [],
      settings: {
        language: 'en',
        autoSummary: true,
        attentionTracking: true,
        preMeetingBriefing: true,
        notificationEmail: true
      }
    });
  }
});

module.exports = router;