'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Eye, 
  Lock, 
  Zap, 
  Save, 
  Globe, 
  Cpu, 
  Fingerprint, 
  Settings2, 
  EyeOff,
  Activity,
  Layers,
  Box
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

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
            SYSTEM ARCHITECTURE
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-balance text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Global <br />
            <span className="text-blue-600">Configurations.</span>
          </h1>
          <p className="text-slate-800 text-2xl font-semibold leading-relaxed">
            Configure your cognitive environment and security protocols.
          </p>
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-[320px_1fr] gap-16">
        {/* Navigation Rail */}
        <aside className="space-y-3">
          {[
            { id: 'account', label: 'Identity', icon: User },
            { id: 'ai', label: 'Neural Logic', icon: Cpu },
            { id: 'security', label: 'Protocols', icon: Shield },
            { id: 'network', label: 'Connectivity', icon: Layers },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all duration-700 font-black text-xs uppercase tracking-widest border",
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm" 
                  : "text-slate-500 bg-transparent border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-200"
              )}
            >
              <item.icon size={16} strokeWidth={3} />
              <span>{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="setting-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.section 
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[3.5rem] border border-slate-200 p-12 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.03)] space-y-16"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <User size={30} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Identity</h2>
                    <div className="label-caps !text-blue-600 !text-[9px] font-black tracking-[0.3em]">PRINCIPAL NODE MANAGEMENT</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="label-caps !text-[10px] !tracking-[0.3em] !text-slate-400 ml-1 font-black">Principal Name</label>
                    <input 
                      type="text" 
                      defaultValue="Radhika" 
                      className="w-full px-10 py-6 rounded-[2rem] border border-slate-200 bg-white font-black text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/40 transition-all duration-700" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="label-caps !text-[10px] !tracking-[0.3em] !text-slate-400 ml-1 font-black">Authentication Relay</label>
                    <input 
                      type="email" 
                      defaultValue="radhika@meetmind.ai" 
                      className="w-full px-10 py-6 rounded-[2rem] border border-slate-200 bg-slate-50 font-black text-slate-400 cursor-not-allowed" 
                      disabled 
                    />
                  </div>
                </div>
                
                <div className="pt-6">
                  <button className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all duration-700 shadow-2xl shadow-blue-500/20 flex items-center gap-4 border border-blue-400/30">
                    <Save size={18} strokeWidth={3} />
                    <span>Synchronize Profile</span>
                  </button>
                </div>
              </motion.section>
            )}

            {activeTab === 'ai' && (
              <motion.section 
                key="ai"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[3.5rem] border border-slate-200 p-12 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.03)] space-y-16"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <Cpu size={30} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Neural Logic</h2>
                    <div className="label-caps !text-blue-600 !text-[9px] font-black tracking-[0.3em]">COGNITIVE HEURISTICS & ANALYTICS</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { title: "Autonomous Synthesis", desc: "Enable high-fidelity neural summary generation.", icon: Activity },
                    { title: "Biometric Monitoring", desc: "Real-time attention analysis via biometric streams.", icon: Fingerprint },
                    { title: "Strategic Pre-Briefing", desc: "Generate mission-critical context before orchestration.", icon: Box }
                  ].map((pref) => (
                    <div key={pref.title} className="flex items-center justify-between p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-1000 group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                           <pref.icon size={20} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-slate-900 text-xl tracking-tighter leading-none">{pref.title}</p>
                          <p className="text-sm text-slate-800 font-semibold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{pref.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-16 h-9 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[28px] after:w-[28px] after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === 'security' && (
              <motion.section 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[3.5rem] border border-slate-200 p-12 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.03)] space-y-16"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <Lock size={30} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Protocols</h2>
                    <div className="label-caps !text-blue-600 !text-[9px] font-black tracking-[0.3em]">API ACCESS & QUANTUM ENCRYPTION</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="label-caps !text-[10px] !tracking-[0.3em] !text-slate-400 ml-1 font-black">NEURAL PIPELINE ACCESS KEY</label>
                    <div className="relative max-w-3xl">
                      <input 
                        type="password" 
                        placeholder="••••••••••••••••••••••••••••••••" 
                        className="w-full px-10 py-7 rounded-[2.5rem] border border-slate-200 bg-white font-black text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/40 transition-all duration-700" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                        <button className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center">
                          <EyeOff size={18} strokeWidth={3} />
                        </button>
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all duration-700 shadow-2xl shadow-blue-500/20 border border-blue-400/30">
                          Sync Key
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
