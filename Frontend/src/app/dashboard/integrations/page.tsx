'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  CheckCircle2, 
  Globe, 
  Shield, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Database,
  Slack,
  Calendar,
  Mail,
  Trello,
  Github,
  Cloud,
  CheckSquare,
  Lock,
  Cpu
} from 'lucide-react';

const integrationsList = [
  { name: 'notion', displayName: 'Notion', description: 'Semantic meeting record ingestion and synchronization.', icon: Database, color: 'blue' },
  { name: 'slack', displayName: 'Slack', description: 'Real-time intelligence broadcasting and DM relay.', icon: Slack, color: 'indigo' },
  { name: 'google', displayName: 'Google', description: 'Autonomous scheduling and calendar orchestration.', icon: Calendar, color: 'emerald' },
  { name: 'gmail', displayName: 'Gmail', description: 'AI-generated follow-up sequences and participant sync.', icon: Mail, color: 'rose' },
  { name: 'jira', displayName: 'Jira', description: 'Automated ticket creation and sprint logic mapping.', icon: Trello, color: 'blue' },
  { name: 'github', displayName: 'GitHub', description: 'Technical discourse to issue conversion engine.', icon: Github, color: 'slate' },
  { name: 'salesforce', displayName: 'Salesforce', description: 'CRM intelligence and opportunity stage automation.', icon: Cloud, color: 'sky' },
  { name: 'asana', displayName: 'Asana', description: 'Visual task orchestration and board management.', icon: CheckSquare, color: 'rose' },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIntegrations({
      notion: true,
      slack: false,
      google: true,
      gmail: false,
      jira: false,
      github: true,
      salesforce: false,
      asana: true
    });
  }, []);

  return (
    <div className="space-y-20 pb-20">
      <motion.header 
        className="max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="label-caps !text-blue-600 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/50">
            STRATEGIC INFRASTRUCTURE
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-balance text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Ecosystem <br />
            <span className="text-blue-600">Connectivity.</span>
          </h1>
          <p className="text-slate-800 text-2xl font-semibold leading-relaxed">
            Synchronize your operational stack with the MeetMind <span className="text-blue-600 font-black">Neural Engine</span>. 
            Enable high-fidelity data orchestration across <span className="text-blue-600 font-black">50+ nodes</span>.
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {integrationsList.map((integration, idx) => {
          const isConnected = integrations[integration.name];
          const Icon = integration.icon;
          return (
            <motion.div 
              key={integration.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 + 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, shadow: "0 40px 80px -20px rgba(0,0,0,0.05)" }}
              className="group relative bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col h-[420px] transition-all duration-700 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl border flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl transition-all duration-700",
                  isConnected ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"
                )}>
                  <Icon size={24} className={cn(
                    isConnected ? "text-blue-600" : "text-slate-400"
                  )} strokeWidth={2.5} />
                </div>
                
                {isConnected ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                    <CheckCircle2 size={10} strokeWidth={4} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400">
                    <span className="text-[9px] font-black uppercase tracking-widest">Offline</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 relative z-10">
                <h3 className="font-black text-slate-900 text-3xl tracking-tighter leading-none">{integration.displayName}</h3>
                <p className="text-slate-700 text-[15px] leading-relaxed font-semibold line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">{integration.description}</p>
              </div>

              <div className="mt-8 relative z-10">
                {isConnected ? (
                  <button className="w-full py-5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-[0.25em] hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 flex items-center justify-center gap-2 group/btn">
                    <span>Configure Logic</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
                  </button>
                ) : (
                  <button className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.25em] hover:bg-blue-700 transition-all duration-500 shadow-2xl active:scale-95 flex items-center justify-center gap-2 border border-blue-400/30">
                    <Plus size={16} strokeWidth={4} />
                    <span>Establish Link</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Security Trust Rail ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 py-12 border-t border-slate-100 mt-20"
      >
        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-500 cursor-help group">
          <Lock size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">AES-256 Protocol</span>
        </div>
        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-500 cursor-help group">
          <Globe size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Global Sovereignty</span>
        </div>
        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-500 cursor-help group">
          <Cpu size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Zero-Knowledge Compute</span>
        </div>
      </motion.div>
    </div>
  );
}
