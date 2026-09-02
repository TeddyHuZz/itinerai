import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Hotel, 
  Compass, 
  Check, 
  ArrowRight,
  Clock,
  Users
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

interface TripPreset {
  id: string;
  badge: string;
  title: string;
  pax: number;
  duration: string;
  budgetPerPerson: number;
  tags: string[];
  days: {
    day: number;
    title: string;
    highlights: { time: string; activity: string; cost: string; note: string }[];
    hotel: { name: string; priceNight: number; rating: number; status: string };
  }[];
}

const PRESETS: TripPreset[] = [
  {
    id: "tokyo",
    badge: "🍜 Most Popular",
    title: "Tokyo Foodie, Hidden Bars & Anime Culture",
    pax: 4,
    duration: "7 Days",
    budgetPerPerson: 1350,
    tags: ["Street Food", "Anime & Tech", "Scenic Trains", "Nightlife"],
    days: [
      {
        day: 1,
        title: "Neon Arrival & Shinjuku Golden Gai",
        highlights: [
          { time: "10:00 AM", activity: "Direct flight landing at Haneda & Skyliner pass", cost: "$580/pax", note: "Group discount applied" },
          { time: "02:30 PM", activity: "Check-in at Shibuya Stream Hotel", cost: "$160/night", note: "Central group suite (4 beds)" },
          { time: "07:00 PM", activity: "Omoide Yokocho Secret Yakitori crawl", cost: "$32/pax", note: "Voted #1 by Alex & Leo" },
        ],
        hotel: { name: "Shibuya Stream Boutique Suite", priceNight: 160, rating: 4.9, status: "Consensus locked (4/4)" },
      },
      {
        day: 2,
        title: "Akihabara Tech, Senso-ji & Sumida River Cruise",
        highlights: [
          { time: "09:00 AM", activity: "Senso-ji Asakusa morning street food walk", cost: "$15/pax", note: "Melonpan & matcha tasting" },
          { time: "01:30 PM", activity: "Akihabara Retro Arcade & Gundam Base", cost: "$25/pax", note: "Custom task: Ken leads navigation" },
          { time: "06:30 PM", activity: "Ramen Street tasting at Tokyo Station", cost: "$18/pax", note: "Tsukemen specialty" },
        ],
        hotel: { name: "Shibuya Stream Boutique Suite", priceNight: 160, rating: 4.9, status: "Consensus locked (4/4)" },
      },
    ],
  },
  {
    id: "alps",
    badge: "🏔️ Winter Adventure",
    title: "Swiss Alps Scenic Train & Grindelwald Ski",
    pax: 6,
    duration: "6 Days",
    budgetPerPerson: 2150,
    tags: ["Skiing", "Panoramic Trains", "Fondue Nights", "Mountain Chalet"],
    days: [
      {
        day: 1,
        title: "Zurich to Interlaken via GoldenPass Express",
        highlights: [
          { time: "11:00 AM", activity: "GoldenPass Panoramic rail with Swiss Travel Pass", cost: "$190/pax", note: "Group seat reservation synced" },
          { time: "04:00 PM", activity: "Check-in at Alpine Wooden Chalet Grindelwald", cost: "$320/night", note: "Sleeps 6 with private sauna" },
          { time: "07:30 PM", activity: "Traditional Swiss cheese fondue & local cider", cost: "$45/pax", note: "Receipt auto-split 6 ways" },
        ],
        hotel: { name: "Grindelwald Alpine Chalet", priceNight: 320, rating: 4.95, status: "Deduplication checked ✓" },
      },
      {
        day: 2,
        title: "Jungfraujoch - Top of Europe & Glacier Walk",
        highlights: [
          { time: "08:30 AM", activity: "Eiger Express 3S cableway to Eigergletscher", cost: "$110/pax", note: "Ski equipment rental bundle" },
          { time: "01:00 PM", activity: "Ice Palace exploration & Sphinx Observatory", cost: "Included", note: "Weather guard monitored" },
          { time: "06:00 PM", activity: "Aprés-ski fireside hot chocolate & planning", cost: "$12/pax", note: "Day 3 poll active" },
        ],
        hotel: { name: "Grindelwald Alpine Chalet", priceNight: 320, rating: 4.95, status: "Deduplication checked ✓" },
      },
    ],
  },
  {
    id: "bali",
    badge: "🌊 Sun & Relaxation",
    title: "Bali Cliff Villas, Sunset Beach Clubs & Surf",
    pax: 5,
    duration: "5 Days",
    budgetPerPerson: 920,
    tags: ["Private Villa", "Surfing", "Beach Clubs", "Floating Breakfast"],
    days: [
      {
        day: 1,
        title: "Seminyak Arrival & Uluwatu Cliffside Sunset",
        highlights: [
          { time: "12:00 PM", activity: "Private airport van transfer to Canggu Villa", cost: "$15/pax", note: "Pre-paid group transfer" },
          { time: "02:00 PM", activity: "Check-in at 4-Bedroom Private Pool Villa", cost: "$140/night", note: "$28/person per night!" },
          { time: "05:30 PM", activity: "Single Fin Uluwatu cliffside live music sunset", cost: "$30/pax", note: "VIP Daybed reserved" },
        ],
        hotel: { name: "Villa Maya Canggu with Pool", priceNight: 140, rating: 4.88, status: "Best group rate matched" },
      },
      {
        day: 2,
        title: "Canggu Surf Coaching & Eco Beach Club",
        highlights: [
          { time: "08:30 AM", activity: "Beginner surf lesson at Batu Bolong beach", cost: "$25/pax", note: "Boards + instructor included" },
          { time: "01:00 PM", activity: "Organic Acai bowls & smoothie brunch", cost: "$12/pax", note: "Split itemized via OCR" },
          { time: "06:00 PM", activity: "La Brisa seafood sunset market", cost: "$35/pax", note: "Group voted unanimously" },
        ],
        hotel: { name: "Villa Maya Canggu with Pool", priceNight: 140, rating: 4.88, status: "Best group rate matched" },
      },
    ],
  },
];

