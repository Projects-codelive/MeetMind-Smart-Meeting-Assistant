"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  BrainCircuit,
  Zap,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIPanelProps {
  className?: string;
}

export function AIPanel({ className }: AIPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnalyzing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const insights = [
    "Team consensus reached on React 19 migration.",
    "Potential bottleneck identified in authentication flow.",
    "Engagement peaked during the UI demo section."
  ];

  const actionItems = [
    "Radhika to finalize the landing page prototype.",
    "Schedule follow-up with DevOps team.",
    "Update API documentation with new endpoints."
  ];

  return (
    <div className={cn("relative h-full", className)}>
      <div className="h-full glass-panel rounded-[3rem] overflow-hidden flex flex-col neural-glow border-white/40">
        
        {/* Header */}
        <div className="p-10 pb-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none">
            <BrainCircuit size={120} className="text-blue-600" />
          </div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-14 h-14 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                <BrainCircuit className="w-7 h-7 text-white" />
              </div>
              {isAnalyzing && (
                <motion.div 
                  className="absolute inset-0 bg-blue-500/40 rounded-3xl blur-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AI Insights</h3>
              <div className="label-caps !text-blue-600 !tracking-[0.3em] mt-1.5">
                NEURAL OVERWATCH
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-10 pb-10 space-y-10 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10 py-12"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 border-[3px] border-slate-100 rounded-[2.5rem]"
                      animate={{ rotate: 360, borderRadius: ["20%", "50%", "20%"] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute inset-0 border-t-[3px] border-blue-600 rounded-[2.5rem]"
                      animate={{ rotate: 360, borderRadius: ["20%", "50%", "20%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-900 tracking-tight">Synthesizing Context</p>
                    <div className="label-caps !text-slate-400">Reviewing Discourse Sentiment</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12 pt-6"
              >
                {/* Insights Stack */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Zap size={16} className="text-blue-600" strokeWidth={3} />
                    </div>
                    <div className="label-caps !text-slate-900 tracking-[0.2em]">Summary Intelligence</div>
                  </div>
                  <div className="space-y-3">
                    {insights.map((text, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="p-5 rounded-[1.75rem] bg-white border border-slate-200/50 shadow-sm font-medium text-sm text-slate-700 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
                      >
                        <div className="flex gap-4">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-150 transition-transform" />
                          <p className="leading-relaxed">{text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Action Items */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <div className="label-caps !text-slate-900 tracking-[0.2em]">Key Deliverables</div>
                  </div>
                  <div className="space-y-3">
                    {actionItems.map((text, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center justify-between p-5 rounded-[1.75rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all cursor-pointer group"
                      >
                        <span className="text-sm font-bold text-slate-700">{text}</span>
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-300">
                          <ArrowRight size={14} strokeWidth={3} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Automation Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Waves size={100} strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                        <Lightbulb className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.3em]">Smart Nexus</span>
                    </div>
                    <p className="text-lg font-medium leading-snug tracking-tight">
                      Automate follow-up scheduling and Jira sync?
                    </p>
                    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg active:scale-95">
                      Initialize Workflow
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Status */}
        <div className="p-8 pt-0 mt-auto">
          <div className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/40 border border-white/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Ready: Neural Overwatch 4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
