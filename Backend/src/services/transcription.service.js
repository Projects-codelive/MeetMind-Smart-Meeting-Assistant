const Transcript = require('../models/Transcript.model');

const processAudioChunk = async (audioBuffer, meetingId, userId, timestamp) => {
  // Mock transcription for demo - in production use Groq or AssemblyAI
  const mockSpeakers = ['Speaker 1', 'Speaker 2', 'Speaker 3'];
  const mockTexts = [
    'Let\'s discuss the project timeline.',
    'I think we should prioritize the backend first.',
    'Agreed. Let me update the task list.',
    'Can we schedule a follow-up for next week?',
    'I\'ll handle the database integration.'
  ];
  
  const segment = {
    speaker: mockSpeakers[Math.floor(Math.random() * mockSpeakers.length)],
    text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
    startTime: timestamp,
    endTime: timestamp + 5,
    confidence: 0.9
  };

  return segment;
};

const buildFullTranscript = async (meetingId) => {
  try {
    const transcript = await Transcript.findOne({ meetingId });
    if (!transcript) return null;

    transcript.fullText = transcript.segments.map(s => s.text).join(' ');
    transcript.wordCount = transcript.fullText.split(/\s+/).length;
    
    await transcript.save();
    
    return transcript;
  } catch (error) {
    console.error('Build Full Transcript Error:', error);
    return null;
  }
};

const detectLanguage = async (text) => {
  return 'en';
};

const saveTranscriptSegment = async (meetingId, userId, segment) => {
  try {
    let transcript = await Transcript.findOne({ meetingId });
    
    if (!transcript) {
      transcript = new Transcript({
        meetingId,
        userId,
        segments: []
      });
    }
    
    transcript.segments.push(segment);
    await transcript.save();
    
    return transcript;
  } catch (error) {
    console.error('Save Transcript Segment Error:', error);
    throw error;
  }
};

module.exports = {
  processAudioChunk,
  buildFullTranscript,
  detectLanguage,
  saveTranscriptSegment
};