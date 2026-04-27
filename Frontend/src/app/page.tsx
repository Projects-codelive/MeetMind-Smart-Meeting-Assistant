"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mic, 
  Brain, 
  Link2, 
  BarChart3, 
  Calendar, 
  Zap, 
  MessageSquare, 
  Languages, 
  Clock, 
  Users, 
  DollarSign, 
  Shield, 
  Check,
  ChevronRight,
  Target,
  Cpu,
  Fingerprint
} from "lucide-react";
import { FeatureSections } from "@/components/ui/feature-sections";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { IntegrationsMarquee } from "@/components/ui/integrations-marquee";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[1.25rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                <Brain className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">MeetMind</span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              {["Features", "Intelligence", "Ecosystem", "Pricing"].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-slate-500 hover:text-blue-600 transition-all duration-500 text-xs font-black uppercase tracking-widest"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/sign-in" className="text-slate-500 hover:text-slate-900 transition-all duration-500 text-xs font-black uppercase tracking-widest">Login</Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all duration-700 shadow-2xl shadow-blue-500/20 border border-blue-400/30">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative flex flex-col gap-6 items-center justify-center px-6 max-w-7xl mx-auto text-center pt-20"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100/60 text-blue-700 text-[10px] font-black tracking-[0.3em] uppercase mb-10">
            <Target size={14} strokeWidth={3} className="text-blue-600" />
            <span>NEURAL MEETING INTELLIGENCE</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-10">
            Automated <br /> 
            <span className="text-blue-600">Intelligence.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-800 max-w-3xl mx-auto font-semibold leading-relaxed mb-16 opacity-80">
            MeetMind transcribes, synthesizes, and orchestrates every follow-up 
            across your entire stack. The next generation of discourse management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all duration-700 shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 group border border-blue-400/30"
            >
              Initialize Node <ChevronRight size={20} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-12 py-5 rounded-[2rem] border-2 border-slate-200 bg-white text-slate-900 text-sm font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all duration-700">
              Watch Intelligence
            </button>
          </div>
          
          <div className="mt-32 flex flex-wrap justify-center items-center gap-12 opacity-30">
             {["Google Meet", "Zoom Video", "Microsoft Teams", "Webex Logic"].map((brand) => (
                <span key={brand} className="text-[10px] font-black tracking-[0.4em] text-slate-900 uppercase">{brand}</span>
             ))}
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Features Section */}
      <div id="features">
        <FeatureSections />
      </div>

      {/* Integrations Marquee Section */}
      <div id="ecosystem">
        <IntegrationsMarquee />
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32 space-y-4">
             <div className="label-caps !text-blue-600 font-black tracking-[0.4em]">SCALABLE LOGIC</div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">Operational Tiers.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Free */}
            <div className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-200 flex flex-col transition-all duration-700 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group">
              <div className="label-caps !text-slate-400 font-black tracking-[0.3em] mb-6">CORE</div>
              <h3 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter">Sandbox</h3>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">$0</span>
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">/cycle</span>
              </div>
              <ul className="space-y-6 mb-16 flex-1">
                {["10 meeting nodes", "Standard synthesis", "2 sync channels"].map((item) => (
                  <li key={item} className="flex items-center text-sm text-slate-900 font-bold tracking-tight">
                    <Check className="h-4 w-4 mr-4 text-blue-600 flex-shrink-0" strokeWidth={4} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="w-full py-5 rounded-[2rem] border-2 border-slate-200 text-center font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-700">
                Deploy Node
              </Link>
            </div>

            {/* Pro */}
            <div className="p-12 rounded-[3.5rem] bg-white border-[3px] border-blue-600 flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden transform md:-translate-y-6">
              <div className="absolute top-8 right-8 bg-blue-600 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-blue-600/20 animate-pulse">Advanced</div>
              <div className="label-caps !text-blue-600 font-black tracking-[0.3em] mb-6">NEURAL</div>
              <h3 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter">Pro Logic</h3>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">$12</span>
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">/cycle</span>
              </div>
              <ul className="space-y-6 mb-16 flex-1">
                {["Unlimited meeting nodes", "High-fidelity synthesis", "Full ecosystem sync", "Biometric monitoring"].map((item) => (
                  <li key={item} className="flex items-center text-sm text-slate-900 font-black tracking-tight">
                    <Check className="h-4 w-4 mr-4 text-blue-600 flex-shrink-0" strokeWidth={4} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black text-xs uppercase tracking-widest text-center hover:bg-blue-700 transition-all duration-700 shadow-2xl shadow-blue-500/20 border border-blue-400/30">
                Activate Neural
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-200 flex flex-col transition-all duration-700 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group">
              <div className="label-caps !text-slate-400 font-black tracking-[0.3em] mb-6">GLOBAL</div>
              <h3 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter">Enterprise</h3>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">Quota</span>
              </div>
              <ul className="space-y-6 mb-16 flex-1">
                {["Quantum encryption", "Custom logic gates", "Dedicated supervisor", "SSO/SAML integration"].map((item) => (
                  <li key={item} className="flex items-center text-sm text-slate-900 font-bold tracking-tight">
                    <Check className="h-4 w-4 mr-4 text-blue-600 flex-shrink-0" strokeWidth={4} /> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-5 rounded-[2rem] border-2 border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-700 font-black text-xs uppercase tracking-widest">
                Contact Logic
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 text-center md:text-left">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                <Brain className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                 <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">MeetMind</span>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.5em] mt-1">EST. 2026</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 MEETMIND AI SYNDICATE. ALL NODES RESERVED.</p>
            <div className="flex gap-10">
              {["Privacy", "Protocols", "Infrastructure"].map((link) => (
                <Link key={link} href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}