"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  Brain, 
  CheckCircle2, 
  BarChart3, 
  Link2, 
  Plus, 
  X,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CircleMenuItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  color?: string;
}

interface CircleMenuProps {
  items?: CircleMenuItem[];
  className?: string;
}

const defaultItems: CircleMenuItem[] = [
  { icon: Mic, label: "Start Recording", color: "text-blue-600 bg-blue-50" },
  { icon: Brain, label: "Generate Summary", color: "text-purple-600 bg-purple-50" },
  { icon: CheckCircle2, label: "View Tasks", color: "text-emerald-600 bg-emerald-50" },
  { icon: BarChart3, label: "Analytics", color: "text-amber-600 bg-amber-50" },
  { icon: Link2, label: "Integrations", color: "text-rose-600 bg-rose-50" },
];

export function CircleMenu({ items = defaultItems, className }: CircleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Constants for radial layout
  const radius = 110; 

  return (
    <div className={cn("fixed bottom-10 right-10 z-50", className)}>
      <div className="relative flex items-center justify-center">
        
        {/* Backdrop for open state */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm -z-10"
            />
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && items.map((item, index) => {
            const angle = -90 - (index * (90 / (items.length - 1)));
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <motion.div
                key={item.label}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x, y, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  delay: index * 0.04 
                }}
                className="absolute flex flex-col items-center group"
              >
                {/* Hover Label */}
                <div className="absolute -top-12 whitespace-nowrap bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl scale-90 group-hover:scale-100">
                  {item.label}
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-14 h-14 rounded-full border border-white/50 flex items-center justify-center shadow-2xl shadow-blue-500/10 backdrop-blur-2xl transition-all",
                    item.color
                  )}
                >
                  <item.icon size={22} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Trigger Button */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full bg-blue-600 shadow-[0_8px_40px_rgba(37,99,235,0.4)] group flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-800" />
          <motion.div
            className="relative z-10"
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Plus className="text-white w-8 h-8" strokeWidth={3} />
          </motion.div>

          {/* Sparkle effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

      </div>
    </div>
  );
}
