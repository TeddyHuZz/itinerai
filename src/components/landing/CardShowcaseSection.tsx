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
  // Card 1: Kyoto Autumn Itinerary
  {
    id: "kyoto-itinerary",
    title: "Kyoto Autumn Itinerary",
    subtitle: "AI Route • 95% Transit Efficiency",
    avatarText: "KYO",
    avatarBg: "bg-rose-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/itinerary_workspace.png"
          alt="Kyoto Itinerary Workspace"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 2: Llama 3.2 WebGPU Group Decision Poll
  {
    id: "ai-group-poll",
    title: "AI Decision Consensus",
    subtitle: "Llama 3.2 WebGPU • Live Voting",
    avatarText: "AI",
    avatarBg: "bg-purple-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/ai_chat_poll.png"
          alt="Llama 3.2 Group Decision Poll"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 3: Smart Expense Splitting & Net Balances
  {
    id: "kyoto-expenses",
    title: "Smart Expense Splitting",
    subtitle: "Tesseract OCR • Net Group Balances",
    avatarText: "EXP",
    avatarBg: "bg-emerald-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/expenses_split.png"
          alt="Kyoto Expenses and Group Balances"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 4: Live Flight Search
  {
    id: "flight-search",
    title: "Live Flight Search",
    subtitle: "Amadeus GDS • Non-Stop Aggregation",
    avatarText: "FLT",
    avatarBg: "bg-blue-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/flight_search.png"
          alt="Amadeus Flight Search"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 5: Hotel & Stay Search
  {
    id: "hotel-search",
    title: "Curated Group Stays",
    subtitle: "Airbnb & Booking.com Live Rates",
    avatarText: "STAY",
    avatarBg: "bg-amber-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/hotel_search.png"
          alt="Hotel and Stay Search"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 6: Digital E-Invoice & OCR
  {
    id: "digital-einvoice",
    title: "Digital E-Invoice & OCR",
    subtitle: "LHDN Compliant • Auto Split Breakdown",
    avatarText: "INV",
    avatarBg: "bg-emerald-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/digital_einvoice.png"
          alt="Digital E-Invoice"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 7: Passport Chops Collection
  {
    id: "passport-chops",
    title: "Passport Chops Collection",
    subtitle: "Collectible Travel Stamps & Badges",
    avatarText: "CHOP",
    avatarBg: "bg-purple-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/passport_chops.png"
          alt="Passport Chops Collection"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 8: Your Escapes Multi-Trip Hub
  {
    id: "your-escapes",
    title: "Your Escapes Hub",
    subtitle: "Multi-Trip Dashboard • Active & Past Escapes",
    avatarText: "HUB",
    avatarBg: "bg-indigo-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/your_escapes.png"
          alt="Your Escapes Multi-Trip Hub"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
      </div>
    ),
  },

  // Card 9: Trip Companion Roster & Link Sharing
  {
    id: "trip-share-modal",
    title: "Companion Co-Planning",
    subtitle: "Instant Share Links • Planned Highlights Sync",
    avatarText: "CREW",
    avatarBg: "bg-teal-600",
    renderArtwork: () => (
      <div className="w-full h-64 sm:h-72 bg-white rounded-2xl shadow-md overflow-hidden relative border border-zinc-200/80 flex items-center justify-center p-2 group/art">
        <img
          src="/screenshots/trip_share_modal.png"
          alt="Trip Companions and Share Modal"
          className="w-full h-full object-contain transition-transform duration-300 group-hover/art:scale-102"
        />
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
