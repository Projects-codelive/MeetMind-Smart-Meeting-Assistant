"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "none";
  delay?: number;
}

export function GlassCard({ children, className, glowColor = "none", delay = 0 }: GlassCardProps) {
  const glowStyles = {
    blue: "after:content-[''] after:absolute after:-z-10 after:top-0 after:left-0 after:w-full after:h-full after:bg-blue-500/15 after:blur-3xl",
    purple: "after:content-[''] after:absolute after:-z-10 after:top-0 after:left-0 after:w-full after:h-full after:bg-purple-500/15 after:blur-3xl",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
        borderColor: "rgba(255, 255, 255, 0.8)"
      }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-8 transition-all duration-300 shadow-premium",
        glowColor !== "none" && glowStyles[glowColor],
        className
      )}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
