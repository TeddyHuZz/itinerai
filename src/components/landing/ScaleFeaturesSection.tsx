import React from "react";
import { Wand2, Grid, Layers, FileDown } from "lucide-react";

export const ScaleFeaturesSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none" id="scale">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. TOP ROW: LEFT HEADING + 2 RIGHT FEATURE CARDS                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          {/* Left Column: Heading, Pill, Subtitle */}
          <div className="flex flex-col items-start text-left pr-0 lg:pr-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f4f4f5] text-zinc-900 text-[13px] font-medium mb-8">
              <span>Made for groups</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-[3.75rem] font-black tracking-[-0.035em] text-zinc-950 leading-[1.02] mb-6">
              Where groups<br />
              plan at scale
            </h2>

            <p className="text-sm sm:text-[15px] text-zinc-600 font-normal leading-relaxed">
              <strong className="text-zinc-950 font-semibold">Itinerai lets travel groups easily go from chaotic chats to synchronized itineraries</strong> with shared booking modules, automated price tracking, and AI workflows built for scale.
            </p>
          </div>

          {/* Card 1: Magic Import / AI Chat */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-[32px] bg-[#f5f5f7] p-6 flex items-center justify-center overflow-hidden mb-5">
              {/* Dark AI Assistant Chat Modal */}
              <div className="w-64 bg-[#212124] text-white rounded-2xl p-4 shadow-2xl border border-zinc-700/60 flex flex-col justify-between h-56">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium border-b border-zinc-800 pb-2">
                  <span>←</span>
                  <span>New trip chat</span>
                </div>

                <div className="flex items-start gap-2 my-auto">
                  <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    AI
                  </div>
                  <div className="bg-[#00a8ff] text-white text-[11px] p-2.5 rounded-xl rounded-tl-xs leading-relaxed font-medium">
                    Need variations? Give me the dates & budget you want to update, and I'll recalculate.
                  </div>
                </div>

                <div className="bg-[#18181b] text-zinc-400 text-[10px] p-2 rounded-xl flex items-center justify-between border border-zinc-800">
                  <span className="truncate">Swap hotel for Shibuya Suite & adjust split</span>
                  <span className="text-zinc-500 font-bold">↑</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Title & Description */}
            <div className="flex items-center gap-2 mb-1.5">
              <Wand2 className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Magic Import
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              No more manual copy-pasting. Import flights, Airbnb links, or receipts and let Itinerai AI auto-populate your itinerary blocks.
            </p>
          </div>

          {/* Card 2: Auto-resize, auto-translate / Currency & Timezones */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-[32px] bg-[#f5f5f7] p-6 flex items-center justify-center overflow-hidden mb-5">
              {/* Artboard Frame with Bounding Box */}
              <div className="relative p-2 bg-white rounded-xl shadow-2xl border border-zinc-200">
                <div className="text-[9px] font-mono text-violet-600 font-bold mb-1 flex items-center gap-1">
                  <span>▶</span> Artboard: Tokyo Day 2
                </div>
                <div className="relative w-56 h-40 rounded-lg overflow-hidden border border-violet-500 bg-linear-to-tr from-rose-400 via-purple-600 to-indigo-700 flex flex-col items-center justify-center text-white p-3">
                  {/* Selection handles */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-violet-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-violet-600" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-violet-600" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-violet-600" />

                  <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs mb-2">
                    ¥ JPY ⇄ $ USD Synced
                  </span>
                  <span className="text-xl font-black tracking-tight">
                    Shibuya Sky 360°
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Card Title & Description */}
            <div className="flex items-center gap-2 mb-1.5">
              <Grid className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Auto-convert & localize
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Automatically convert currencies, translate foreign receipts, and synchronize arrival timezones across all group members.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BOTTOM ROW: 2 FEATURE CARDS                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Card 3: Create Component / Reusable Trip Modules */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-[32px] bg-[#0d0d0f] p-6 flex items-center justify-center overflow-hidden mb-5 relative">
              <div className="absolute inset-0 bg-radial from-violet-900/30 via-transparent to-transparent pointer-events-none" />

              {/* Purple Create Component Button (Jitter Style) */}
              <div className="px-6 py-3.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                <span>❖</span>
                <span>Create trip component</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Reusable travel modules
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Turn confirmed flight schedules, packing lists, and Airbnb shortlists into reusable group components you can share across trips.
            </p>
          </div>

          {/* Card 4: Multi-format Sync & Export */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-[32px] bg-[#38bdf8] p-6 flex items-center justify-center overflow-hidden mb-5">
              {/* Document List UI */}
              <div className="w-72 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-2xl text-zinc-900 text-left border border-white/40">
                <div className="flex items-center justify-between text-xs font-bold border-b border-zinc-200 pb-2 mb-3">
                  <span className="font-extrabold">Itinerai Sync</span>
                  <span className="text-[10px] text-emerald-600 font-mono">LIVE SYNCED ✓</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-zinc-100 flex items-center justify-between">
                    <span>📅 Apple & Google Calendar</span>
                    <span className="font-bold text-zinc-600">Sync</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100 flex items-center justify-between">
                    <span>📱 Apple Wallet Passes</span>
                    <span className="font-bold text-zinc-600">Export</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100 flex items-center justify-between">
                    <span>🗺️ Offline PDF & Maps</span>
                    <span className="font-bold text-zinc-600">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <FileDown className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                One-click sync & export
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Export synchronized calendar events, offline map bundles, and settlement summaries for everyone in your crew.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
