import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export const FooterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-white select-none">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. "TRY ITINERAI TODAY" CALL TO ACTION (Jitter Exact Style)               */}
        {/* ========================================================================= */}
        <div className="pt-24 sm:pt-36 pb-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-[3.5rem] sm:text-[5.5rem] md:text-[6.5rem] font-black tracking-[-0.04em] text-zinc-950 leading-[0.98] mb-6">
            Try Itinerai today
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed mb-10">
            No download, no install, no waiting.<br />
            Start creating instantly.
          </p>

          <a
            href="#try"
            className="px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[15px] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            Get started for free
          </a>
        </div>

        {/* ========================================================================= */}
        {/* 2. FOOTER NAVIGATION COLUMNS (5 Minimalist Columns)                       */}
        {/* ========================================================================= */}
        <div className="pt-16 pb-20 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-left text-xs sm:text-[13px]">
          {/* Column 1: Product */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-zinc-950 mb-1">Product</h5>
            <a href="#import" className="text-zinc-600 hover:text-zinc-950 transition-colors">Import from Booking</a>
            <a href="#design" className="text-zinc-600 hover:text-zinc-950 transition-colors">Trip Canvas</a>
            <a href="#animate" className="text-zinc-600 hover:text-zinc-950 transition-colors">AI Itineraries</a>
            <a href="#collaborate" className="text-zinc-600 hover:text-zinc-950 transition-colors">Collaborate</a>
            <a href="#export" className="text-zinc-600 hover:text-zinc-950 transition-colors">Export & Wallet</a>
          </div>

          {/* Column 2: Templates */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-zinc-950 mb-1">Templates</h5>
            <a href="#community" className="text-zinc-600 hover:text-zinc-950 transition-colors">Community</a>
            <a href="#devices" className="text-zinc-600 hover:text-zinc-950 transition-colors">Weekend Getaways</a>
            <a href="#text" className="text-zinc-600 hover:text-zinc-950 transition-colors">Road Trips</a>
            <a href="#logos" className="text-zinc-600 hover:text-zinc-950 transition-colors">City Crawls</a>
            <a href="#icons" className="text-zinc-600 hover:text-zinc-950 transition-colors">Budget Backpacking</a>
            <a href="#charts" className="text-zinc-600 hover:text-zinc-950 transition-colors">Family Vacations</a>
            <a href="#websites" className="text-zinc-600 hover:text-zinc-950 transition-colors">Ski Resorts</a>
            <a href="#buttons" className="text-zinc-600 hover:text-zinc-950 transition-colors">Beach & Island</a>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-zinc-950 mb-1">Resources</h5>
            <a href="#pricing" className="text-zinc-600 hover:text-zinc-950 transition-colors">Pricing</a>
            <a href="#discord" className="text-zinc-600 hover:text-zinc-950 transition-colors inline-flex items-center gap-1">
              Join our Discord <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#docs" className="text-zinc-600 hover:text-zinc-950 transition-colors inline-flex items-center gap-1">
              Documentation <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#tutorials" className="text-zinc-600 hover:text-zinc-950 transition-colors inline-flex items-center gap-1">
              Tutorials <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#expert" className="text-zinc-600 hover:text-zinc-950 transition-colors inline-flex items-center gap-1">
              Hire an expert <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#changelog" className="text-zinc-600 hover:text-zinc-950 transition-colors">Changelog</a>
            <a href="#figma" className="text-zinc-600 hover:text-zinc-950 transition-colors">Flight tracker</a>
            <a href="#lottie" className="text-zinc-600 hover:text-zinc-950 transition-colors">Receipt splitter</a>
            <a href="#alternative" className="text-zinc-600 hover:text-zinc-950 transition-colors">Spreadsheet alternative</a>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-zinc-950 mb-1">Company</h5>
            <a href="#customers" className="text-zinc-600 hover:text-zinc-950 transition-colors">Customers</a>
            <a href="#terms" className="text-zinc-600 hover:text-zinc-950 transition-colors">Terms & conditions</a>
            <a href="#privacy" className="text-zinc-600 hover:text-zinc-950 transition-colors">Privacy policy</a>
            <a href="#manifesto" className="text-zinc-600 hover:text-zinc-950 transition-colors">AI Manifesto</a>
            <a href="#trust" className="text-zinc-600 hover:text-zinc-950 transition-colors inline-flex items-center gap-1">
              Trust Center <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="#careers" className="text-zinc-600 hover:text-zinc-950 transition-colors inline-flex items-center gap-1">
              Careers <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Column 5: Connect */}
          <div className="flex flex-col gap-3">
            <h5 className="font-bold text-zinc-950 mb-1">Connect</h5>
            <a href="#sales" className="text-zinc-600 hover:text-zinc-950 transition-colors">Contact sales</a>
            <a href="#support" className="text-zinc-600 hover:text-zinc-950 transition-colors">Support</a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SOLID BLACK NEWSLETTER BANNER (Jitter Exact Style)                     */}
        {/* ========================================================================= */}
        <div className="w-full rounded-[32px] sm:rounded-[44px] bg-black text-white p-8 sm:p-14 md:p-16 mb-16 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Graffiti Cartoon Bubble Logo Sticker */}
          <div className="flex items-center justify-center">
            <div
              className="px-6 py-3 rounded-3xl bg-[#09090b] border-2 border-[#ec4899] shadow-2xl flex items-center justify-center transform -rotate-6 select-none"
              style={{
                filter: "drop-shadow(0 0 15px rgba(236,72,153,0.4))",
              }}
            >
              <div className="text-center font-black italic text-2xl sm:text-3xl text-[#f472b6] leading-none uppercase tracking-tighter">
                <span className="block" style={{ WebkitTextStroke: "1px #ffffff" }}>
                  ITINERAI
                </span>
                <span className="text-[#a855f7] text-lg sm:text-xl block -mt-1">
                  TRIPS ✈︎
                </span>
              </div>
            </div>
          </div>

          {/* Right Newsletter Callout + Lime-Yellow Subscribe Bar */}
          <div className="flex flex-col items-start text-left max-w-md w-full">
            <h3 className="text-2xl sm:text-3xl md:text-[2rem] font-black text-white tracking-[-0.03em] leading-[1.1] mb-6">
              Get product updates and inspiration in your inbox every month
            </h3>

            {subscribed ? (
              <div className="px-5 py-3 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                ✓ You're subscribed to Itinerai monthly!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full">
                <div className="w-full bg-[#27272a] rounded-full p-1.5 flex items-center border border-zinc-700/60 focus-within:border-zinc-500 transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="bg-transparent text-white placeholder-zinc-500 px-4 text-sm outline-none flex-1 min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#e2f952] hover:bg-[#d4ee3d] text-zinc-950 font-bold text-sm transition-transform active:scale-95 shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
