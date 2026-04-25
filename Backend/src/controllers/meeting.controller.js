const Meeting = require('../models/Meeting.model');
const Transcript = require('../models/Transcript.model');
const AttentionScore = require('../models/AttentionScore.model');

const createMeeting = async (userId, meetingData) => {
  try {
    const meeting = new Meeting({
      userId,
      title: meetingData.title || 'Untitled Meeting',
      platform: meetingData.platform || 'other',
      meetingUrl: meetingData.meetingUrl || '',
      startTime: meetingData.startTime || new Date()
    });

    await meeting.save();
    return meeting;
  } catch (error) {
    console.error('Create Meeting Error:', error);
    throw error;
  }
};

const getMeetings = async (userId, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const meetings = await Meeting.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Meeting.countDocuments({ userId });

    return { meetings, total, page, limit };
  } catch (error) {
    console.error('Get Meetings Error:', error);
    throw error;
  }
};

const getMeetingById = async (meetingId, userId) => {
  try {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return meeting;
  } catch (error) {
    console.error('Get Meeting Error:', error);
    throw error;
  }
};

const updateMeeting = async (meetingId, userId, updates) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: meetingId, userId },
      updates,
      { new: true }
    );
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return meeting;
  } catch (error) {
    console.error('Update Meeting Error:', error);
    throw error;
  }
};

const deleteMeeting = async (meetingId, userId) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: meetingId, userId });
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    await Transcript.deleteMany({ meetingId });
    await AttentionScore.deleteMany({ meetingId });

    return { success: true };
  } catch (error) {
    console.error('Delete Meeting Error:', error);
    throw error;
  }
};

const endMeeting = async (meetingId, userId) => {
  try {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - meeting.startTime) / 1000);

    meeting.status = 'processing';
    meeting.endTime = endTime;
    meeting.duration = duration;

    await meeting.save();
    return meeting;
  } catch (error) {
    console.error('End Meeting Error:', error);
    throw error;
  }
};

const getMeetingTranscript = async (meetingId, userId) => {
  try {
    const transcript = await Transcript.findOne({ meetingId, userId });
    if (!transcript) {
      return { segments: [], fullText: '', wordCount: 0 };
    }
    return transcript;
  } catch (error) {
    console.error('Get Transcript Error:', error);
    throw error;
  }
};

const getMeetingActions = async (meetingId, userId) => {
  try {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return meeting.actionItems || [];
  } catch (error) {
    console.error('Get Actions Error:', error);
    throw error;
  }
};

const updateActionItem = async (meetingId, userId, actionItemId, status) => {
  try {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const actionItem = meeting.actionItems.id(actionItemId);
    if (!actionItem) {
      throw new Error('Action item not found');
    }

    actionItem.status = status;
    await meeting.save();

    return actionItem;
  } catch (error) {
    console.error('Update Action Item Error:', error);
    throw error;
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  endMeeting,
  getMeetingTranscript,
  getMeetingActions,
  updateActionItem
};