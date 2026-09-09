import React from "react";
import { FlippingBrandLogos } from "@/components/landing/FlippingBrandLogos";

interface HeroSectionProps {
  onOpenAuth?: (mode: "signup" | "login") => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  return (
    <section className="relative bg-white pt-24 sm:pt-32 pb-24 overflow-hidden" id="hero">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Main Hero Container */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Top Pill / Badge */}
          <button
            onClick={() => onOpenAuth?.("signup")}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f4f4f5] hover:bg-[#e4e4e7] text-zinc-800 text-[13px] font-medium transition-colors mb-10 cursor-pointer shadow-2xs"
          >
            <span className="font-bold text-zinc-950">Superagents:</span>
            <span>AI agents, built right into Itinerai</span>
            <span className="text-[#6366f1] font-semibold ml-1 hover:underline">
              Learn more
            </span>
          </button>

          {/* Massive Jitter-Style Headline */}
          <h1 className="text-[3.75rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.25rem] font-black tracking-[-0.04em] text-zinc-950 leading-[0.98] mb-10 select-none">
            Travel in motion.<br />
            Now with AI.
          </h1>

          {/* Iconic Jitter Pastel Lilac CTA Button */}
          <button
            onClick={() => onOpenAuth?.("signup")}
            className="px-8 py-3.5 rounded-full bg-[#b59dff] hover:bg-[#a68cfa] text-zinc-950 font-semibold text-[15px] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] mb-28 sm:mb-36 cursor-pointer"
          >
            Try Itinerai for free
          </button>

          {/* Divider with Center Text */}
          <div className="w-full relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative bg-white px-5 text-[13px] text-zinc-600 font-medium">
              Over <strong className="font-semibold text-zinc-900">20,000 creative teams</strong> use Itinerai to create stunning itineraries online.
            </div>
          </div>

          {/* 3D Flipping Monochrome Brand Logos */}
          <FlippingBrandLogos />
        </div>
      </div>

      {/* Floating Bottom-Right Help Button (Jitter Signature) */}
      <button
        onClick={() => onOpenAuth?.("login")}
        className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label="Help"
      >
        ?
      </button>
    </section>
  );
};
