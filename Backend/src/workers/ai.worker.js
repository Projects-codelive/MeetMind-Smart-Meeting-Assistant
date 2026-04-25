const { Queue, Worker } = require('bullmq');
const { connectRedis } = require('../config/redis');
const aiService = require('../services/ai.service');
const Meeting = require('../models/Meeting.model');

const connection = connectRedis();

const aiQueue = new Queue('ai-processing', { connection });

const processAIJob = async (job) => {
  const { meetingId, userId, transcript } = job.data;
  
  const [summary, actionItems, decisions, topics, sentiment] = await Promise.all([
    aiService.generateSummary(transcript),
    aiService.extractActionItems(transcript, []),
    aiService.extractKeyDecisions(transcript),
    aiService.detectMeetingTopics(transcript),
    aiService.calculateSentiment(transcript)
  ]);

  const cost = aiService.estimateMeetingCost(
    [],
    Math.floor((Meeting.duration || 0) / 60)
  );

  await Meeting.findByIdAndUpdate(meetingId, {
    summary,
    actionItems,
    keyDecisions: decisions,
    topics,
    sentiment,
    meetingCost: cost,
    status: 'completed'
  });

  return { summary, actionItems, decisions, topics, sentiment };
};

module.exports = {
  aiQueue,
  processAIJob
};