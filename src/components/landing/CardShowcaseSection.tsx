import React from "react";
import { Marquee } from "@/components/ui/marquee";

interface ShowcaseCard {
  id: string;
  title: string;
  subtitle: string;
  avatarText?: string;
  avatarBg?: string;
  renderArtwork: () => React.ReactNode;
}

const SHOWCASE_CARDS: ShowcaseCard[] = [
  // Card 1: Orbit: Cards (Rico Supply) - from screenshot
  {
    id: "orbit-cards",
    title: "Orbit: Cards",
    subtitle: "Rico Supply",
    avatarText: "rico",
    avatarBg: "bg-[#0051ff]",
    renderArtwork: () => (
      <div className="w-60 sm:w-65 h-60 sm:h-65 bg-zinc-200 rounded-xl shadow-2xl p-3 flex items-center justify-center overflow-hidden relative border border-zinc-300">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Background card fan */}
          <div className="absolute -left-2 w-28 h-36 bg-zinc-800 rounded-lg -rotate-12 shadow-lg flex items-center justify-center text-white text-[9px] font-bold">
            BODY WORK
          </div>
          <div className="absolute w-32 h-44 bg-white rounded-lg shadow-xl p-3 text-zinc-950 font-black text-xs leading-none z-10 flex flex-col justify-between">
            <span className="text-[14px]">BODY WORK 197 NOW</span>
            <span className="text-[10px] text-zinc-400 font-mono">1973</span>
          </div>
          <div className="absolute -right-2 w-28 h-36 bg-amber-400 rounded-lg rotate-12 shadow-lg p-2 flex flex-col justify-end text-black font-black text-xs">
            PARK
          </div>
        </div>
      </div>
    ),
  },

  // Card 2: Blend Modes: Double Exposure (Jitter) - from screenshot
  {
    id: "blend-modes",
    title: "Blend Modes: Double Exposure",
    subtitle: "Itinerai",
    avatarText: "Itinerai",
    avatarBg: "bg-black",
    renderArtwork: () => (
      <div className="w-60 sm:w-65 h-60 sm:h-65 bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden relative flex items-center justify-center border border-zinc-800">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Stylized statue warrior & horse graphic */}
          <svg
            className="w-40 h-40 text-zinc-200 fill-current drop-shadow-xl"
            viewBox="0 0 24 24"
          >
            <path d="M19.5 12c-1.5-2-4-3-6.5-2.5l1.5-4.5L12 3l-2.5 4-4 2 1.5 3.5C5 14 4 16 4 18.5c0 1.5 1 2.5 2.5 2.5h11c1.5 0 2.5-1 2.5-2.5 0-2.5-1.5-4.5-0.5-6.5z" />
          </svg>
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80" />
        </div>
      </div>
    ),
  },

  // Card 3: The Stack: Sale (Jitter) - from screenshot
  {
    id: "the-stack-sale",
    title: "The Stack: Sale",
    subtitle: "Itinerai",
    avatarText: "Itinerai",
    avatarBg: "bg-black",
    renderArtwork: () => (
      <div className="w-60 sm:w-65 h-60 sm:h-65 bg-[#0047ff] text-white rounded-xl shadow-2xl p-5 flex flex-col justify-between overflow-hidden relative">
        <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-white/80">
          <span>❖ Mango</span>
          <span className="font-mono text-[9px]">juliemang.com</span>
        </div>

        {/* Center radial dots pattern + Sale title */}
        <div className="relative my-auto flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-36 h-36 rounded-full border border-dashed border-white" />
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-white" />
          </div>
          <span className="relative z-10 text-[23px] sm:text-[25px] font-black tracking-tight drop-shadow-md">
            Sale: 30% Off
          </span>
        </div>

        <div className="text-right text-[8px] font-mono text-white/60">
          LIMITED EDITION
        </div>
      </div>
    ),
  },

  // Card 4: Stretched Type Repeater (Exact Blue/White typography poster style)
  {
    id: "stretched-type",
    title: "Stretched Type Repeater",
    subtitle: "Itinerai",
    avatarText: "Itinerai",
    avatarBg: "bg-black",
    renderArtwork: () => (
      <div className="w-60 sm:w-65 h-60 sm:h-65 bg-white rounded-xl shadow-2xl p-4 flex flex-col justify-between overflow-hidden relative border border-blue-100">
        <div className="text-[#0026ff] font-black leading-[0.82] tracking-tighter text-[44px] select-none uppercase">
          <div className="scale-y-125 origin-top">LOVE</div>
          <div className="bg-[#0026ff] text-white px-1 my-1 scale-y-110">HATE</div>
          <div className="scale-y-150 origin-bottom">OVELO</div>
          <div className="text-[28px] tracking-widest opacity-80 mt-1">ITINERAI</div>
        </div>
        <div className="absolute inset-0 bg-linear-to-tr from-blue-600/5 to-transparent pointer-events-none" />
      </div>
    ),
  },

  // Card 5: Ripple Effect (Monochrome portrait with glass rings)
  {
    id: "ripple-effect",
    title: "Ripple Effect",
    subtitle: "Itinerai",
    avatarText: "Itinerai",
    avatarBg: "bg-black",
    renderArtwork: () => (
      <div className="w-60 sm:w-65 h-60 sm:h-65 bg-black rounded-xl shadow-2xl overflow-hidden relative flex items-center justify-center border border-zinc-200">
        <div className="absolute inset-0 bg-radial from-zinc-200 via-zinc-400 to-zinc-950 opacity-90" />
        
        {/* Concentric glass distortion rings */}
        <div className="relative z-10 w-44 h-44 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <div className="w-20 h-20 rounded-full border border-white/80 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-[10px] font-mono tracking-widest text-white/90 uppercase font-bold">
                ACME®
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-[8px] font-mono tracking-wider text-white/70 uppercase">
          Spring/Summer Collection
        </div>
      </div>
    ),
  },

  // Card 6: The Stack: Livestream
  {
    id: "the-stack",
    title: "The Stack: Livestream",
    subtitle: "Itinerai",
    avatarText: "Itinerai",
    avatarBg: "bg-black",
    renderArtwork: () => (
      <div className="w-60 sm:w-65 h-60 sm:h-65 bg-[#0047ff] text-white rounded-xl shadow-2xl p-5 flex flex-col justify-between overflow-hidden relative">
        <div>
          <h4 className="text-[22px] font-extrabold leading-[1.05] tracking-tight">
            Livestream
          </h4>
          <p className="text-[17px] font-bold text-white/90">
            July 15, 2026
          </p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-white/80 mt-1">
            <span>☼ 8-10am</span>
          </div>
        </div>

        <div className="flex justify-center items-center py-2">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg rotate-45 backdrop-blur-xs border border-white/40 shadow-inner" />
            <div className="absolute w-8 h-8 bg-white/40 rounded-md rotate-12 border border-white/60" />
            <div className="absolute w-4 h-4 bg-white rounded-sm shadow-md" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-bold tracking-wider text-white/80 uppercase">
          <span>❖ Mango</span>
          <span className="font-normal lowercase text-[8px] opacity-80">Save your spot...</span>
        </div>
      </div>
    ),
  },
];

