const axios = require('axios');
const Meeting = require('../models/Meeting.model');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const headers = {
  'Authorization': `Bearer ${GROQ_API_KEY}`,
  'Content-Type': 'application/json'
};

const generateSummary = async (transcript, meetingTitle) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting analyst. Given the following meeting transcript, generate a concise executive summary in 3-5 sentences. Focus on what was discussed, what was decided, and what comes next. Be factual and clear.'
        },
        { role: 'user', content: transcript }
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

const extractActionItems = async (transcript, participants) => {
  try {
    const participantList = participants.map(p => p.name || p.email).join(', ');
    
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting action items from meeting transcripts. Identify every task, commitment, or next step mentioned. For each one, extract: the task description, the person responsible (match to participants list: ${participantList}), and any mentioned deadline. Return as JSON array: [{task, assignee, dueDate, priority}]`
        },
        { role: 'user', content: transcript }
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

const extractKeyDecisions = async (transcript) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Identify the key decisions made in this meeting. List only actual decisions, not discussions. Return as a JSON array of decision strings.'
        },
        { role: 'user', content: transcript }
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
    console.error('Extract Decisions Error:', error.response?.data || error.message);
    return [];
  }
};

const detectMeetingTopics = async (transcript) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Identify the main topics discussed in this meeting. Return as a JSON array of 3-7 topic strings (e.g., "Q3 Budget", "Product Roadmap", "Hiring Plan").'
        },
        { role: 'user', content: transcript }
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

const detectFollowUpMeetings = async (transcript) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Identify follow-up meetings or calls mentioned in this transcript. Extract: title, participants mentioned, date/time if mentioned, purpose. Return as JSON array: [{title, participants, dateHint, purpose}]'
        },
        { role: 'user', content: transcript }
      ],
      max_tokens: 500,
      temperature: 0.2
    }, { headers });

    try {
      const jsonMatch = response.data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Parse Follow-up Error:', parseError);
    }
    return [];
  } catch (error) {
    console.error('Detect Follow-up Error:', error.response?.data || error.message);
    return [];
  }
};

const generateLateJoinerSummary = async (transcript, joinTimestamp) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You joined the meeting ${joinTimestamp} minutes late. Summarize what was discussed before you joined in 3-5 bullet points, so you can catch up instantly.`
        },
        { role: 'user', content: transcript }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Late Joiner Summary Error:', error.response?.data || error.message);
    return '';
  }
};

const answerQuestion = async (transcriptText, question) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant with access to meeting transcripts. Answer the user\'s question based ONLY on the provided transcript data. If the answer is not in the transcript, say so. Be concise and cite the speaker when possible.'
        },
        { role: 'user', content: `Transcript:\n${transcriptText}\n\nQuestion: ${question}` }
      ],
      max_tokens: 1000,
      temperature: 0.3
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Answer Question Error:', error.response?.data || error.message);
    return 'Unable to answer based on transcript.';
  }
};

const generatePreMeetingBriefing = async (previousMeetings, upcomingTitle) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Generate a 5-minute briefing for an upcoming meeting titled "${upcomingTitle}". Use previous meeting notes. Remind what was decided last time, what action items are pending, and what to prepare. Keep it under 150 words.`
        },
        { role: 'user', content: `Previous meetings:\n${previousMeetings}` }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Pre-meeting Briefing Error:', error.response?.data || error.message);
    return '';
  }
};

const calculateSentiment = async (transcript) => {
  try {
    const response = await axios.post(GROQ_URL, {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Analyze the overall meeting tone. Return only a single word: "positive", "neutral", or "negative".'
        },
        { role: 'user', content: transcript }
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
    console.error('Sentiment Error:', error.response?.data || error.message);
    return 'neutral';
  }
};

const estimateMeetingCost = (participants, durationMinutes) => {
  const avgHourlyRate = 50;
  const participantCount = participants.length || 1;
  return participantCount * avgHourlyRate * (durationMinutes / 60);
};

module.exports = {
  generateSummary,
  extractActionItems,
  extractKeyDecisions,
  detectMeetingTopics,
  detectFollowUpMeetings,
  generateLateJoinerSummary,
  answerQuestion,
  generatePreMeetingBriefing,
  calculateSentiment,
  estimateMeetingCost
};