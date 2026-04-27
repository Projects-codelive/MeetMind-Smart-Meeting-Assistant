'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  Brain, 
  Network, 
  Zap, 
  ArrowRight, 
  Bot, 
  User, 
  Command, 
  Terminal, 
  Database, 
  History,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockMeetings = [
  { id: '1', title: 'Weekly Team Standup', date: 'Today, 10:00 AM' },
  { id: '2', title: 'Product Roadmap Review', date: 'Yesterday, 2:00 PM' },
  { id: '3', title: '1:1 with Manager', date: 'Mar 20, 11:00 AM' },
];

const mockResponses = {
  decisions: 'STRATEGIC DECISIONS IDENTIFIED:\n\n1. Q3 ROADMAP: Approved with immediate focus on backend modernization.\n2. RESOURCE ALLOCATION: 2 new senior engineering nodes confirmed for next cycle.\n3. INFRASTRUCTURE BUDGET: $50,000 capital expenditure approved for neural tooling.',
  actionItems: 'OPERATIONAL TASKS EXTRACTED:\n\n• JIRA SYNCHRONIZATION: Update Q3 tickets by next cycle.\n• ENG FOLLOW-UP: Brief engineering leads on new modernization roadmap.\n• PR REVIEW: Immediate action required on PR #234 (Neural Core).',
  summary: 'EXECUTIVE SUMMARY:\n\nThe standup focused on Q3 operational velocity. Primary discourse centered on backend modernization barriers and the successful approval of new capital for specialized infrastructure. Sentiment remains exceptionally high across all development nodes.',
};

export default function AIChatPage() {
  const [selectedMeeting, setSelectedMeeting] = useState(mockMeetings[0].id);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Neural connection stabilized. Awaiting intelligence interrogation. I have indexed your meeting repository. What specific insights do you require?' },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setMessages([...messages, userMsg]);

    let response = 'I am optimized for decisions, action items, and executive summaries. Try: "Identify key decisions" or "Extract action items".';
    
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('decision')) response = mockResponses.decisions;
    else if (lowerQ.includes('action') || lowerQ.includes('task')) response = mockResponses.actionItems;
    else if (lowerQ.includes('summary') || lowerQ.includes('discuss')) response = mockResponses.summary;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 800);

    setQuestion('');
  };

  return (
    <div className="space-y-12 pb-20 h-[calc(100vh-140px)] flex flex-col">
      <motion.header 
        className="max-w-4xl space-y-8 flex-shrink-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="label-caps !text-blue-600 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/50">
            NEURAL INTERROGATION
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
            AI Assistant
          </h1>
          <p className="text-slate-800 text-xl font-semibold">
            Query your discourse repository for high-fidelity insights.
          </p>
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-[380px_1fr] gap-12 flex-1 min-h-0">
        {/* Context Selector Sidebar */}
        <div className="bg-white rounded-[3.5rem] border border-slate-200 p-10 flex flex-col min-h-0 relative overflow-hidden group shadow-[0_8px_40px_-12px_rgba(0,0,0,0.02)]">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
            <Fingerprint size={160} className="text-blue-600" strokeWidth={0.5} />
          </div>

          <div className="relative z-10 flex flex-col h-full space-y-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Database size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Context Index</h3>
                <div className="label-caps !text-blue-600 !text-[9px] font-black tracking-[0.3em]">ACTIVE REPOSITORY</div>
              </div>
            </div>

            <div className="space-y-4 overflow-auto flex-1 pr-2 scrollbar-hide">
              {mockMeetings.map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => setSelectedMeeting(meeting.id)}
                  className={cn(
                    "w-full text-left p-6 rounded-[2rem] transition-all duration-700 relative group/item border",
                    selectedMeeting === meeting.id 
                      ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm" 
                      : "bg-slate-50 text-slate-500 border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-200"
                  )}
                >
                  <div className="space-y-3">
                    <p className={cn("font-black text-sm tracking-tight leading-tight", selectedMeeting === meeting.id ? "text-blue-700" : "text-slate-900")}>{meeting.title}</p>
                    <div className="flex items-center gap-2">
                      <History size={10} className={selectedMeeting === meeting.id ? "text-blue-400" : "text-slate-400"} />
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", selectedMeeting === meeting.id ? "text-blue-400" : "text-slate-400")}>{meeting.date}</span>
                    </div>
                  </div>
                  {selectedMeeting === meeting.id && (
                    <motion.div layoutId="active-pointer" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Neural Link v4.2</span>
               </div>
               <Cpu size={14} className="text-slate-400" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col min-h-0 overflow-hidden relative">
          
          {/* Chat Messages */}
          <div className="flex-1 p-12 overflow-auto space-y-12 scrollbar-hide bg-slate-50/10">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex items-start gap-6 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all duration-700",
                  msg.role === 'user' ? "bg-white text-blue-600 border-slate-200" : "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                  {msg.role === 'user' ? <User size={20} strokeWidth={3} /> : <Bot size={20} strokeWidth={3} />}
                </div>

                <div className="space-y-3">
                  <div className={cn(
                    "px-10 py-8 rounded-[3rem] text-base font-bold leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/20" 
                      : "bg-white text-slate-900 rounded-tl-none border border-slate-200"
                  )}>
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-4" : ""}>{line}</p>
                    ))}
                  </div>
                  <div className={cn(
                    "flex items-center gap-3 px-6",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      {msg.role === 'user' ? "Interrogator" : "Neural Agent 4.2"}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Interface */}
          <div className="p-12 border-t border-slate-100 bg-white relative">
            <div className="absolute -top-6 left-12 px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-3 shadow-sm border border-blue-100">
              <Sparkles size={12} className="text-blue-500 animate-pulse" />
              Intelligence Mode: Absolute
            </div>

            <div className="relative max-w-5xl mx-auto w-full">
              <div className="absolute left-7 top-1/2 -translate-y-1/2">
                <Command size={18} className="text-slate-400" strokeWidth={3} />
              </div>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Submit intelligence query to Neural Engine..."
                className="w-full pl-16 pr-32 py-7 rounded-[2.5rem] border border-slate-200 bg-white shadow-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/40 transition-all duration-700"
              />
              <motion.button 
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all duration-700 shadow-2xl shadow-blue-500/20 flex items-center gap-3 border border-blue-400/30"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Execute</span>
                <Terminal className="h-4 w-4" strokeWidth={4} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
