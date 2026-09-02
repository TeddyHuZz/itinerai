import React from "react";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-12 border-t border-zinc-800 relative overflow-hidden">
      {/* Glow orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-62.5 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Pre-footer Call to Action */}
        <div className="max-w-4xl mx-auto text-center mb-20 p-10 sm:p-14 rounded-3xl bg-linear-to-b from-zinc-900 to-zinc-900/80 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for your next adventure?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Plan your next group trip in minutes, not weeks.
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Zero setup fees. Free for groups up to 10 travelers. Experience the new standard of collaborative travel planning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#ai-playground">
              <ShimmerButton className="text-sm font-bold px-8 py-3.5">
                <span className="flex items-center gap-2">
                  Launch Free Group Trip
                  <ArrowRight className="w-4 h-4" />
                </span>
              </ShimmerButton>
            </a>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-800/80 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">Itinerai</span>
            <span>— The All-in-One Collaborative Travel Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#live-canvas" className="hover:text-white transition-colors">Live Studio</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai-playground" className="hover:text-white transition-colors">AI Generator</a>
            <a href="#price-compare" className="hover:text-white transition-colors">Price Compare</a>
            <a href="#receipt-splitter" className="hover:text-white transition-colors">Bill Splitter</a>
          </div>

          <div className="flex items-center gap-2">
            <span>Crafted for Travelers Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
