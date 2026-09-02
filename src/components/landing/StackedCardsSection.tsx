import React from "react";

interface StackCard {
  id: string;
  tag: string;
  tagBg: string;
  tagText: string;
  title?: string;
  description: string;
  bgColor: string;
  textColor: string;
  descColor: string;
  renderVisual: () => React.ReactNode;
}

const STACK_CARDS: StackCard[] = [
  // Card 1: Animate with agents (Light gray card)
  {
    id: "card-1",
    tag: "Animate with agents",
    tagBg: "bg-black",
    tagText: "text-white",
    description:
      "Skip the blank canvas. Describe your idea and let Itinerai AI generate editable itineraries, routes, and budget variations, ready for you to tweak and reuse.",
    bgColor: "bg-[#f5f5f7]",
    textColor: "text-zinc-950",
    descColor: "text-zinc-600",
    renderVisual: () => (
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center overflow-hidden">
        {/* Fan of travel poster cards */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="absolute -left-6 w-36 h-48 bg-black text-white p-3 rounded-xl -rotate-12 shadow-lg flex flex-col justify-between font-black text-xs">
            <span className="text-zinc-400 font-mono text-[9px]">OCTOBER</span>
            <span className="text-xl leading-none">KYOTO NIGHT</span>
          </div>

          <div className="absolute -right-6 w-36 h-48 bg-[#0047ff] text-white p-3 rounded-xl rotate-12 shadow-lg flex flex-col justify-between font-black text-xs">
            <span className="text-blue-200 font-mono text-[9px]">LIVE SYNC</span>
            <span className="text-xl leading-none">SHIBUYA STREAM</span>
          </div>

          <div className="relative z-10 w-44 h-56 bg-linear-to-b from-orange-400 via-rose-500 to-purple-700 text-white rounded-2xl shadow-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/90">
              FEATURED TRIP
            </span>
            <div className="text-left font-black text-2xl leading-tight">
              Fire<br />of love.<br />
              <span className="text-orange-200 text-base font-semibold">Streaming now.</span>
            </div>
            <div className="text-[9px] font-mono opacity-80 border-t border-white/30 pt-2">
              4 TRAVELERS · CONFIRMED
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // Card 2: Refine with full control (Vibrant Electric Blue card)
  {
    id: "card-2",
    tag: "Refine with full control",
    tagBg: "bg-white",
    tagText: "text-zinc-950",
    description:
      "Refine AI-generated plans or build your own trip from scratch with the most intuitive collaborative travel canvas to keep everyone aligned.",
    bgColor: "bg-[#00a8ff]",
    textColor: "text-white",
    descColor: "text-white/90",
    renderVisual: () => (
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center">
        <div className="w-full max-w-sm p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white text-left shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono mb-3 border-b border-white/20 pb-2">
            <span>LIVE CONSENSUS</span>
            <span className="bg-white/20 px-2 py-0.5 rounded font-bold">4/4 VOTED</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white/20 flex items-center justify-between font-semibold">
              <span>✈️ Direct Flight (JAL 006)</span>
              <span className="text-emerald-200 font-bold">$580</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/20 flex items-center justify-between font-semibold">
              <span>🏨 Shibuya Stream Suite (4 beds)</span>
              <span className="text-emerald-200 font-bold">$160/nt</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // Card 3: Ship motion at scale (Pastel Lilac / Purple card with huge 5x)
  {
    id: "card-3",
    tag: "Ship travel at scale",
    tagBg: "bg-white",
    tagText: "text-zinc-950",
    description:
      "Iterate, collaborate, and get sign-off fast in a shared workspace, and easily handle itinerary changes, weather re-routing, and instant expense splitting.",
    bgColor: "bg-[#a78bfa]",
    textColor: "text-zinc-950",
    descColor: "text-zinc-900/80",
    renderVisual: () => (
      <div className="relative w-full h-64 sm:h-72 flex flex-col items-center justify-center">
        <span className="text-[120px] sm:text-[150px] font-black text-[#581c87] leading-none select-none tracking-tighter drop-shadow-sm">
          5x
        </span>
        <span className="text-sm sm:text-base font-bold text-purple-950 uppercase tracking-wider -mt-2">
          Faster Group Consensus
        </span>
      </div>
    ),
  },
];

export const StackedCardsSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none relative" id="features-stack">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER (Jitter Exact Style)                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          {/* Top Pill */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f4f4f5] text-zinc-900 text-[13px] font-medium mb-8">
            <span>Travel, accelerated</span>
          </div>

          {/* Huge Headline */}
          <h2 className="text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] font-black tracking-[-0.04em] text-zinc-950 leading-[0.98] mb-8">
            From idea to trip<br />
            in seconds
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl">
            <strong className="text-zinc-950 font-semibold">Turn static travel ideas into synchronized plans in no time.</strong> Kickstart with AI, customize every detail, and easily coordinate group itineraries at scale.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. STICKY STACKING CARDS (Scroll Down -> Cards Slide Up One by One)       */}
        {/* ========================================================================= */}
        <div className="relative max-w-xl sm:max-w-2xl mx-auto space-y-12 sm:space-y-16 pb-20">
          {STACK_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className="sticky top-28 sm:top-32 transition-all duration-300"
              style={{
                zIndex: idx + 10,
              }}
            >
              <div
                className={`w-full rounded-[36px] sm:rounded-[44px] ${card.bgColor} p-8 sm:p-12 shadow-2xl shadow-zinc-950/15 border border-black/5 flex flex-col justify-between overflow-hidden min-h-[500px] sm:min-h-[560px]`}
              >
                {/* Header tag & description */}
                <div className="text-left">
                  <div className="mb-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-sm text-xs sm:text-sm font-bold tracking-tight ${card.tagBg} ${card.tagText}`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm font-normal leading-relaxed ${card.descColor} max-w-md`}>
                    {card.description}
                  </p>
                </div>

                {/* Visual artwork container */}
                <div className="w-full flex-1 flex items-center justify-center pt-6">
                  {card.renderVisual()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
