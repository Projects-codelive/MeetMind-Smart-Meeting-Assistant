"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { CircleMenu } from "@/components/ui/circle-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden">
      {/* 🌌 Elite Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SaaS Sidebar */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[280px] relative z-10">
        <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Floating AI Actions Menu */}
      <CircleMenu />
    </div>
  );
}