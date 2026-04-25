'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const mockMeetings = [
  { id: '1', title: 'Weekly Team Standup' },
  { id: '2', title: 'Product Roadmap Review' },
  { id: '3', title: '1:1 with Manager' },
];

const mockResponses = {
  decisions: 'The key decisions made in this meeting were:\n1. Approved Q3 roadmap with priority on backend modernization\n2. Hired 2 new developers starting next month\n3. Budget of $50K approved for new tooling',
  actionItems: 'Based on the transcript, your action items are:\n1. Update Jira tickets for Q3 - Due: Next week\n2. Schedule follow-up with engineering team - Due: Tomorrow\n3. Review PR #234 - Due: Today',
  summary: 'This was the weekly standup where the team discussed progress on the Q3 roadmap, blockers around database migration, and the upcoming hiring plan. Key focus was on completing the backend modernization by end of Q3.',
};

export default function AIChatPage() {
  const [selectedMeeting, setSelectedMeeting] = useState(mockMeetings[0].id);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi! I can answer questions about your meetings. Select a meeting and ask me anything.' },
  ]);

  const handleSend = () => {
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setMessages([...messages, userMsg]);

    // Mock response based on keywords
    let response = 'I can answer questions about meeting decisions, action items, or summarize discussions. Try asking "What were the key decisions?" or "What are my action items?"';
    
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('decision')) response = mockResponses.decisions;
    else if (lowerQ.includes('action') || lowerQ.includes('task')) response = mockResponses.actionItems;
    else if (lowerQ.includes('summary') || lowerQ.includes('discuss')) response = mockResponses.summary;

    setTimeout(() => {
      setMessages([...messages, userMsg, { role: 'assistant', content: response }]);
    }, 500);

    setQuestion('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="text-gray-600">Ask questions about any past meeting</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Meeting Selector */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Select Meeting</h3>
          <div className="space-y-2">
            {mockMeetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting.id)}
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedMeeting === meeting.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {meeting.title}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 border rounded-lg flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'} px-4 py-2 rounded-lg max-w-[80%]`}>
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about this meeting..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}