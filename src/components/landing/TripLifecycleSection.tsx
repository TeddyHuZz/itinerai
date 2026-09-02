import React from "react";
import { 
  XCircle, 
  CheckCircle2
} from "lucide-react";

export const TripLifecycleSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold mb-4">
            <span>The Reality Check</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            Why group trips usually fall apart.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg">
            Compare the chaotic multi-app chaos with Itinerai's unified collaborative studio.
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Old Chaotic Way */}
          <div className="p-8 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-200/80 dark:border-rose-900/60 text-left relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                <XCircle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  The Fragmented Nightmare
                </h3>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  WhatsApp + Excel + Notes App + Splitwise
                </span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span>
                  <strong>Lost in group chat:</strong> Links to Airbnbs and flights get buried under 800 memes and unread messages.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span>
                  <strong>Accidental double bookings:</strong> Two people book hotels in different neighborhoods because nobody confirmed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span>
                  <strong>Rain or flight delay panic:</strong> When plans break, someone spends 2 hours stressed out on Google Maps rewriting the schedule.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span>
                  <strong>Awkward money chases:</strong> Calculating who paid for the rental car vs groceries takes 3 weeks of manual math.
                </span>
              </li>
            </ul>
          </div>

          {/* The Itinerai Way */}
          <div className="p-8 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-800 text-left relative overflow-hidden shadow-xl shadow-emerald-500/5">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  The Itinerai Studio
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  1 Synchronized Live Hub for the entire crew
                </span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                <span>
                  <strong>One live canvas:</strong> Everyone sees flights, stays, pins, and votes in real time with interactive presence cursors.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                <span>
                  <strong>Anti-duplicate guard:</strong> Automatically blocks conflicting reservations and locks in group volume discounts.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                <span>
                  <strong>Adaptive AI Re-Routing:</strong> Thunderstorms or delay alerts automatically trigger seamless day schedule swaps.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-base leading-none">✓</span>
                <span>
                  <strong>Instant OCR receipt settlement:</strong> Snap a photo, tap what you ate, and balances settle with 1 tap.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
