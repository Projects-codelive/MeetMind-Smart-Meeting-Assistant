const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Integration = require('../models/Integration.model');

const createAsanaClient = (integration) => {
  return axios.create({
    baseURL: 'https://app.asana.com/api/1.0',
    headers: {
      'Authorization': `Bearer ${integration.accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

const createTasksFromActionItems = async (meetingId, userId) => {
  try {
    const integration = await Integration.findOne({ userId, platform: 'asana', isActive: true });
    if (!integration) {
      throw new Error('Asana not connected');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    if (!meeting.actionItems || meeting.actionItems.length === 0) {
      await Meeting.updateOne(
        { _id: meetingId },
        { $set: { 'integrationStatus.asana': 'skipped' } }
      );
      return [];
    }

    const asanaClient = createAsanaClient(integration);
    const projectGid = integration.config?.projectGid || integration.platformWorkspace;

    const createdTasks = [];

    for (const item of meeting.actionItems) {
      const taskData = {
        name: item.task,
        notes: `Auto-created by MeetMind from meeting: ${meeting.title}\n\nContext: ${meeting.summary || 'See transcript.'}`,
        projects: [projectGid]
      };

      if (item.dueDate) {
        taskData.due_on = new Date(item.dueDate).toISOString().split('T')[0];
      }

      const response = await asanaClient.post('/tasks', taskData);
      createdTasks.push(response.data.data.gid);
    }

    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.asana': 'done' } }
    );

    return createdTasks;
  } catch (error) {
    console.error('Asana Create Tasks Error:', error);
    await Meeting.updateOne(
      { _id: meetingId },
      { $set: { 'integrationStatus.asana': 'failed' } }
    );
    throw error;
  }
};

module.exports = {
  createTasksFromActionItems
};