export const CardShowcaseSection: React.FC = () => {
  return (
    <section className="w-full pt-12 pb-32 bg-white overflow-hidden select-none">
      {/* Infinite Horizontal Sliding Marquee (Continuous Left Slide) */}
      <Marquee
        pauseOnHover
        className="[--duration:35s] [--gap:2rem] py-6"
        repeat={4}
      >
        {SHOWCASE_CARDS.map((card) => (
          <div
            key={card.id}
            className="w-85 sm:w-95 md:w-102.5 h-115 sm:h-122.5 rounded-4xl bg-[#f5f5f7] p-8 sm:p-9 flex flex-col justify-between items-center shrink-0 transition-transform duration-300 hover:scale-[1.015] cursor-pointer"
          >
            {/* Centered Artwork Container */}
            <div className="w-full flex-1 flex items-center justify-center">
              {card.renderArtwork()}
            </div>

            {/* Bottom Card Title & Subtitle Info (Jitter Exact Style) */}
            <div className="w-full flex items-center gap-3 pt-6 text-left">
              {/* Avatar Circle with Brand Text */}
              <div
                className={`w-8 h-8 rounded-full ${
                  card.avatarBg || "bg-zinc-950"
                } text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs`}
              >
                {card.avatarText || "Itinerai"}
              </div>

              <div>
                <h4 className="text-[15px] font-bold text-zinc-950 tracking-tight leading-tight">
                  {card.title}
                </h4>
                <p className="text-[12px] text-zinc-500 font-medium">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
};
