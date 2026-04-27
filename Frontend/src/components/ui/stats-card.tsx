import { LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  glowColor?: "blue" | "purple" | "none";
}

export function StatsCard({ title, value, description, icon: Icon, trend, glowColor = "none" }: StatsCardProps) {
  return (
    <GlassCard glowColor={glowColor} className="flex flex-col justify-between h-full group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
          <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {trend.isUp ? "↑" : "↓"} {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black tracking-[0.15em] text-gray-400 mb-1">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{value}</h3>
        <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-tight">{description}</p>
      </div>
    </GlassCard>
  );
}
