const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

const getUserId = (req) => {
  const clerkId = req.headers['x-clerk-user-id'];
  if (!clerkId) return '0000000000000000000000001';
  return clerkId;
};

const getDateRange = (range) => {
  const end = new Date();
  const start = new Date();
  
  switch (range) {
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case '3m':
      start.setMonth(start.getMonth() - 3);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }
  
  return { start, end };
};

router.get('/overview', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { start, end } = getDateRange(req.query.range);
    
    try {
      const overview = await analyticsController.getAnalyticsOverview(userId, start, end);
      return res.json(overview);
    } catch (err) {
      // Return mock data if DB not connected
      return res.json({
        totalMeetings: 5,
        avgAttentionScore: 82,
        actionItemsCreated: 12,
        byPlatform: { 'google-meet': 3, 'zoom': 2 }
      });
    }
  } catch (error) {
    console.error('Analytics Overview Error:', error);
    res.json({
      totalMeetings: 5,
      avgAttentionScore: 82,
      actionItemsCreated: 12,
      byPlatform: { 'google-meet': 3, 'zoom': 2 }
    });
  }
});

router.get('/attention', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { start, end } = getDateRange(req.query.range);
    
    try {
      const attention = await analyticsController.getAttentionAnalytics(userId, start, end);
      res.json(attention);
    } catch (err) {
      res.json([]);
    }
  } catch (error) {
    console.error('Attention Analytics Error:', error);
    res.json([]);
  }
});

router.get('/speaking', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { start, end } = getDateRange(req.query.range);
    
    try {
      const speaking = await analyticsController.getSpeakingAnalytics(userId, start, end);
      res.json(speaking);
    } catch (err) {
      res.json([
        { name: 'John', email: 'john@example.com', totalTime: 1200 },
        { name: 'Jane', email: 'jane@example.com', totalTime: 900 }
      ]);
    }
  } catch (error) {
    console.error('Speaking Analytics Error:', error);
    res.json([
      { name: 'John', email: 'john@example.com', totalTime: 1200 },
      { name: 'Jane', email: 'jane@example.com', totalTime: 900 }
    ]);
  }
});

router.get('/topics', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    try {
      const topics = await analyticsController.getTopicsAnalytics(userId, new Date(), new Date());
      res.json(topics);
    } catch (err) {
      res.json([
        { topic: 'Product Roadmap', count: 5 },
        { topic: 'Q3 Budget', count: 3 },
        { topic: 'Hiring Plan', count: 2 }
      ]);
    }
  } catch (error) {
    console.error('Topics Analytics Error:', error);
    res.json([
      { topic: 'Product Roadmap', count: 5 },
      { topic: 'Q3 Budget', count: 3 },
      { topic: 'Hiring Plan', count: 2 }
    ]);
  }
});

router.get('/integrations', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    try {
      const integrations = await analyticsController.getIntegrationsAnalytics(userId);
      res.json(integrations);
    } catch (err) {
      res.json({
        notion: { success: 8, failed: 1, pending: 1 },
        slack: { success: 6, failed: 0, pending: 4 }
      });
    }
  } catch (error) {
    console.error('Integrations Analytics Error:', error);
    res.json({
      notion: { success: 8, failed: 1, pending: 1 },
      slack: { success: 6, failed: 0, pending: 4 }
    });
  }
});

module.exports = router;