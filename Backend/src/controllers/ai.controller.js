const axios = require('axios');
const Meeting = require('../models/Meeting.model');
const Transcript = require('../models/Transcript.model');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const headers = {
  'Authorization': `Bearer ${GROQ_API_KEY}`,
  'Content-Type': 'application/json'
};

const generateSummary = async (transcriptText, meetingTitle) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting analyst. Given the following meeting transcript, generate a concise executive summary in 3-5 sentences. Focus on what was discussed, what was decided, and what comes next. Be factual and clear.'
        },
        { role: 'user', content: transcriptText }
      ],
      max_tokens: 1000,
      temperature: 0.3
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Generate Summary Error:', error.response?.data || error.message);
    return '';
  }
};

const extractActionItems = async (transcriptText, participants) => {
  try {
    const participantList = participants.map(p => p.name || p.email).join(', ');
    
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting action items from meeting transcripts. Identify every task, commitment, or next step mentioned. For each one, extract: the task description, the person responsible (match to participants list: ${participantList}), and any mentioned deadline. Return as JSON array: [{task, assignee, dueDate, priority}]`
        },
        { role: 'user', content: transcriptText }
      ],
      max_tokens: 1500,
      temperature: 0.2
    }, { headers });

    try {
      const jsonMatch = response.data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Parse Action Items Error:', parseError);
    }
    return [];
  } catch (error) {
    console.error('Extract Action Items Error:', error.response?.data || error.message);
    return [];
  }
};

const extractKeyDecisions = async (transcriptText) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Identify the key decisions made in this meeting. List only actual decisions, not discussions. Return as a JSON array of decision strings.'
        },
        { role: 'user', content: transcriptText }
      ],
      max_tokens: 1000,
      temperature: 0.2
    }, { headers });

    try {
      const jsonMatch = response.data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Parse Decisions Error:', parseError);
    }
    return [];
  } catch (error) {
    console.error('Extract Key Decisions Error:', error.response?.data || error.message);
    return [];
  }
};

const detectMeetingTopics = async (transcriptText) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Identify the main topics discussed in this meeting. Return as a JSON array of 3-7 topic strings (e.g., "Q3 Budget", "Product Roadmap", "Hiring Plan").'
        },
        { role: 'user', content: transcriptText }
      ],
      max_tokens: 500,
      temperature: 0.2
    }, { headers });

    try {
      const jsonMatch = response.data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Parse Topics Error:', parseError);
    }
    return [];
  } catch (error) {
    console.error('Detect Topics Error:', error.response?.data || error.message);
    return [];
  }
};

const answerQuestion = async (meetingId, question) => {
  try {
    const transcript = await Transcript.findOne({ meetingId });
    if (!transcript || !transcript.fullText) {
      return 'No transcript available for this meeting.';
    }

    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant with access to meeting transcripts. Answer the user\'s question based ONLY on the provided transcript data. If the answer is not in the transcript, say so. Be concise and cite the speaker when possible.'
        },
        { role: 'user', content: `Transcript:\n${transcript.fullText}\n\nQuestion: ${question}` }
      ],
      max_tokens: 1000,
      temperature: 0.3
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Answer Question Error:', error.response?.data || error.message);
    throw error;
  }
};

const calculateSentiment = async (transcriptText) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Analyze the overall meeting tone. Return only a single word: "positive", "neutral", or "negative".'
        },
        { role: 'user', content: transcriptText }
      ],
      max_tokens: 100,
      temperature: 0.1
    }, { headers });

    const sentiment = response.data.choices[0].message.content.toLowerCase().trim();
    if (['positive', 'neutral', 'negative'].includes(sentiment)) {
      return sentiment;
    }
    return 'neutral';
  } catch (error) {
    console.error('Calculate Sentiment Error:', error);
    return 'neutral';
  }
};

const estimateMeetingCost = (participants, durationSeconds) => {
  const avgHourlyRate = 50;
  const durationHours = durationSeconds / 3600;
  const participantCount = participants.length || 1;
  return participantCount * avgHourlyRate * durationHours;
};

const generateLateJoinerSummary = async (transcriptText, joinTimestamp) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `The user joined the meeting ${joinTimestamp} minutes late. Summarize what was discussed before they joined in 3-5 bullet points, so they can catch up instantly.`
        },
        { role: 'user', content: transcriptText }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Generate Late Joiner Summary Error:', error);
    throw error;
  }
};

module.exports = {
  generateSummary,
  extractActionItems,
  extractKeyDecisions,
  detectMeetingTopics,
  answerQuestion,
  calculateSentiment,
  estimateMeetingCost,
  generateLateJoinerSummary
};