'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Target, Zap, ArrowUpRight, BarChart3, Globe, Clock, Network, Fingerprint, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const attentionData = [
  { name: 'MON', score: 85 },
  { name: 'TUE', score: 78 },
  { name: 'WED', score: 92 },
  { name: 'THU', score: 88 },
  { name: 'FRI', score: 75 },
  { name: 'SAT', score: 82 },
  { name: 'SUN', score: 95 },
];

const speakingData = [
  { name: 'Directives', time: 45 },
  { name: 'Inquiry', time: 30 },
  { name: 'Feedback', time: 25 },
];

const COLORS = ['#2563eb', '#60a5fa', '#bfdbfe'];

const StatCard = ({ icon: Icon, label, value, trend, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -10, shadow: "0 40px 80px -20px rgba(0,0,0,0.05)" }}
    className="p-10 rounded-[3rem] border border-slate-200 bg-white shadow-[0_8px_30px_-10px_rgba(0,0,0,0.02)] transition-all duration-700 group flex flex-col justify-between h-full"
  >
    <div className="flex items-center justify-between mb-12">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border",
          trend.isUp ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
        )}>
          {trend.isUp ? '↑' : '↓'} {trend.value}%
          <ArrowUpRight size={12} strokeWidth={4} className="ml-0.5" />
        </div>
      )}
    </div>
    <div className="space-y-2">
      <div className="label-caps !text-slate-400 font-black">{label}</div>
      <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
    </div>
  </motion.div>
);

export default function AnalyticsPage() {
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
            QUANTITATIVE VECTORS
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-balance text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Operational <br />
            <span className="text-blue-600">Velocity & Logic.</span>
          </h1>
          <p className="text-slate-800 text-2xl font-semibold leading-relaxed">
            High-fidelity analysis of your discourse ecosystem. 
            Efficiency delta is <span className="text-blue-600 font-black">+9.2%</span> above historical baseline.
          </p>
        </div>
      </motion.header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={Activity} label="Semantic Volume" value="128" trend={{ value: 12, isUp: true }} delay={0.4} />
        <StatCard icon={Target} label="Engagement Quotient" value="94.2" trend={{ value: 5, isUp: true }} delay={0.5} />
        <StatCard icon={Zap} label="Yield Shards" value="452" trend={{ value: 18, isUp: true }} delay={0.6} />
        <StatCard icon={Clock} label="Synchronous Time" value="12.4h" trend={{ value: 3, isUp: false }} delay={0.7} />
      </div>

      {/* Trend Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="rounded-[3.5rem] border border-slate-200 bg-white p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Intelligence Trend</h2>
            <div className="label-caps !text-slate-400 tracking-[0.2em] font-black">WEEKLY AGGREGATE PERFORMANCE INDEX</div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Efficiency</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline</span>
            </div>
          </div>
        </div>
        
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attentionData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.08}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="8 8" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                dy={20}
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                dx={-20}
              />
              <Tooltip 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '32px',
                  boxShadow: '0 40px 80px -20px rgba(0,0,0,0.1)',
                  padding: '24px'
                }}
                labelStyle={{ color: '#0f172a', fontWeight: 900, marginBottom: '8px', fontSize: '14px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}
                itemStyle={{ color: '#2563eb', fontWeight: 800, fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#2563eb" 
                strokeWidth={5} 
                fillOpacity={1} 
                fill="url(#colorScore)"
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="rounded-[3.5rem] border border-slate-200 bg-white p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.02)]"
        >
          <div className="space-y-3 mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Acoustic Distribution</h2>
            <div className="label-caps !text-slate-400 tracking-[0.2em] font-black">INTENT & AIRTIME CATEGORIZATION</div>
          </div>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={speakingData} 
                  dataKey="time" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={90}
                  outerRadius={125} 
                  paddingAngle={8}
                >
                  {speakingData.map((entry, index) => (
                    <Cell 
                      key={entry.name} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', padding: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">100</span>
              <div className="label-caps !text-slate-400 !tracking-[0.1em] !text-[8px] mt-1 font-black">PERCENT YIELD</div>
            </div>
          </div>
        </motion.div>

        {/* Topics Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="rounded-[3.5rem] border border-slate-200 bg-white p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.02)]"
        >
          <div className="space-y-3 mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Semantic Mapping</h2>
            <div className="label-caps !text-slate-400 tracking-[0.2em] font-black">CORE INTELLIGENCE CLUSTERS</div>
          </div>
          <div className="space-y-10">
            {[
              { topic: 'Frontend Architecture', val: 95, icon: MousePointer2 },
              { topic: 'Operational Latency', val: 75, icon: Target },
              { topic: 'Neural Training', val: 60, icon: Brain },
              { topic: 'Market Sentiment', val: 40, icon: BarChart3 }
            ].map((item, i) => (
              <div key={item.topic} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <item.icon size={18} className="text-blue-600" strokeWidth={3} />
                    <span className="font-black text-slate-900 text-xl tracking-tighter">{item.topic}</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 uppercase tracking-widest">{item.val}% Focus</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ duration: 2.5, delay: 1.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.2)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Brain({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) {
  const { Brain } = require('lucide-react');
  return <Brain size={size} className={className} strokeWidth={strokeWidth} />;
}
