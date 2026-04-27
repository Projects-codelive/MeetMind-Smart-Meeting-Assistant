"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Brain,
  Network,
  Activity,
  Puzzle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Target,
  Fingerprint
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard",    href: "/dashboard",              icon: LayoutDashboard },
  { name: "Meetings",     href: "/dashboard/meetings",     icon: Network         },
  { name: "Analytics",    href: "/dashboard/analytics",    icon: Activity        },
  { name: "Integrations", href: "/dashboard/integrations", icon: Puzzle          },
  { name: "AI Chat",      href: "/dashboard/ai-chat",      icon: Sparkles        },
  { name: "Settings",     href: "/dashboard/settings",     icon: Settings        },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ─── Mobile toggle ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-5 rounded-2xl bg-white border border-slate-200 shadow-xl md:hidden active:scale-95 transition-all"
      >
        {isOpen ? <X size={20} className="text-slate-900" strokeWidth={2.5} /> : <Menu size={20} className="text-slate-900" strokeWidth={2.5} />}
      </button>

      {/* ─── Backdrop overlay (mobile) ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/5 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar panel ─── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-[300px] p-6",
          "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Floating Rail container */}
        <div className="h-full flex flex-col bg-white border border-slate-200/60 rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden relative">
          
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />

          {/* ── Branding ── */}
          <div className="px-10 pt-14 pb-12">
            <Link href="/dashboard" className="flex items-center gap-5 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-12 h-12 rounded-[1.25rem] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 relative z-10"
              >
                <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                  MeetMind
                </span>
                <div className="label-caps !text-blue-600 !tracking-[0.3em] mt-2 font-black">
                  VERSION 4.2
                </div>
              </div>
            </Link>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 px-5 space-y-2 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group block outline-none"
                >
                  <div
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-[1.75rem] transition-all duration-500 relative",
                      isActive
                        ? "bg-blue-50/50 text-blue-700 border border-blue-100/50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isActive 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "bg-slate-50 text-slate-400 group-hover:text-slate-900 group-hover:bg-white group-hover:shadow-sm"
                      )}>
                        <Icon size={18} strokeWidth={isActive ? 3 : 2.5} />
                      </div>

                      <span className={cn(
                        "text-[0.9rem] tracking-tight transition-all duration-500",
                        isActive ? "font-black" : "font-bold"
                      )}>
                        {item.name}
                      </span>

                      {isActive && (
                        <ChevronRight size={14} className="ml-auto opacity-40 text-blue-600" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* ── Profile card ── */}
          <div className="p-8 mt-auto">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-slate-50 border border-slate-200/60 rounded-[2.5rem] p-5 flex items-center gap-5 cursor-pointer group transition-all duration-500"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-black text-sm shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-blue-50/50" />
                  <span className="relative z-10">R</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate leading-none">Radhika</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                    <Fingerprint size={12} strokeWidth={3} />
                    <span>Enterprise</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </aside>
    </>
  );
}



