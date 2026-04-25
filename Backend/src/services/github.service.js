const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const createGitHubClient = (integration) => {
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `Bearer ${integration.accessToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
};

const createIssuesFromTechnicalTasks = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'github', isActive: true });
    if (!integration) {
      throw new Error('GitHub not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    if (!meeting.actionItems || meeting.actionItems.length === 0) {
      await Meeting.updateOne(
        { _id: meetingId },
        { $set: { 'integrationStatus.github': 'skipped' } }
      );
      return [];
    }

    const repoName = integration.config?.repo || 'organization/repo';
    const [owner, repo] = repoName.split('/');

    const githubClient = createGitHubClient(integration);

    const technicalKeywords = ['fix', 'bug', 'error', 'code', 'implement', 'build', 'deploy', 'refactor', 'api', 'feature', 'component'];
    const technicalItems = meeting.actionItems.filter(item =>
      technicalKeywords.some(k => item.task.toLowerCase().includes(k))
    );

    const createdIssues = [];

    for (const item of technicalItems) {
      const response = await githubClient.post(`/repos/${owner}/${repo}/issues`, {
        title: item.task,
        body: `Auto-created by MeetMind from meeting: ${meeting.title}\n\nContext: ${meeting.summary || 'See transcript for full context.'}\n\n**Assignee:** ${item.assignee || 'Unassigned'}`,
        labels: ['meetmind', ...(meeting.topics || [])]
      });

      createdIssues.push({ number: response.data.number, url: response.data.html_url });
    }

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.github': 'done' } }
    );

    return createdIssues;
  } catch (error) {
    console.error('GitHub Create Issues Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.github': 'failed' } }
    );
    throw error;
  }
};

module.exports = {
  createIssuesFromTechnicalTasks
};