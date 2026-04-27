"use client";

import { motion } from "framer-motion";
import { 
  Network, 
  Activity, 
  Zap, 
  Sparkles,
  ArrowUpRight,
  Brain,
  MessageSquare,
  TrendingUp,
  LayoutDashboard,
  Target,
  Workflow,
  Fingerprint,
} from "lucide-react";
import { AIPanel } from "@/components/ui/ai-panel";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

const stats = [
  { 
    label: "Neural Connectivity", 
    value: 128, 
    trend: "+12.4%", 
    description: "Meeting streams synchronized", 
    icon: Network, 
    color: "blue",
    progress: 78 
  },
  { 
    label: "Cognitive Load", 
    value: 94, 
    trend: "+2.1%", 
    suffix: "%",
    description: "Collective focus index", 
    icon: Target, 
    color: "indigo",
    progress: 94 
  },
  { 
    label: "Yield Velocity", 
    value: 452, 
    trend: "+18.7%", 
    description: "Intelligence shards extracted", 
    icon: Workflow, 
    color: "gold",
    progress: 65 
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* ─── Editorial Hero ─── */}
      <motion.header 
        className="max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="label-caps !text-blue-600 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/50">
            STRATEGIC INTELLIGENCE
          </div>
        </div>
        <div className="space-y-6">
          <motion.h1 
            className="text-balance text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Orchestrate <br /> 
            <span className="text-blue-600">your intelligence.</span>
          </motion.h1>
          <p className="text-slate-800 text-2xl font-semibold max-w-2xl leading-relaxed">
            The Neural Engine has processed <span className="text-blue-600 font-black underline decoration-blue-500/20 underline-offset-8">12.4h</span> of active discourse. 
            Operational efficiency is up <span className="text-blue-600 font-black">18.2%</span> from baseline.
          </p>
        </div>
      </motion.header>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-16">
        
        <div className="space-y-20">
          {/* ── Metric Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.4 }}
                whileHover={{ y: -10, shadow: "0 40px 80px -15px rgba(0,0,0,0.05)" }}
                className="group relative bg-white rounded-[3rem] border border-slate-200 p-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.02)] transition-all duration-700 flex flex-col justify-between h-[340px] overflow-hidden"
              >
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border transition-all duration-700 group-hover:scale-110",
                      stat.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                      'bg-amber-50 text-amber-600 border-amber-100'
                    )}>
                      <stat.icon size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-black text-slate-900">{stat.trend}</span>
                      <ArrowUpRight size={10} className="text-emerald-500" strokeWidth={4} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="label-caps !text-slate-400 font-black">{stat.label}</div>
                    <div className="flex items-baseline gap-1">
                      <AnimatedCounter to={stat.value} className="text-6xl font-black tracking-tighter text-slate-900" duration={2} />
                      {stat.suffix && <span className="text-3xl font-black text-slate-400">{stat.suffix}</span>}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.description}</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                      className={cn(
                        "h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(37,99,235,0.2)]",
                        stat.color === 'blue' ? 'bg-blue-600' : stat.color === 'indigo' ? 'bg-indigo-600' : 'bg-amber-500'
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── AI Intelligence Hero Card ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="bg-white rounded-[3.5rem] border border-slate-200 p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group"
          >
            {/* Abstract Pattern */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
              <Fingerprint size={320} className="text-blue-600" strokeWidth={0.5} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-[1fr_360px] gap-16 items-center">
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <Brain size={32} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Executive Insights</h3>
                    <div className="label-caps !text-blue-600 tracking-[0.3em] font-black">NEURAL SYSTEM v4.2</div>
                  </div>
                </div>

                <p className="text-4xl md:text-5xl font-black leading-[1] tracking-tighter text-slate-900 max-w-2xl">
                  Strategic narrative is converging on <br />
                  <span className="text-blue-600 underline decoration-blue-500/20 underline-offset-[12px]">Product Scalability</span>. <br />
                  <span className="opacity-30 italic">Confidence quotient is absolute.</span>
                </p>

                <div className="flex flex-wrap gap-5">
                  {[
                    { label: "Infrastructure Hardening", color: "blue", icon: ShieldCheck },
                    { label: "Capital Allocation: $500K", color: "amber", icon: CreditCard }
                  ].map((chip) => (
                    <div key={chip.label} className="px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-4 group/chip hover:bg-white transition-all cursor-default">
                      <chip.icon size={18} className={cn(chip.color === 'blue' ? 'text-blue-600' : 'text-amber-500')} strokeWidth={3} />
                      <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{chip.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 space-y-10 shadow-sm">
                <div className="space-y-3">
                  <div className="label-caps tracking-[0.2em] !text-slate-400 font-black">Sentiment Quotient</div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-7xl font-black tracking-tighter text-slate-900">92</span>
                    <div className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
                      <TrendingUp size={12} strokeWidth={4} />
                      <span>+4.2</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="label-caps tracking-[0.2em] !text-slate-400 font-black">Operational Health</div>
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={cn(
                        "h-10 flex-1 rounded-xl transition-all duration-1000",
                        i < 5 ? "bg-blue-600 shadow-md shadow-blue-500/20" : "bg-white border border-slate-200"
                      )} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base 0</span>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Limit 100</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── AI Assistant Panel ── */}
        <div className="h-full hidden xl:block">
          <AIPanel className="h-full sticky top-12" />
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) {
  const { ShieldCheck } = require('lucide-react');
  return <ShieldCheck size={size} className={className} strokeWidth={strokeWidth} />;
}

function CreditCard({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) {
  const { CreditCard } = require('lucide-react');
  return <CreditCard size={size} className={className} strokeWidth={strokeWidth} />;
}