import React from "react";

interface BentoFeatureCard {
  id: string;
  isNew?: boolean;
  titleTag: string;
  description: string;
  renderArtwork: () => React.ReactNode;
}

const BENTO_CARDS: BentoFeatureCard[] = [
  // Card 1: Intelligent Itinerary Workspace
  {
    id: "itinerary-workspace",
    titleTag: "Intelligent Itinerary Workspace",
    description:
      "Plan multi-day adventures with automated route efficiency, real-time transit times, and interactive day-by-day activity blocks.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-[#f5f5f7] p-2 sm:p-3 flex items-center justify-center relative overflow-hidden shadow-xs border border-zinc-200/80 group/bento">
        {/* Mock Browser Header */}
        <div className="w-full h-full rounded-xl overflow-hidden relative flex flex-col border border-zinc-200 bg-white">
          <div className="h-6 bg-zinc-100 px-3 flex items-center gap-1.5 shrink-0 border-b border-zinc-200">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-zinc-500 ml-2">app.itinerai.com/itinerary</span>
          </div>
          <div className="relative flex-1 overflow-hidden p-1 flex items-center justify-center">
            <img
              src="/screenshots/itinerary_workspace.png"
              alt="ItinerAI Kyoto Workspace"
              className="w-full h-full object-contain transition-transform duration-300 group-hover/bento:scale-102"
            />
          </div>
        </div>
      </div>
    ),
  },

  // Card 2: On-Device Llama 3.2 AI & Group Consensus
  {
    id: "ai-group-consensus",
    isNew: true,
    titleTag: "On-Device Llama 3.2 & Group Polls",
    description:
      "Private, zero-latency WebGPU AI running directly in your browser. Launch group decision polls to eliminate chat indecision instantly.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-[#f5f5f7] p-2 sm:p-3 flex items-center justify-center relative overflow-hidden shadow-xs border border-zinc-200/80 group/bento">
        <div className="w-full h-full rounded-xl overflow-hidden relative flex flex-col border border-zinc-200 bg-white">
          <div className="h-6 bg-zinc-100 px-3 flex items-center gap-1.5 shrink-0 border-b border-zinc-200">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-purple-600 ml-2 font-semibold">⚡ Llama-3.2 WebGPU</span>
          </div>
          <div className="relative flex-1 overflow-hidden p-1 flex items-center justify-center">
            <img
              src="/screenshots/ai_chat_poll.png"
              alt="AI Chat and Group Poll"
              className="w-full h-full object-contain transition-transform duration-300 group-hover/bento:scale-102"
            />
          </div>
        </div>
      </div>
    ),
  },

  // Card 3: OCR Digital Receipts & Fair Splitting
  {
    id: "ocr-expenses",
    titleTag: "OCR Digital Receipts & Fair Splitting",
    description:
      "Scan crumpled paper bills with Tesseract.js. Automatically extract totals, calculate net group balances, and settle debts with one click.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-[#f5f5f7] p-2 sm:p-3 flex items-center justify-center relative overflow-hidden shadow-xs border border-zinc-200/80 group/bento">
        <div className="w-full h-full rounded-xl overflow-hidden relative flex flex-col border border-zinc-200 bg-white">
          <div className="h-6 bg-zinc-100 px-3 flex items-center gap-1.5 shrink-0 border-b border-zinc-200">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-zinc-500 ml-2">app.itinerai.com/expenses</span>
          </div>
          <div className="relative flex-1 overflow-hidden p-1 flex items-center justify-center">
            <img
              src="/screenshots/expenses_split.png"
              alt="Kyoto Expenses Split"
              className="w-full h-full object-contain transition-transform duration-300 group-hover/bento:scale-102"
            />
          </div>
        </div>
      </div>
    ),
  },

  // Card 4: Curated Stays & Live Flights
  {
    id: "stays-flights",
    titleTag: "Curated Stays & Live Flights",
    description:
      "Search real-time airline fares with Amadeus and discover top-rated Airbnb, Booking.com, and Trivago accommodations directly within your itinerary.",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 rounded-2xl bg-[#f5f5f7] p-2 sm:p-3 flex items-center justify-center relative overflow-hidden shadow-xs border border-zinc-200/80 group/bento">
        <div className="w-full h-full rounded-xl overflow-hidden relative flex flex-col border border-zinc-200 bg-white">
          <div className="h-6 bg-zinc-100 px-3 flex items-center gap-1.5 shrink-0 border-b border-zinc-200">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-zinc-500 ml-2">app.itinerai.com/stays</span>
          </div>
          <div className="relative flex-1 overflow-hidden p-1 flex items-center justify-center">
            <img
              src="/screenshots/hotel_search.png"
              alt="Curated Group Stays"
              className="w-full h-full object-contain transition-transform duration-300 group-hover/bento:scale-102"
            />
          </div>
        </div>
      </div>
    ),
  },
];

export const FeaturesBentoSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none scroll-mt-20" id="features">
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
