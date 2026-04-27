'use client';

import Link from 'next/link';
import { Calendar, Search, Filter, Plus, ArrowRight, Zap, Network, Users, Timer, Sparkles, Activity } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const meetings = [
  { id: '1', title: 'Weekly Team Standup', date: 'Today, 10:00 AM', duration: '30 min', status: 'completed', platform: 'google-meet', participants: 4, sentiment: 92 },
  { id: '2', title: 'Product Roadmap Review', date: 'Yesterday, 2:00 PM', duration: '60 min', status: 'completed', platform: 'zoom', participants: 6, sentiment: 88 },
  { id: '3', title: '1:1 with Manager', date: 'Mar 20, 11:00 AM', duration: '30 min', status: 'completed', platform: 'teams', participants: 2, sentiment: 95 },
];

const platformColors = {
  'google-meet': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100/50' },
  'zoom': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100/50' },
  'teams': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100/50' },
};

function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.4);
    mouseY.set(y * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function MeetingsPage() {
  return (
    <div className="space-y-20 pb-20">
      <motion.header 
        className="flex flex-col md:flex-row md:items-end justify-between gap-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="space-y-6">
          <div className="label-caps !text-blue-600 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/50 w-fit">
            DISCOURSE REPOSITORY
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
              Meetings
            </h1>
            <p className="text-slate-800 text-xl font-semibold">
              Manage and interrogate your collective meeting history.
            </p>
          </div>
        </div>
        
        <MagneticButton className="group relative flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all overflow-hidden border border-blue-400/30">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Plus className="relative z-10 w-5 h-5" strokeWidth={4} />
          <span className="relative z-10">Capture Meeting</span>
        </MagneticButton>
      </motion.header>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" strokeWidth={3} />
          <input
            type="text"
            placeholder="Semantic search within transcripts..."
            className="w-full pl-16 pr-10 py-6 rounded-[2.5rem] border border-slate-200 bg-white shadow-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/40 transition-all duration-700"
          />
        </div>
        <button className="flex items-center gap-3 px-10 py-6 rounded-[2.5rem] border border-slate-200 bg-white font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 w-full md:w-auto justify-center">
          <Filter className="h-4 w-4" strokeWidth={3} />
          <span>Filters</span>
        </button>
      </div>

      <div className="space-y-8">
        {meetings.map((meeting, idx) => {
          const platform = platformColors[meeting.platform as keyof typeof platformColors];
          return (
            <motion.div 
              key={meeting.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.005 }}
              className="group p-12 rounded-[3.5rem] border border-slate-200 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.02)] hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                <div className="flex-1 space-y-12">
                  <div className="flex flex-wrap items-center gap-6">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors duration-700">{meeting.title}</h3>
                    <div className={cn("px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border shadow-sm", platform.badge, platform.text, platform.border)}>
                      {meeting.platform.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-16 gap-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-xl group-hover:text-blue-600 transition-all duration-700 border border-slate-100">
                        <Calendar className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="label-caps !text-[9px] !tracking-[0.2em] !text-slate-400 font-black">Timestamp</p>
                        <p className="font-black text-slate-900 text-lg">{meeting.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-xl group-hover:text-blue-600 transition-all duration-700 border border-slate-100">
                        <Timer className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="label-caps !text-[9px] !tracking-[0.2em] !text-slate-400 font-black">Duration</p>
                        <p className="font-black text-slate-900 text-lg">{meeting.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-2xl border-[3px] border-white bg-slate-100 flex items-center justify-center shadow-lg overflow-hidden relative border border-slate-200">
                            <div className="absolute inset-0 bg-blue-50/20" />
                            <Users size={14} className="text-slate-400" strokeWidth={3} />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <p className="label-caps !text-[9px] !tracking-[0.2em] !text-slate-400 font-black">Network</p>
                        <p className="font-black text-slate-900 text-lg">{meeting.participants} <span className="text-slate-400 font-bold">Nodes</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                  <div className="hidden sm:block space-y-4">
                    <div className="flex items-center justify-between gap-10">
                      <p className="label-caps !text-[10px] !tracking-[0.2em] !text-slate-400 font-black">Cognitive Load</p>
                      <span className="text-sm font-black text-emerald-600">{meeting.sentiment}%</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={cn(
                          "h-2 w-8 rounded-full transition-all duration-1000", 
                          i <= 5 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-slate-100"
                        )} />
                      ))}
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ x: 10, scale: 1.1 }}
                    className="w-16 h-16 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-700"
                  >
                    <ArrowRight className="h-6 w-6" strokeWidth={4} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
