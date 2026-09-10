import { Wand2, Grid, Layers, Users } from "lucide-react";

export const ScaleFeaturesSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none scroll-mt-20" id="scale">
      <div className="max-w-350 mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. TOP ROW: LEFT HEADING + 2 RIGHT FEATURE CARDS                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          {/* Left Column: Heading, Pill, Subtitle */}
          <div className="flex flex-col items-start text-left pr-0 lg:pr-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f4f4f5] text-zinc-900 text-[13px] font-medium mb-8">
              <span>Made for groups</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-[3.75rem] font-black tracking-[-0.035em] text-zinc-950 leading-[1.02] mb-6">
              Where groups<br />
              plan at scale
            </h2>

            <p className="text-sm sm:text-[15px] text-zinc-600 font-normal leading-relaxed">
              <strong className="text-zinc-950 font-semibold">ItinerAI lets travel groups easily go from chaotic chats to synchronized itineraries</strong> with shared booking modules, automated price tracking, and AI workflows built for scale.
            </p>
          </div>

          {/* Card 1: On-Device AI Group Poll */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-4xl bg-[#f5f5f7] p-3 flex items-center justify-center overflow-hidden mb-5 border border-zinc-200/80 shadow-xs group">
              <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-white border border-zinc-200/60 p-2">
                <img
                  src="/screenshots/ai_chat_poll.png"
                  alt="On-Device AI Chat and Poll"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            </div>

            {/* Bottom Card Title & Description */}
            <div className="flex items-center gap-2 mb-1.5">
              <Wand2 className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Consensus Group Polls
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Tag @ItinerAI directly in group chat to propose activities, launch interactive decision polls, and automatically add winning spots to your day plan.
            </p>
          </div>

          {/* Card 2: Real-time Stays & Hotel Search */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-4xl bg-[#f5f5f7] p-3 flex items-center justify-center overflow-hidden mb-5 border border-zinc-200/80 shadow-xs group">
              <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-white border border-zinc-200/60 p-2">
                <img
                  src="/screenshots/hotel_search.png"
                  alt="Curated Group Stays"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            </div>

            {/* Bottom Card Title & Description */}
            <div className="flex items-center gap-2 mb-1.5">
              <Grid className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Multi-Channel Stays & Fares
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Compare Airbnb, Booking.com, and Trivago directly alongside real-time Amadeus flight fares without switching between dozens of browser tabs.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BOTTOM ROW: 2 FEATURE CARDS                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Card 3: Digital E-Invoices & Fiscal Splitting */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-4xl bg-[#f5f5f7] p-3 flex items-center justify-center overflow-hidden mb-5 border border-zinc-200/80 shadow-xs group">
              <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-white border border-zinc-200/60 p-2">
                <img
                  src="/screenshots/digital_einvoice.png"
                  alt="Digital E-Invoice and Settlement"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Tax-Compliant E-Invoicing
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Generate officially certified digital e-invoices with QR verification, proportional companion allocations, and one-click PDF export for group fiscal transparency.
            </p>
          </div>

          {/* Card 4: Trip Companions & Instant Sharing */}
          <div className="flex flex-col text-left">
            <div className="w-full h-80 rounded-4xl bg-[#f5f5f7] p-3 flex items-center justify-center overflow-hidden mb-5 border border-zinc-200/80 shadow-xs group">
              <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-white border border-zinc-200/60 p-2">
                <img
                  src="/screenshots/trip_share_modal.png"
                  alt="Trip Companions and Share Modal"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <Users className="w-4 h-4 text-zinc-950" />
              <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                Instant Companion Invites
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Generate shareable trip links in one click, sync live companion rosters, and align on planned highlights before opening the full itinerary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
