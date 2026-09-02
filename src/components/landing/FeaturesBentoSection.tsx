import React from "react";

interface BentoFeatureCard {
  id: string;
  isNew?: boolean;
  titleTag: string;
  description: string;
  renderArtwork: () => React.ReactNode;
}

const BENTO_CARDS: BentoFeatureCard[] = [
  // Card 1: The complete travel suite (Vibrant iridescent Glass artwork)
  {
    id: "complete-suite",
    titleTag: "The complete travel suite",
    description:
      "Jump into a familiar interface and start planning instantly — with every flight search, hotel deal, and itinerary block just one click away.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-linear-to-tr from-[#0037ff] via-[#38bdf8] to-[#fb923c] p-6 flex items-center justify-center relative overflow-hidden shadow-xl">
        {/* Glow sphere effect */}
        <div className="absolute w-52 h-52 rounded-full bg-linear-to-b from-amber-300 via-sky-400 to-blue-700 blur-xs shadow-2xl" />
        
        {/* Frosted Glass Typographic Overlay */}
        <div className="relative z-10 text-white font-black text-6xl sm:text-7xl tracking-tighter drop-shadow-2xl select-none">
          Glass
        </div>
      </div>
    ),
  },

  // Card 2: Custom AI effects (Architectural grid with frosted floating pill)
  {
    id: "custom-ai",
    isNew: true,
    titleTag: "Custom AI effects",
    description:
      "Turn ideas into signature itineraries with just a prompt. Build your own tools and schedules with Itinerai AI, then tweak and reuse them so everything stays on-brand.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-white p-4 flex items-center justify-center relative overflow-hidden border border-zinc-200 shadow-xl">
        {/* Multi-window architectural collage */}
        <div className="grid grid-cols-3 gap-2 w-full h-full opacity-90">
          <div className="rounded-lg bg-linear-to-b from-amber-100 to-amber-300 overflow-hidden" />
          <div className="rounded-lg bg-linear-to-b from-sky-200 to-sky-500 overflow-hidden" />
          <div className="rounded-lg bg-linear-to-b from-stone-200 to-stone-400 overflow-hidden" />
        </div>

        {/* Frosted floating prompt badge */}
        <div className="absolute z-10 px-5 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-xl flex items-center gap-3">
          <div className="text-left">
            <span className="text-zinc-900 font-extrabold text-sm sm:text-base tracking-tight block">
              Generate an infinite grid
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-zinc-900/10 flex items-center justify-center text-zinc-900 font-bold text-xs">
            ↑
          </div>
        </div>
      </div>
    ),
  },

  // Card 3: Editorial Travel Journals (Three side-by-side legacy posters)
  {
    id: "editorial-journals",
    titleTag: "Infinite canvas & timelines",
    description:
      "Organize multiple travel days, backup rain plans, and group packing checklists on one shared, zoomable studio canvas.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-white p-6 flex items-center justify-center relative overflow-hidden border border-zinc-200 shadow-xl">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Poster 1 */}
          <div className="w-24 sm:w-28 h-36 sm:h-40 bg-[#f4f4f5] border border-zinc-300 rounded-lg p-2 flex flex-col justify-between text-zinc-900 shadow-md">
            <div className="text-[7px] font-black leading-tight tracking-tight uppercase">
              SINCE—1972<br />A LEGACY<br />WOVEN IN SILK
            </div>
            <div className="w-6 h-6 rounded bg-zinc-900" />
          </div>

          {/* Poster 2 */}
          <div className="w-24 sm:w-28 h-36 sm:h-40 bg-zinc-950 text-white rounded-lg p-2 flex flex-col justify-between shadow-xl">
            <div className="w-12 h-14 bg-zinc-800 rounded mx-auto mt-1" />
            <div className="text-[7px] font-mono tracking-widest uppercase text-zinc-400">
              SHIBUYA 2026
            </div>
          </div>

          {/* Poster 3 */}
          <div className="w-24 sm:w-28 h-36 sm:h-40 bg-[#111111] text-white rounded-lg p-2 flex flex-col justify-between shadow-md">
            <div className="text-[7px] font-black leading-tight uppercase">
              SINCE—1972<br />A LEGACY<br />WOVEN IN SILK
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 ml-auto" />
          </div>
        </div>
      </div>
    ),
  },

  // Card 4: Layered Art Collage (Chair & scenic postcards)
  {
    id: "layered-art",
    titleTag: "Export & share everywhere",
    description:
      "Share interactive real-time trip links with your friends or export offline PDF itineraries and Apple Wallet passes in seconds.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-white p-6 flex items-center justify-center relative overflow-hidden border border-zinc-200 shadow-xl">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Layered landscape cards */}
          <div className="absolute w-36 h-36 rounded-xl bg-linear-to-tr from-emerald-600 to-amber-300 rotate-6 shadow-md" />
          <div className="absolute w-36 h-36 rounded-xl bg-linear-to-bl from-sky-400 to-indigo-600 -rotate-6 shadow-md" />

          {/* Foreground white card with blue artistic sketch */}
          <div className="relative z-10 w-32 h-40 bg-white rounded-xl shadow-2xl border border-zinc-100 p-3 flex items-center justify-center">
            <svg
              className="w-20 h-20 text-[#0051ff] stroke-current fill-none stroke-2"
              viewBox="0 0 24 24"
            >
              <path d="M7 3v8h10V3M7 11v8M17 11v8M5 19h14" />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
];

export const FeaturesBentoSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none" id="features">
      <div className="max-w-350 mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER (Jitter Exact Style)                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Top Pill */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f4f4f5] text-zinc-900 text-[13px] font-medium mb-8">
            <span>Creative range</span>
          </div>

          {/* Huge Headline */}
          <h2 className="text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] font-black tracking-[-0.04em] text-zinc-950 leading-[0.98] mb-8">
            Supercharge your<br />
            creativity
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl mb-10">
            <strong className="text-zinc-950 font-semibold">Itinerai combines powerful trip planning features with intuitive controls and natural language</strong> so you can easily plan adventures you're proud of.
          </p>

          {/* Black CTA Pill Button */}
          <a
            href="#features"
            className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-xs"
          >
            Explore all the features
          </a>
        </div>

        {/* ========================================================================= */}
        {/* 2. 2x2 BENTO FEATURE GRID (Jitter Exact Style)                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {BENTO_CARDS.map((card) => (
            <div
              key={card.id}
              className="rounded-4xl bg-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl group"
            >
              {/* Artwork Container */}
              <div className="w-full mb-8">{card.renderArtwork()}</div>

              {/* Text Info */}
              <div className="text-left">
                {card.isNew && (
                  <span className="inline-block px-2 py-0.5 rounded-xs bg-[#fef08a] text-zinc-950 font-bold text-[11px] uppercase tracking-wider mb-2">
                    new
                  </span>
                )}
                <div className="mb-2">
                  <span className="inline-block px-2 py-0.5 rounded-xs bg-white text-zinc-950 font-bold text-sm sm:text-base tracking-tight shadow-2xs">
                    {card.titleTag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
