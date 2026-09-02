import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CloudRain, 
  Sun, 
  ShieldCheck, 
  Vote, 
  Receipt,
  Sparkles, 
  TrendingDown
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";

export const FeaturesGrid: React.FC = () => {
  // Feature 1: Weather toggle state
  const [weatherSim, setWeatherSim] = useState<"sunny" | "rainy">("sunny");

  // Feature 2: Poll state
  const [pollVotes, setPollVotes] = useState({ hotelA: 3, hotelB: 1 });
  const [userVoted, setUserVoted] = useState<"hotelA" | "hotelB" | null>("hotelA");

  const handleVote = (option: "hotelA" | "hotelB") => {
    if (userVoted === option) return;
    setPollVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
      [userVoted as string]: Math.max(0, prev[userVoted as "hotelA" | "hotelB"] - 1),
    }));
    setUserVoted(option);
  };

  const totalVotes = pollVotes.hotelA + pollVotes.hotelB;
  const percentA = Math.round((pollVotes.hotelA / totalVotes) * 100);
  const percentB = Math.round((pollVotes.hotelB / totalVotes) * 100);

  return (
    <section className="py-20 bg-zinc-50/60 dark:bg-zinc-950/60 border-t border-zinc-200/80 dark:border-zinc-800 relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for Group Harmony</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            The 4 superpowers your group travel needed.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg">
            Say goodbye to endless polls, double-booked rooms, rained-out plans, and split-sheet arguments.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Card 1: Dynamic Weather & Disruption Re-Routing (Span 7) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8 shadow-lg relative overflow-hidden flex flex-col justify-between group">
            <BorderBeam size={220} duration={12} colorFrom="#38bdf8" colorTo="#0284c7" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 inline-block">
                  <CloudRain className="w-6 h-6" />
                </span>
                {/* Weather switch */}
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full text-xs font-bold">
                  <button
                    onClick={() => setWeatherSim("sunny")}
                    className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                      weatherSim === "sunny"
                        ? "bg-white dark:bg-zinc-700 text-amber-600 shadow-sm"
                        : "text-zinc-500"
                    }`}
                  >
                    <Sun className="w-3 h-3" /> Clear Skies
                  </button>
                  <button
                    onClick={() => setWeatherSim("rainy")}
                    className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                      weatherSim === "rainy"
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-zinc-500"
                    }`}
                  >
                    <CloudRain className="w-3 h-3" /> Rainstorm Alert
                  </button>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2">
                Dynamic Weather & Delay Re-Routing Guard
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                When sudden weather strikes or flights get delayed, Itinerai doesn't leave you stranded. It recalculates routes, swaps outdoor activities for covered gems, and updates all group members in real time.
              </p>
            </div>

            {/* Interactive Schedule Widget */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  {weatherSim === "sunny" ? "☀️ Standard Outdoor Plan (2:00 PM)" : "🌧️ Live Weather Adaptation Triggered"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  weatherSim === "sunny" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                }`}>
                  {weatherSim === "sunny" ? "Forecast 24°C" : "Swapped in 0.8s"}
                </span>
              </div>

              <div className="space-y-2">
                <div className={`p-3 rounded-xl border transition-all ${
                  weatherSim === "rainy" 
                    ? "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 line-through opacity-60" 
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>🎋 Arashiyama Outdoor Bamboo Forest Walk</span>
                    <span className="text-zinc-500">2.5 hrs</span>
                  </div>
                </div>

                {weatherSim === "rainy" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-700 text-sky-950 dark:text-sky-100"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        ✨ teamLab Covered Museum + Nishiki Arcade
                      </span>
                      <span className="bg-sky-200 dark:bg-sky-800 px-1.5 py-0.5 rounded text-[10px]">
                        100% Indoor
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-800 dark:text-sky-200 mt-1">
                      No wet shoes. 4 tickets re-routed without penalty fees.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Live Price Comparison & Anti-Duplicate Guard (Span 5) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8 shadow-lg relative overflow-hidden flex flex-col justify-between group" id="price-compare">
            <BorderBeam size={200} duration={14} colorFrom="#10b981" colorTo="#059669" />

            <div>
              <span className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 inline-block mb-4">
                <ShieldCheck className="w-6 h-6" />
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2">
                Live Price Compare & Anti-Duplicate Guard
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                Aggregates flights & hotels across Skyscanner, Google Flights, and Booking.com while locking out duplicate bookings made in separate chats.
              </p>
            </div>

            {/* Price Compare Mockup with Deduplication pill */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Shibuya 4-Person Suite</span>
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Best Deal: $<NumberTicker value={142} />/nt
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Anti-Duplicate Guard: Merged Sarah & Leo's room picks into 1 group discount.</span>
              </div>
            </div>
          </div>

          {/* Card 3: In-App Consensus Polling (Span 5) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8 shadow-lg relative overflow-hidden flex flex-col justify-between group">
            <BorderBeam size={200} duration={13} colorFrom="#f59e0b" colorTo="#d97706" />

            <div>
              <span className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 inline-block mb-4">
                <Vote className="w-6 h-6" />
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2">
                Consensus Polling & Tasks
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                Stop waiting for that one friend to reply on WhatsApp. Create instant voting cards with auto-locking consensus deadlines.
              </p>
            </div>

            {/* Interactive Polling Card */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2.5">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Where should we stay in Shinjuku?
              </span>

              {/* Option A */}
              <button
                onClick={() => handleVote("hotelA")}
                className={`w-full p-3 rounded-xl text-left border transition-all relative overflow-hidden ${
                  userVoted === "hotelA"
                    ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-orange-500/10 dark:bg-orange-500/20 transition-all duration-300"
                  style={{ width: `${percentA}%` }}
                />
                <div className="relative flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-900 dark:text-white">🏨 Shibuya Stream Boutique ($142/nt)</span>
                  <span className="text-orange-600">{percentA}% ({pollVotes.hotelA} votes)</span>
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleVote("hotelB")}
                className={`w-full p-3 rounded-xl text-left border transition-all relative overflow-hidden ${
                  userVoted === "hotelB"
                    ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-orange-500/10 dark:bg-orange-500/20 transition-all duration-300"
                  style={{ width: `${percentB}%` }}
                />
                <div className="relative flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-900 dark:text-white">🏡 Traditional Ryokan with Garden ($190/nt)</span>
                  <span className="text-orange-600">{percentB}% ({pollVotes.hotelB} votes)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Card 4: OCR Receipt Itemizer & Smart Splitter (Span 7) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8 shadow-lg relative overflow-hidden flex flex-col justify-between group" id="receipt-splitter">
            <BorderBeam size={220} duration={15} colorFrom="#a855f7" colorTo="#ec4899" />

            <div>
              <span className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 inline-block mb-4">
                <Receipt className="w-6 h-6" />
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2">
                OCR Receipt Scanner & "Who Owes Whom"
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                Snap a photo of any paper receipt, ticket, or bill. Our OCR automatically itemizes lines, lets members tap what they ate, and calculates exact net balances with 0 drama.
              </p>
            </div>

            {/* Receipt Itemizer Mockup */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between text-xs mb-3 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-purple-600" />
                  Ichiran Ramen Dinner (4 pax)
                </span>
                <span className="text-emerald-600 font-bold">Total: $118.00</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">4x Tonkotsu Ramen ($64)</span>
                  <span className="text-[11px] text-zinc-500">Split evenly: Sarah, Alex, Ken, Leo</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">4x Draft Beer & Gyoza ($54)</span>
                  <span className="text-[11px] text-purple-600 font-medium">Assigned to: Alex & Ken only</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Net Settlement:</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  Alex pays Sarah $43.00 · Leo pays Sarah $16.00 · Ken settled ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
