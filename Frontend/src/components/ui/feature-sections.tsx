"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI Meeting Transcription",
    description:
      "Convert speech to text with 99% accuracy across 90+ languages in real-time.",
    color: "from-blue-400 to-cyan-400",
  },
  {
    title: "Smart Summaries",
    description:
      "Generate concise, executive-level summaries of every meeting automatically.",
    color: "from-purple-400 to-indigo-400",
  },
  {
    title: "Action Item Detection",
    description:
      "AI automatically extracts tasks and assigns them to the right team members.",
    color: "from-emerald-400 to-teal-400",
  },
  {
    title: "Attention Tracking",
    description:
      "Analyze participant engagement and sentiment using advanced computer vision.",
    color: "from-amber-400 to-orange-400",
  },
  {
    title: "Seamless Integrations",
    description:
      "Connect instantly with Notion, Slack, Jira, and 50+ other productivity tools.",
    color: "from-pink-400 to-rose-400",
  },
  {
    title: "Real-time Insights",
    description:
      "Get instant alerts and data-driven suggestions during your live discussions.",
    color: "from-violet-400 to-purple-400",
  },
];

export function FeatureSections() {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-white">
      
      {/* Background aurora glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tighter">
              Powerful Features
            </h2>
            <p className="font-body text-slate-600 text-lg max-w-2xl mx-auto">
              Everything you need to automate and enhance your meetings with AI.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full p-8 rounded-2xl glass-card transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1 overflow-hidden">
                
                {/* Abstract visual */}
                <div className="relative w-14 h-14 mb-6">
                  
                  {/* Glow */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100",
                      `bg-gradient-to-br ${feature.color}`
                    )}
                  />

                  {/* Core box */}
                  <div className="relative w-14 h-14 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                    
                    {/* Inner accent */}
                    <div
                      className={cn(
                        "w-6 h-6 rounded-lg",
                        `bg-gradient-to-br ${feature.color}`
                      )}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="font-body text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}