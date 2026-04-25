const Meeting = require('../models/Meeting.model');
const AttentionScore = require('../models/AttentionScore.model');
const { getRedis } = require('../config/redis');

const getAnalyticsOverview = async (userId, startDate, endDate) => {
  try {
    const cacheKey = `analytics:overview:${userId}:${startDate}:${endDate}`;
    const redis = getRedis();
    
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    const match = { userId, startTime: { $gte: startDate, $lte: endDate } };
    
    const [totalMeetings, avgAttention, totalActions, byPlatform] = await Promise.all([
      Meeting.countDocuments(match),
      AttentionScore.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avg: { $avg: '$overallScore' } } }
      ]),
      Meeting.aggregate([
        { $match: match },
        { $unwind: '$actionItems' },
        { $count: 'total' }
      ]),
      Meeting.aggregate([
        { $match: match },
        { $group: { _id: '$platform', count: { $sum: 1 } } }
      ])
    ]);

    const result = {
      totalMeetings,
      avgAttentionScore: avgAttention[0]?.avg || 0,
      actionItemsCreated: totalActions[0]?.total || 0,
      byPlatform: byPlatform.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    if (redis) {
      await redis.setex(cacheKey, 300, JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error('Get Analytics Overview Error:', error);
    throw error;
  }
};

const getAttentionAnalytics = async (userId, startDate, endDate) => {
  try {
    const attentionScores = await AttentionScore.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });

    return attentionScores;
  } catch (error) {
    console.error('Get Attention Analytics Error:', error);
    throw error;
  }
};

const getSpeakingAnalytics = async (userId, startDate, endDate) => {
  try {
    const meetings = await Meeting.find({
      userId,
      startTime: { $gte: startDate, $lte: endDate }
    });

    const speakingStats = {};
    
    meetings.forEach(meeting => {
      meeting.participants.forEach(p => {
        if (!speakingStats[p.email]) {
          speakingStats[p.email] = { name: p.name, email: p.email, totalTime: 0 };
        }
        speakingStats[p.email].totalTime += p.speakingTimeSeconds || 0;
      });
    });

    return Object.values(speakingStats).sort((a, b) => b.totalTime - a.totalTime);
  } catch (error) {
    console.error('Get Speaking Analytics Error:', error);
    throw error;
  }
};

const getTopicsAnalytics = async (userId, startDate, endDate) => {
  try {
    const meetings = await Meeting.find({
      userId,
      startTime: { $gte: startDate, $lte: endDate },
      topics: { $exists: true, $ne: [] }
    });

    const topicCounts = {};
    
    meetings.forEach(meeting => {
      meeting.topics?.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Get Topics Analytics Error:', error);
    throw error;
  }
};

const getIntegrationsAnalytics = async (userId) => {
  try {
    const meetings = await Meeting.find({
      userId,
      status: 'completed'
    }).sort({ createdAt: -1 }).limit(20);

    const platformStats = {};
    
    meetings.forEach(meeting => {
      Object.entries(meeting.integrationStatus || {}).forEach(([platform, status]) => {
        if (!platformStats[platform]) {
          platformStats[platform] = { success: 0, failed: 0, pending: 0 };
        }
        if (status === 'done') platformStats[platform].success++;
        else if (status === 'failed') platformStats[platform].failed++;
        else platformStats[platform].pending++;
      });
    });

    return platformStats;
  } catch (error) {
    console.error('Get Integrations Analytics Error:', error);
    throw error;
  }
};

module.exports = {
  getAnalyticsOverview,
  getAttentionAnalytics,
  getSpeakingAnalytics,
  getTopicsAnalytics,
  getIntegrationsAnalytics
};