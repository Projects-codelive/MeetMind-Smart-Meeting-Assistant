const { Queue, Worker } = require('bullmq');
const { connectRedis } = require('../config/redis');
const Meeting = require('../models/Meeting.model');
const aiService = require('../services/ai.service');
const notionService = require('../services/notion.service');
const slackService = require('../services/slack.service');
const gmailService = require('../services/gmail.service');
const gcalendarService = require('../services/gcalendar.service');
const jiraService = require('../services/jira.service');
const githubService = require('../services/github.service');
const salesforceService = require('../services/salesforce.service');
const asanaService = require('../services/asana.service');

let connection = connectRedis();

const postMeetingQueue = new Queue('post-meeting-integrations', { connection });

const integrationsJob = async (job) => {
  const { meetingId, userId, integrations } = job.data;
  const results = {};

  for (const platform of integrations || []) {
    try {
      switch (platform) {
        case 'notion':
          results[platform] = await notionService.createMeetingPage(meetingId, userId);
          break;
        case 'slack':
          results[platform] = await slackService.postMeetingSummary(meetingId, userId);
          await slackService.sendDirectActionItemAlerts(meetingId, userId);
          break;
        case 'gmail':
          results[platform] = await gmailService.sendFollowUpEmail(meetingId, userId);
          break;
        case 'gcalendar':
          results[platform] = await gcalendarService.autoScheduleFollowUps(meetingId, userId);
          break;
        case 'jira':
          results[platform] = await jiraService.createIssuesFromActionItems(meetingId, userId);
          break;
        case 'github':
          results[platform] = await githubService.createIssuesFromTechnicalTasks(meetingId, userId);
          break;
        case 'salesforce':
          results[platform] = await salesforceService.updateCRMFromMeeting(meetingId, userId);
          break;
        case 'asana':
          results[platform] = await asanaService.createTasksFromActionItems(meetingId, userId);
          break;
        default:
          console.log(`Skipping unsupported integration: ${platform}`);
      }
    } catch (error) {
      console.error(`Integration ${platform} failed:`, error);
      await Meeting.updateOne(
        { _id: meetingId },
        { $set: { [`integrationStatus.${platform}`]: 'failed' } }
      );
    }
  }

  return results;
};

const aiJob = async (job) => {
  const { meetingId, transcript } = job.data;
  
  const [summary, actionItems, decisions, topics, sentiment] = await Promise.all([
    aiService.generateSummary(transcript),
    aiService.extractActionItems(transcript, []),
    aiService.extractKeyDecisions(transcript),
    aiService.detectMeetingTopics(transcript),
    aiService.calculateSentiment(transcript)
  ]);

  await Meeting.findByIdAndUpdate(meetingId, {
    summary,
    actionItems,
    keyDecisions: decisions,
    topics,
    sentiment
  });

  return { summary, actionItems, decisions, topics, sentiment };
};

module.exports = {
  postMeetingQueue,
  integrationsJob,
  aiJob
};