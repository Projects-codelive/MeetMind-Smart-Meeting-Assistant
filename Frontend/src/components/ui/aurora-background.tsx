"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-screen items-center justify-center bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 text-slate-900 transition-bg overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              `
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#a855f7_15%,#3b82f6_20%,#a855f7_25%,#3b82f6_30%)]
            [background-image:var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[120px] opacity-[0.12]
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--aurora)] 
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-overlay
            absolute -inset-[10px]`,
            )}
          ></div>

          {/* Soft Aurora Lights */}
          <div className="absolute inset-0 blur-3xl opacity-60">
            <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.2),transparent_40%)] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_40%)]" />
          </div>
        </div>
        
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </main>
  );
};
