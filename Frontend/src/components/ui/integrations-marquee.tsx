"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Icons = {
  GoogleMeet: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="8" y="14" width="22" height="20" rx="4" strokeWidth="2" />
      <path d="M30 20L38 16V32L30 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="19" r="2" fill="#2563EB" className="animate-pulse" />
    </svg>
  ),
  Teams: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <circle cx="18" cy="18" r="7" strokeWidth="2" />
      <circle cx="30" cy="26" r="7" strokeWidth="2" />
      <path d="M22 26H38" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="30" cy="26" r="3" fill="#6366F1" />
    </svg>
  ),
  Slack: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <path d="M12 18C12 13.5781 15.5781 10 20 10H32C36.4219 10 40 13.5781 40 18V24C40 28.4219 36.4219 32 32 32H20C15.5781 32 12 28.4219 12 24V18Z" strokeWidth="2" />
      <path d="M18 17H34" strokeWidth="2" strokeLinecap="round" stroke="#2563EB" opacity="0.8" />
      <path d="M18 22H30" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 27H24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Notion: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="10" y="10" width="24" height="28" rx="2" strokeWidth="2" />
      <rect x="14" y="6" width="24" height="28" rx="2" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
      <path d="M16 18H28" strokeWidth="2" stroke="#2563EB" />
      <path d="M16 24H28" strokeWidth="2" />
      <path d="M16 30H22" strokeWidth="2" />
    </svg>
  ),
  Jira: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="14" y="14" width="20" height="20" rx="2" strokeWidth="2" />
      <path d="M14 24H34M24 14V34" strokeWidth="1" opacity="0.3" />
      <circle cx="24" cy="24" r="16" strokeWidth="2" strokeDasharray="6 6" stroke="#2563EB" />
      <path d="M36 12L40 8" strokeWidth="2" strokeLinecap="round" stroke="#2563EB" />
    </svg>
  ),
  Trello: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="12" y="18" width="6" height="16" rx="1.5" strokeWidth="2" fill="#2563EB" fillOpacity="0.1" />
      <rect x="21" y="12" width="6" height="24" rx="1.5" strokeWidth="2" />
      <rect x="30" y="22" width="6" height="8" rx="1.5" strokeWidth="2" />
    </svg>
  ),
  Gmail: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="8" y="14" width="32" height="20" rx="3" strokeWidth="2" />
      <path d="M8 14L24 25L40 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 28L40 28" strokeWidth="2" strokeLinecap="round" stroke="#2563EB" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="12" y="10" width="24" height="28" rx="4" strokeWidth="2" />
      <path d="M12 18H36" strokeWidth="2" />
      <circle cx="20" cy="26" r="2.5" fill="#2563EB" />
      <circle cx="28" cy="26" r="2.5" fill="#2563EB" opacity="0.3" />
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <circle cx="16" cy="16" r="4" strokeWidth="2" />
      <circle cx="32" cy="16" r="4" strokeWidth="2" />
      <circle cx="24" cy="32" r="4" strokeWidth="2" fill="#2563EB" fillOpacity="0.2" />
      <path d="M20 16H28" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M16 20V24C16 28 20 32 24 32" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  ),
  Asana: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className="w-full h-full">
      <circle cx="24" cy="14" r="5" strokeWidth="2" />
      <circle cx="14" cy="31" r="5" strokeWidth="2" />
      <circle cx="34" cy="31" r="5" strokeWidth="2" />
      <circle cx="24" cy="25" r="2" fill="#6366F1" />
    </svg>
  )
};

interface Integration {
  name: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
}

const integrations: Integration[] = [
  { name: "Google Meet", description: "Seamless meeting capture", icon: "GoogleMeet", color: "from-blue-500/10 to-blue-600/10" },
  { name: "Microsoft Teams", description: "Enterprise collaboration", icon: "Teams", color: "from-indigo-500/10 to-indigo-600/10" },
  { name: "Slack", description: "Team communication hub", icon: "Slack", color: "from-blue-400/10 to-blue-500/10" },
  { name: "Notion", description: "Knowledge management", icon: "Notion", color: "from-slate-400/10 to-slate-500/10" },
  { name: "Jira", description: "Project tracking", icon: "Jira", color: "from-blue-600/10 to-blue-700/10" },
  { name: "Trello", description: "Visual task boards", icon: "Trello", color: "from-sky-500/10 to-sky-600/10" },
  { name: "Gmail", description: "Smart envelope lines", icon: "Gmail", color: "from-red-500/10 to-red-600/10" },
  { name: "Calendar", description: "Grid timeline dots", icon: "Calendar", color: "from-emerald-500/10 to-emerald-600/10" },
  { name: "GitHub", description: "Connected dev nodes", icon: "GitHub", color: "from-slate-800/10 to-slate-900/10" },
  { name: "Asana", description: "Balanced orbit triangle", icon: "Asana", color: "from-rose-500/10 to-rose-600/10" },
];

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const IconComponent = Icons[integration.icon];
  
  return (
    <motion.div
      className="relative flex-shrink-0 w-72 h-40 rounded-[2rem] overflow-hidden group cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background with glass effect */}
      <div className="absolute inset-0 bg-white border border-slate-200/60 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.02)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group-hover:border-blue-200/50 transition-all duration-700" />
      
      {/* Subtle color glow on hover */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", integration.color)} />
      
      {/* Content */}
      <div className="relative h-full p-8 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          {/* Icon Container with glow ring on hover */}
          <div className="relative w-12 h-12">
             <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 group-hover:scale-150 blur-xl transition-all duration-700" />
             <div className="relative z-10 w-12 h-12 text-slate-400 group-hover:text-blue-600 transition-all duration-500 transform group-hover:scale-110">
               <IconComponent />
             </div>
          </div>
          
          {/* Connected badge */}
          <div className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-500">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-blue-600">
              Active
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="font-heading text-lg font-black text-slate-900 mb-1 tracking-tighter">
            {integration.name}
          </h3>
          <p className="font-body text-[13px] text-slate-500 font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
            {integration.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const MarqueeRow = ({ integrations, reverse = false }: { integrations: Integration[], reverse?: boolean }) => {
  return (
    <div className="flex gap-6 animate-marquee" style={{
      animationDirection: reverse ? 'reverse' : 'normal'
    }}>
      {[...integrations, ...integrations, ...integrations].map((integration, index) => (
        <IntegrationCard key={`${integration.name}-${index}`} integration={integration} />
      ))}
    </div>
  );
};

export const IntegrationsMarquee = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-40 bg-white overflow-hidden relative">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-50/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black tracking-[0.3em] uppercase">
            Ecosystem Integration
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Seamless <span className="text-blue-600">Neural Sync.</span>
          </h2>
          <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto font-semibold leading-relaxed">
            Connect your operational stack to MeetMind’s intelligence layer in milliseconds.
          </p>
        </motion.div>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        <div className="space-y-8">
          {/* Row 1 */}
          <div className="overflow-hidden">
            <MarqueeRow integrations={integrations.slice(0, 5)} />
          </div>
          
          {/* Row 2 - reverse direction */}
          <div className="overflow-hidden">
            <MarqueeRow integrations={integrations.slice(5, 10)} reverse />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

