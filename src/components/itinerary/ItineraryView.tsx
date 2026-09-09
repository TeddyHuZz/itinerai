import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DateRangePickerModal } from "../dashboard/DateRangePickerModal";
import {
  Plus,
  Share2,
  Calendar,
  MapPin,
  Copy,
  Check,
  X,
  Sparkles,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export interface TripItem {
  id: string;
  destination: string;
  dates: string;
  startDate: string;
  endDate: string;
  image: string;
  status: "Planning" | "Confirmed" | "Exploring";
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  totalMembersCount: number;
  inviteCode: string;
  budget?: string;
  highlights?: string[];
}

const INITIAL_TRIPS: TripItem[] = [
  {
    id: "trip-bali",
    destination: "Bali, Indonesia",
    dates: "Aug 12 - 20",
    startDate: "2026-08-12",
    endDate: "2026-08-20",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80",
    status: "Planning",
    members: [
      {
        id: "m-1",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "m-2",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "m-3",
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    ],
    totalMembersCount: 4,
    inviteCode: "BALI26-GROUP",
    budget: "RM 2,400 / person",
    highlights: ["Ubud Rice Terraces", "Seminyak Beach Club", "Mount Batur Sunrise Trek"],
  },
  {
    id: "trip-amalfi",
    destination: "Amalfi Coast, Italy",
    dates: "Sep 14 - 22",
    startDate: "2026-09-14",
    endDate: "2026-09-22",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
    status: "Planning",
    members: [
      {
        id: "m-1",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "m-4",
        name: "Elena Rossi",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
    ],
    totalMembersCount: 3,
    inviteCode: "AMALFI-SUMMER",
    budget: "RM 4,200 / person",
    highlights: ["Positano Cliffside Walk", "Capri Private Boat Tour", "Ravello Gardens"],
  },
  {
    id: "trip-kyoto",
    destination: "Kyoto, Japan",
    dates: "Oct 15 - 24",
    startDate: "2026-10-15",
    endDate: "2026-10-24",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
    status: "Confirmed",
    members: [
      {
        id: "m-2",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "m-3",
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "m-5",
        name: "Kenji Sato",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    totalMembersCount: 5,
    inviteCode: "KYOTO-AUTUMN",
    budget: "RM 3,100 / person",
    highlights: ["Fushimi Inari Torii Gates", "Arashiyama Bamboo Grove", "Gion Tea Houses"],
  },
  {
    id: "trip-swiss",
    destination: "Zermatt, Swiss Alps",
    dates: "Dec 18 - 26",
    startDate: "2026-12-18",
    endDate: "2026-12-26",
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=80",
    status: "Exploring",
    members: [
      {
        id: "m-3",
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    ],
    totalMembersCount: 2,
    inviteCode: "ZERMATT-WINTER",
    budget: "RM 5,500 / person",
    highlights: ["Matterhorn Glacier Paradise", "Gornergrat Railway", "Alpine Fondue Evening"],
  },
];

const CURATED_DESTINATIONS: { keywords: string[]; image: string }[] = [
  {
    keywords: ["thailand", "phuket", "bangkok", "chiang mai", "krabi", "samui", "phi phi"],
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["bali", "indonesia", "lombok", "ubud", "seminyak", "canggu"],
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["japan", "tokyo", "kyoto", "osaka", "hokkaido", "fuji"],
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["italy", "rome", "amalfi", "positano", "venice", "florence", "milan"],
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["france", "paris", "nice", "cannes", "lyon"],
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["switzerland", "swiss", "zermatt", "alps", "zurich", "interlaken"],
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["spain", "barcelona", "madrid", "seville", "ibiza", "mallorca"],
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["greece", "santorini", "athens", "mykonos", "crete"],
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["korea", "seoul", "busan", "jeju"],
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["singapore"],
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["malaysia", "kuala lumpur", "penang", "langkawi"],
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["vietnam", "da nang", "hanoi", "ho chi minh", "ha long"],
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["australia", "sydney", "melbourne", "brisbane", "gold coast"],
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["united states", "usa", "new york", "hawaii", "california", "los angeles"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["london", "uk", "england", "scotland"],
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["iceland", "reykjavik"],
    image:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["turkey", "istanbul", "cappadocia"],
    image:
      "https://images.unsplash.com/photo-1641128324571-a93c347b587d?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["dubai", "uae", "abu dhabi"],
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80",
  },
  {
    keywords: ["maldives"],
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&auto=format&fit=crop&q=80",
  },
];

export const getCrawledDestinationImage = (destination: string): string => {
  const query = destination.trim().toLowerCase();
  if (!query) {
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80";
  }

  const match = CURATED_DESTINATIONS.find((item) =>
    item.keywords.some((k) => query.includes(k))
  );

  if (match) {
    return match.image;
  }

  return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80";
};

interface ItineraryViewProps {
  onNavigateToSearch?: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onNavigateToSearch }) => {
  const [trips, setTrips] = useState<TripItem[]>(INITIAL_TRIPS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastNotice, setToastNotice] = useState<{
    message: string;
    isDelete?: boolean;
  } | null>(null);

  // New Trip Form States
  const [newDestination, setNewDestination] = useState("");
  const [newDates, setNewDates] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | null>(null);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);

  const showToast = (message: string, isDelete = false) => {
    setToastNotice({ message, isDelete });
    setTimeout(() => {
      setToastNotice(null);
    }, 3200);
  };

  const copyShareLink = (trip: TripItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `https://itinerai.com/trip/${trip.id}?join=${trip.inviteCode}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    showToast(`Invite link for ${trip.destination} copied to clipboard!`);
  };

  const handleDeleteTrip = (tripId: string, destinationName: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    setSelectedTrip(null);
    setShowDeleteConfirm(false);
    showToast(`"${destinationName}" was deleted from your escapes`, true);
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestination.trim()) return;

    // Automatically crawl / resolve the aesthetic destination picture based on the entered destination
    const autoImage = getCrawledDestinationImage(newDestination);

    const newTrip: TripItem = {
      id: `trip-${Date.now()}`,
      destination: newDestination.trim(),
      dates: newDates.trim() || "Dates flexible",
      startDate: newStartDate ? newStartDate.toISOString().split("T")[0] : "2026-11-01",
      endDate: newEndDate ? newEndDate.toISOString().split("T")[0] : "2026-11-08",
      image: autoImage,
      status: "Planning",
      members: [
        {
          id: "m-you",
          name: "Alex Morgan (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      ],
      totalMembersCount: 1,
      inviteCode: `TRIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      highlights: ["Group itinerary planning started", "Flights & Stays voting"],
    };

    setTrips([newTrip, ...trips]);
    setIsCreateModalOpen(false);
    setNewDestination("");
    setNewDates("");
    setNewStartDate(null);
    setNewEndDate(null);

    // Show copy link alert for the created trip
    copyShareLink(newTrip);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 flex flex-col pb-28">

      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Your Escapes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            Coordinate itineraries &amp; invite travel companions
          </p>
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle (Desktop only) */}
          <div className="hidden md:flex items-center bg-white p-1 rounded-xl border border-zinc-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-[#963314] text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-[#963314] text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Line</span>
            </button>
          </div>

          {/* Desktop Create Trip CTA */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Trip</span>
          </button>
        </div>
      </div>

      {/* Trips Content */}
      {viewMode === "grid" ? (
        /* Grid Layout (Responsive: 1-col on mobile, 2-col on md, 3-col on lg) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-zinc-200/80 transition-all cursor-pointer flex flex-col justify-end p-5 text-white"
            >
              {/* Background Photo with Zoom on Hover */}
              <img
                src={trip.image}
                alt={trip.destination}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay for Legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10 transition-opacity" />

              {/* Top Row: Status Badge & Share Button */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  {trip.status}
                </span>

                <button
                  type="button"
                  title="Copy shareable invite link"
                  onClick={(e) => copyShareLink(trip, e)}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-white hover:text-zinc-900 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Content: Destination, Dates, and Member Avatars */}
              <div className="relative z-10 flex items-end justify-between gap-3">
                <div className="flex-1 pr-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight drop-shadow-sm">
                    {trip.destination}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-200/90 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                    <span>{trip.dates}</span>
                  </div>
                </div>

                {/* Overlapping Avatar Stack */}
                <div className="flex items-center -space-x-2 shrink-0">
                  {trip.members.slice(0, 3).map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      title={member.name}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                    />
                  ))}
                  {trip.totalMembersCount > trip.members.slice(0, 3).length && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 text-zinc-800 text-[11px] font-black flex items-center justify-center shadow-xs">
                      +{trip.totalMembersCount - trip.members.slice(0, 3).length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Line / List Layout */
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-zinc-100">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#963314]/10 text-[#963314]">
                      {trip.status}
                    </span>
                    {trip.budget && (
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {trip.budget}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 leading-tight">
                    {trip.destination}
                  </h3>
                  <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{trip.dates}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                {/* Avatar Stack */}
                <div className="flex items-center -space-x-2">
                  {trip.members.slice(0, 3).map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  {trip.totalMembersCount > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-zinc-200 text-zinc-700 text-[10px] font-bold flex items-center justify-center">
                      +{trip.totalMembersCount - 3}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => copyShareLink(trip, e)}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-xs font-bold text-zinc-700 flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#f15a24]" />
                  <span>Share Invite</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) on Mobile / Universal */}
      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        aria-label="Create new trip"
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-2xl bg-[#ff6f43] hover:bg-[#f15a24] text-white shadow-xl shadow-[#ff6f43]/40 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* ======================================================================= */}
      {/* CREATE NEW TRIP MODAL                                                   */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
            <div
              className="absolute inset-0"
              onClick={() => setIsCreateModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-950">Create New Escape</h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    Start a collaborative trip and invite friends
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 stroke-2" />
                </button>
              </div>

              <form onSubmit={handleCreateTrip} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Destination Name
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-200 focus-within:border-[#963314] focus-within:ring-2 focus-within:ring-[#963314]/10 transition-all">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      required
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      placeholder="e.g. Barcelona, Spain or Phuket, Thailand"
                      className="w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Travel Dates
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(true)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 focus:border-[#963314] focus:ring-2 focus:ring-[#963314]/10 transition-all text-left cursor-pointer bg-white group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar className="w-4 h-4 text-zinc-400 group-hover:text-[#963314] transition-colors shrink-0" />
                      <span
                        className={`text-sm font-semibold truncate ${
                          newDates ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {newDates || "Select dates (From - To)"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#963314] shrink-0 hover:underline">
                      {newDates ? "Change" : "Choose"}
                    </span>
                  </button>
                </div>

                {/* Auto-Crawled Aesthetic Photo Preview */}
                {newDestination.trim() && (
                  <div className="rounded-2xl overflow-hidden border border-zinc-200/90 shadow-xs relative h-32 text-left transition-all">
                    <img
                      src={getCrawledDestinationImage(newDestination)}
                      alt={newDestination}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                      <div>
                        <div className="text-sm font-extrabold truncate drop-shadow-sm">
                          {newDestination}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                        Ready
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    Create &amp; Get Share Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* TRIP DETAIL PREVIEW MODAL                                               */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
            <div
              className="absolute inset-0"
              onClick={() => {
                setSelectedTrip(null);
                setShowDeleteConfirm(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Cover Image */}
              <div className="h-52 w-full relative overflow-hidden bg-zinc-900 shrink-0">
                <img
                  src={selectedTrip.image}
                  alt={selectedTrip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrip(null);
                    setShowDeleteConfirm(false);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-white hover:text-zinc-900 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-2" />
                </button>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#f15a24] text-white">
                    {selectedTrip.status}
                  </span>
                  <h3 className="text-2xl font-black mt-1 leading-tight">
                    {selectedTrip.destination}
                  </h3>
                  <div className="text-xs text-zinc-200 flex items-center gap-2 mt-0.5">
                    <span>{selectedTrip.dates}</span>
                    {selectedTrip.budget && (
                      <>
                        <span>•</span>
                        <span>{selectedTrip.budget}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left">
                {/* Shareable Friends Link Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-[#963314] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">
                        Share with Friends
                      </div>
                      <div className="text-[11px] text-zinc-500 font-medium">
                        Invite companions to plan &amp; vote on activities
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyShareLink(selectedTrip)}
                    className="px-3 py-1.5 rounded-xl bg-[#963314] hover:bg-[#802a0f] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </button>
                </div>

                {/* Companions in this escape */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Trip Companions ({selectedTrip.totalMembersCount})
                    </h4>
                    <span className="text-[11px] font-bold text-[#f15a24] cursor-pointer" onClick={() => copyShareLink(selectedTrip)}>
                      + Invite More
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200"
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-zinc-800">
                          {member.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trip Highlights & Itinerary status */}
                {selectedTrip.highlights && selectedTrip.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Planned Highlights
                    </h4>
                    <div className="space-y-1.5">
                      {selectedTrip.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs font-medium text-zinc-700 bg-zinc-50/70 p-2 rounded-xl"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#f15a24] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between min-h-17">
                {showDeleteConfirm ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-rose-50/95 border border-rose-200/90 px-3.5 py-2.5 rounded-2xl"
                  >
                    <div className="flex items-center gap-2 text-rose-950 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Permanently delete this trip?</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 bg-white hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteTrip(selectedTrip.id, selectedTrip.destination)
                        }
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Confirm Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-full flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTrip(null);
                          setShowDeleteConfirm(false);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100/70 hover:text-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer group"
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>Delete Trip</span>
                      </button>
                    </div>

                    {onNavigateToSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTrip(null);
                          setShowDeleteConfirm(false);
                          onNavigateToSearch();
                        }}
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <span>Search Flights &amp; Hotels</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Date Range Picker Calendar Modal */}
      <DateRangePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        startDate={newStartDate}
        endDate={newEndDate}
        zIndexClass="z-[60]"
        onApply={(start, end, formattedStr) => {
          setNewStartDate(start);
          setNewEndDate(end);
          setNewDates(formattedStr);
          setIsDatePickerOpen(false);
        }}
      />

      {/* Toast Notification (Highest z-index [100] to always float above modals) */}
      <AnimatePresence>
        {toastNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-100 max-w-md w-[calc(100%-2rem)] p-3.5 rounded-2xl text-white text-xs flex items-center justify-between shadow-2xl shadow-black/50 border pointer-events-auto ${
              toastNotice.isDelete
                ? "bg-rose-950/95 border-rose-700/80"
                : "bg-zinc-950/95 border-zinc-700/80"
            } backdrop-blur-md`}
          >
            <div className="flex items-center gap-2.5">
              {toastNotice.isDelete ? (
                <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Share2 className="w-4 h-4 text-[#f15a24] shrink-0" />
              )}
              <span className="font-semibold">{toastNotice.message}</span>
            </div>
            {toastNotice.isDelete ? (
              <Check className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
