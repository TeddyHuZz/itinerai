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
  // Card 1: Coordinate Escapes & Companions (Light gray card)
  {
    id: "card-1",
    tag: "Coordinate Escapes & Companions",
    tagBg: "bg-black",
    tagText: "text-white",
    description:
      "Skip the blank canvas. Manage multiple active journeys, invite travel companions, and switch seamlessly between trips across Kyoto, Amalfi, and Zermatt.",
    bgColor: "bg-[#f5f5f7]",
    textColor: "text-zinc-950",
    descColor: "text-zinc-600",
    renderVisual: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-white p-2.5 flex items-center justify-center group">
        <img
          src="/screenshots/your_escapes.png"
          alt="Your Escapes Multi-Trip Hub"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
        />
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
      "Refine AI-generated plans or build your trip from scratch with real-time flight fares, direct carrier hand-offs, and multi-day itinerary synchronization.",
    bgColor: "bg-[#00a8ff]",
    textColor: "text-white",
    descColor: "text-white/90",
    renderVisual: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white p-2.5 flex items-center justify-center group">
        <img
          src="/screenshots/flight_search.png"
          alt="Amadeus Live Flight Search"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
        />
      </div>
    ),
  },

  // Card 3: Align groups at scale (Pastel Lilac / Purple card with huge 5x)
  {
    id: "card-3",
    tag: "Align groups at scale",
    tagBg: "bg-white",
    tagText: "text-zinc-950",
    description:
      "Iterate, collaborate, and get sign-off fast in a shared workspace, and easily handle itinerary changes, route optimization, and instant expense splitting.",
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
      <div className="max-w-350 mx-auto px-6 sm:px-12">
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
                className={`w-full rounded-4xl sm:rounded-[44px] ${card.bgColor} p-8 sm:p-12 shadow-2xl shadow-zinc-950/15 border border-black/5 flex flex-col justify-between overflow-hidden min-h-125 sm:min-h-140`}
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