export const InteractivePlanner: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<TripPreset>(PRESETS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const handleSelectPreset = (preset: TripPreset) => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 500);
    setTimeout(() => setGenerationStep(3), 1000);
    setTimeout(() => {
      setSelectedPreset(preset);
      setIsGenerating(false);
      setGenerationStep(0);
    }, 1400);
  };

  return (
    <section className="py-20 relative" id="ai-playground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Itinerary Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            Pick a trip vibe, watch the plan build.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg">
            No empty AI templates. Itinerai computes group budgets, deduplicates accommodation picks, and builds realistic day itineraries.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 shadow-sm border ${
                selectedPreset.id === preset.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white scale-105"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-400"
              }`}
            >
              <span>{preset.badge}</span>
              <span>{preset.title.split(",")[0]}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Generating State or Result Container */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-12 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-orange-200 dark:border-zinc-800 shadow-xl text-center flex flex-col items-center justify-center min-h-95"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-6 animate-spin">
                  <Compass className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Building Collaborative Travel Itinerary...
                </h4>
                <div className="flex flex-col gap-2 max-w-sm mx-auto text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  <div className={`flex items-center gap-2 ${generationStep >= 1 ? "text-emerald-600 font-bold" : ""}`}>
                    <Check className="w-4 h-4" /> 1. Querying live flights & group hotel rates
                  </div>
                  <div className={`flex items-center gap-2 ${generationStep >= 2 ? "text-emerald-600 font-bold" : ""}`}>
                    <Check className="w-4 h-4" /> 2. Checking weather forecasts & travel distance
                  </div>
                  <div className={`flex items-center gap-2 ${generationStep >= 3 ? "text-emerald-600 font-bold" : ""}`}>
                    <Check className="w-4 h-4" /> 3. Computing per-person budget & voting board
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedPreset.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-left"
              >
                {/* Header Strip with Boarding Pass Look */}
                <div className="p-6 bg-linear-to-r from-orange-500 via-amber-500 to-rose-500 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        {selectedPreset.badge}
                      </span>
                      <span className="text-xs text-white/90">
                        {selectedPreset.duration} · {selectedPreset.pax} Travelers
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">{selectedPreset.title}</h3>
                  </div>

                  <div className="bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-right">
                    <span className="text-[11px] uppercase tracking-wider text-orange-200 block font-semibold">
                      Budget Per Person
                    </span>
                    <span className="text-2xl font-black text-white">
                      $<NumberTicker value={selectedPreset.budgetPerPerson} />
                    </span>
                  </div>
                </div>

                {/* Tags & Trip Parameters */}
                <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-zinc-500">Trip Tags:</span>
                    {selectedPreset.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-200 dark:border-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>✓ Anti-Duplicate Guard Active</span>
                    <span>✓ 100% Group Synced</span>
                  </div>
                </div>

                {/* Days Breakdown */}
                <div className="p-6 space-y-6">
                  {selectedPreset.days.map((day) => (
                    <div
                      key={day.day}
                      className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-700/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                            D{day.day}
                          </span>
                          <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                            {day.title}
                          </h4>
                        </div>

                        {/* Hotel info tag */}
                        <div className="flex items-center gap-2 text-xs">
                          <Hotel className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{day.hotel.name}</span>
                          <span className="text-zinc-500 font-medium">(${day.hotel.priceNight}/night)</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            {day.hotel.status}
                          </span>
                        </div>
                      </div>

                      {/* Activities list */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {day.highlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-sm"
                          >
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.time}
                              </span>
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                {item.cost}
                              </span>
                            </div>
                            <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2">
                              {item.activity}
                            </h5>
                            <p className="text-[11px] text-zinc-500 mt-1 italic">
                              💡 {item.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer action bar */}
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>Invite your travel crew with a single shareable link to vote and customize.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSelectPreset(selectedPreset)}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100"
                    >
                      Regenerate Alternatives
                    </button>
                    <button
                      onClick={() => alert("Trip loaded! In the full app, this syncs with your group in real-time.")}
                      className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      Open in Shared Workspace
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
