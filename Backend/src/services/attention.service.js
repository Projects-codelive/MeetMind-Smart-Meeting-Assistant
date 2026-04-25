const AttentionScore = require('../models/AttentionScore.model');
const Meeting = require('../models/Meeting.model');

const processAttentionFrame = async (frameData, meetingId, participantEmail) => {
  try {
    const { eyesOnScreen, expression, headPose } = frameData;
    
    let score = 50;
    
    if (eyesOnScreen) score += 40;
    if (Math.abs(headPose?.yaw || 0) < 15 && Math.abs(headPose?.pitch || 0) < 15) score += 30;
    
    if (expression === 'engaged' || expression === 'nodding') score += 30;
    else if (expression === 'confused') score += 10;
    else if (expression === 'distracted') score = Math.min(score, 30);
    
    const attentionData = {
      timestamp: frameData.timestamp,
      score: Math.min(score, 100),
      eyesOnScreen,
      expression,
      headPose
    };

    let attentionRecord = await AttentionScore.findOne({ meetingId, participantEmail });
    
    if (!attentionRecord) {
      attentionRecord = new AttentionScore({
        meetingId,
        participantEmail,
        timeline: []
      });
    }
    
    attentionRecord.timeline.push(attentionData);
    await attentionRecord.save();
    
    return { score: attentionData.score, eyesOnScreen, expression, headPose };
  } catch (error) {
    console.error('Process Attention Frame Error:', error);
    throw error;
  }
};

const calculateFinalAttentionScore = async (meetingId, participantEmail) => {
  try {
    const attentionRecord = await AttentionScore.findOne({ meetingId, participantEmail });
    if (!attentionRecord) {
      return { overallScore: 0, distractionCount: 0, peakEngagementTime: 0 };
    }

    const timeline = attentionRecord.timeline;
    if (timeline.length === 0) {
      return { overallScore: 0, distractionCount: 0, peakEngagementTime: 0 };
    }

    const totalScore = timeline.reduce((sum, entry) => sum + entry.score, 0);
    const overallScore = Math.round(totalScore / timeline.length);

    let distractionCount = 0;
    let consecutiveDistracted = 0;
    
    timeline.forEach((entry, index) => {
      if (entry.score < 30) {
        consecutiveDistracted++;
        if (consecutiveDistracted >= 10) {
          distractionCount++;
        }
      } else {
        consecutiveDistracted = 0;
      }
    });

    let peakEngagementTime = 0;
    let peakScore = 0;
    
    timeline.forEach(entry => {
      if (entry.score > peakScore) {
        peakScore = entry.score;
        peakEngagementTime = entry.timestamp;
      }
    });

    attentionRecord.overallScore = overallScore;
    attentionRecord.distractionCount = distractionCount;
    attentionRecord.peakEngagementTime = peakEngagementTime;
    
    await attentionRecord.save();

    await Meeting.updateOne(
      { _id: meetingId, 'participants.email': participantEmail },
      { $set: { 'participants.$.attentionScore': overallScore } }
    );

    return { overallScore, distractionCount, peakEngagementTime };
  } catch (error) {
    console.error('Calculate Final Attention Score Error:', error);
    throw error;
  }
};

module.exports = {
  processAttentionFrame,
  calculateFinalAttentionScore
};