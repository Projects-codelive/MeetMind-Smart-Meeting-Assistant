import { 
  MessageSquareText, 
  Video, 
  Target, 
  Zap, 
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink
} from "lucide-react";
import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";

export function BentoDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 auto-rows-[200px]">
      
      {/* 1. AI Summary - Tall/Large */}
      <GlassCard 
        className="md:col-span-2 md:row-span-2 flex flex-col justify-between"
        glowColor="blue"
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
              <MessageSquareText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI Executive Summary</h3>
          </div>
          <p className="text-gray-500 leading-relaxed mb-6 font-medium">
            Based on your last 5 meetings, your team is focusing heavily on <span className="text-blue-600 font-bold underline decoration-blue-200 decoration-4">frontend performance</span>. 
            Overall sentiment is <span className="text-emerald-600 font-bold underline decoration-emerald-200 decoration-4">highly positive</span> with key concerns regarding API latency.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Top Topic</p>
            <p className="text-sm font-bold text-gray-800">Refactoring UI</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Sentiment</p>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-600" />
              <p className="text-sm font-bold text-gray-800">92.4%</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 2. Attention Score - Square */}
      <GlassCard className="md:col-span-1 md:row-span-1 flex flex-col items-center justify-center text-center group" glowColor="purple">
        <div className="relative mb-4">
          <Target className="w-12 h-12 text-purple-600 transition-transform group-hover:scale-110 duration-300" />
          <div className="absolute inset-0 blur-2xl bg-purple-200/50 -z-10" />
        </div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attention Score</h3>
        <p className="text-3xl font-black text-gray-900 mt-1">88.5%</p>
        <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
          <TrendingUp size={10} /> +4.2% from last week
        </p>
      </GlassCard>

      {/* 3. Tasks Extracted - Square */}
      <GlassCard className="md:col-span-1 md:row-span-1 flex flex-col justify-between overflow-hidden relative group">
        <div className="flex items-center justify-between relative z-10">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks Extracted</h3>
          <Zap size={16} className="text-amber-500 fill-amber-500" />
        </div>
        <div className="relative z-10">
          <p className="text-3xl font-black text-gray-900">24</p>
          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Active action items</p>
        </div>
        <div className="absolute -right-4 -bottom-4 text-amber-100 opacity-50 group-hover:scale-110 transition-transform duration-500">
          <Zap size={80} className="fill-amber-50" />
        </div>
      </GlassCard>

      {/* 4. Recent Meetings - Wide/Long */}
      <GlassCard className="md:col-span-2 md:row-span-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Recent Meetings</h3>
          </div>
          <button className="text-[10px] uppercase font-bold text-gray-400 hover:text-blue-600 transition-colors tracking-wider">See all</button>
        </div>
        <div className="space-y-3 mt-4">
          {[
            { name: "Product Sync", time: "2h ago", color: "bg-blue-500" },
            { name: "Design Review", time: "Yesterday", color: "bg-purple-500" }
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full shadow-sm", m.color)} />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{m.name}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400">{m.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 5. Integrations - Wide/Long */}
      <GlassCard className="md:col-span-1 md:row-span-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">Integrations</h3>
          </div>
          <ExternalLink size={14} className="text-gray-400 hover:text-gray-900 cursor-pointer" />
        </div>
        <div className="flex gap-4 mt-4">
          {["Slack", "Notion", "Github"].map((app, i) => (
            <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-md transition-all cursor-pointer group">
              <div className="w-5 h-5 bg-gray-200 group-hover:bg-blue-100 rounded-md transition-colors" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 border-dashed flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer font-bold">
            +
          </div>
        </div>
      </GlassCard>

    </div>
  );
}
