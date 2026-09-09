import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Share2,
  ThumbsUp,
  Trash2,
  X,
  Compass,
  Utensils,
  Mountain,
  Building2,
  Plane,
  Users,
  MessageSquare,
} from "lucide-react";
import type { TripItem } from "./ItineraryView";

export interface DayActivity {
  id: string;
  day: number;
  time: string;
  period: "Morning" | "Afternoon" | "Evening";
  title: string;
  category: "Sightseeing" | "Food" | "Adventure" | "Culture" | "Stay" | "Transit";
  location: string;
  notes?: string;
  votes: number;
  hasVoted: boolean;
  cost?: string;
}

// Initial sample activities for preloaded destinations
const INITIAL_ACTIVITIES: Record<string, DayActivity[]> = {
  "trip-kyoto": [
    {
      id: "act-k-1",
      day: 1,
      time: "09:00 AM",
      period: "Morning",
      title: "Fushimi Inari-taisha Torii Gates",
      category: "Culture",
      location: "Fushimi Ward, Kyoto",
      notes: "Hike the 10,000 vermilion torii gates early to avoid heavy midday tourist crowds.",
      votes: 4,
      hasVoted: true,
      cost: "Free",
    },
    {
      id: "act-k-2",
      day: 1,
      time: "01:00 PM",
      period: "Afternoon",
      title: "Nishiki Market Culinary Tour",
      category: "Food",
      location: "Nakagyo Ward, Kyoto",
      notes: "Sample fresh seafood skewers, matcha dango, and artisanal tofu snacks.",
      votes: 3,
      hasVoted: false,
      cost: "¥3,500 / person",
    },
    {
      id: "act-k-3",
      day: 1,
      time: "06:30 PM",
      period: "Evening",
      title: "Gion District Evening Walking Tour & Tea Ceremony",
      category: "Culture",
      location: "Gion, Kyoto",
      notes: "Traditional wooden machiya houses, geisha district, lantern-lit alleys.",
      votes: 5,
      hasVoted: true,
      cost: "¥5,000 / person",
    },
    {
      id: "act-k-4",
      day: 2,
      time: "08:30 AM",
      period: "Morning",
      title: "Arashiyama Bamboo Grove & Tenryu-ji Temple",
      category: "Sightseeing",
      location: "Ukyo Ward, Kyoto",
      notes: "Serene morning walk through towering bamboo stalks and Zen rock gardens.",
      votes: 4,
      hasVoted: true,
      cost: "¥500",
    },
    {
      id: "act-k-5",
      day: 2,
      time: "02:00 PM",
      period: "Afternoon",
      title: "Kinkaku-ji (Golden Pavilion)",
      category: "Sightseeing",
      location: "Kita Ward, Kyoto",
      notes: "Gilded Zen Buddhist temple reflecting over the mirror pond.",
      votes: 3,
      hasVoted: false,
      cost: "¥500",
    },
    {
      id: "act-k-6",
      day: 3,
      time: "10:00 AM",
      period: "Morning",
      title: "Kiyomizu-dera Wooden Stage & Higashiyama Walk",
      category: "Culture",
      location: "Higashiyama Ward, Kyoto",
      notes: "Historic wooden temple terrace with sweeping views over Kyoto city.",
      votes: 4,
      hasVoted: true,
      cost: "¥400",
    },
  ],
  "trip-bali": [
    {
      id: "act-b-1",
      day: 1,
      time: "02:00 PM",
      period: "Afternoon",
      title: "Private Villa Check-in & Poolside Welcome",
      category: "Stay",
      location: "Seminyak, Bali",
      notes: "Welcome drinks, unpack, and arrange scooter rentals for the week.",
      votes: 3,
      hasVoted: true,
    },
    {
      id: "act-b-2",
      day: 1,
      time: "05:30 PM",
      period: "Evening",
      title: "Seminyak Beach Club Sunset & Dinner",
      category: "Food",
      location: "Seminyak Beach",
      notes: "Reserved beachfront daybeds for legendary Indian Ocean sunset cocktails.",
      votes: 4,
      hasVoted: true,
      cost: "IDR 650,000",
    },
    {
      id: "act-b-3",
      day: 2,
      time: "09:00 AM",
      period: "Morning",
      title: "Tegallalang Rice Terraces & Jungle Swing",
      category: "Sightseeing",
      location: "Ubud, Bali",
      notes: "Iconic emerald green valley with traditional Subak irrigation system.",
      votes: 4,
      hasVoted: true,
      cost: "IDR 250,000",
    },
    {
      id: "act-b-4",
      day: 3,
      time: "03:00 AM",
      period: "Morning",
      title: "Mount Batur Sunrise Trek & Volcanic Steam Breakfast",
      category: "Adventure",
      location: "Kintamani, Bali",
      notes: "Guided night climb to catch dawn above the clouds overlooking Lake Batur.",
      votes: 3,
      hasVoted: false,
      cost: "IDR 450,000",
    },
  ],
  "trip-amalfi": [
    {
      id: "act-a-1",
      day: 1,
      time: "11:00 AM",
      period: "Morning",
      title: "Positano Cliffside Walk & Beach Espresso",
      category: "Sightseeing",
      location: "Positano, Italy",
      notes: "Wander through pastel-colored houses cascading down steep coastal cliffs.",
      votes: 2,
      hasVoted: true,
    },
    {
      id: "act-a-2",
      day: 2,
      time: "10:00 AM",
      period: "Morning",
      title: "Capri Private Gozzo Boat Charter",
      category: "Adventure",
      location: "Capri & Blue Grotto",
      notes: "Cruise around the Faraglioni rocks with swimming in secluded emerald sea caves.",
      votes: 3,
      hasVoted: true,
      cost: "€180 / person",
    },
    {
      id: "act-a-3",
      day: 3,
      time: "03:00 PM",
      period: "Afternoon",
      title: "Villa Cimbrone & Villa Rufolo Gardens",
      category: "Sightseeing",
      location: "Ravello, Italy",
      notes: "High cliffside viewpoint with marble statues overlooking the Gulf of Salerno.",
      votes: 2,
      hasVoted: false,
      cost: "€10",
    },
  ],
  "trip-swiss": [
    {
      id: "act-s-1",
      day: 1,
      time: "09:30 AM",
      period: "Morning",
      title: "Gornergrat Cogwheel Scenic Railway",
      category: "Transit",
      location: "Zermatt, Switzerland",
      notes: "Open-air cogwheel train taking us up to 3,089m with unblocked Matterhorn vistas.",
      votes: 2,
      hasVoted: true,
      cost: "CHF 110",
    },
    {
      id: "act-s-2",
      day: 2,
      time: "10:00 AM",
      period: "Morning",
      title: "Matterhorn Glacier Paradise & Ice Palace",
      category: "Adventure",
      location: "Klein Matterhorn",
      notes: "Highest cable car station in Europe with walk-through glacier ice caves.",
      votes: 2,
      hasVoted: true,
      cost: "CHF 95",
    },
    {
      id: "act-s-3",
      day: 2,
      time: "07:00 PM",
      period: "Evening",
      title: "Traditional Swiss Cheese Fondue Dinner",
      category: "Food",
      location: "Zermatt Village",
      notes: "Cozy alpine tavern with bubbling Gruyère and local Valais white wine.",
      votes: 2,
      hasVoted: false,
      cost: "CHF 45 / person",
    },
  ],
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Sightseeing: {
    bg: "bg-blue-50 border-blue-200/80",
    text: "text-blue-700",
    icon: <Compass className="w-3.5 h-3.5" />,
  },
  Food: {
    bg: "bg-amber-50 border-amber-200/80",
    text: "text-amber-800",
    icon: <Utensils className="w-3.5 h-3.5" />,
  },
  Adventure: {
    bg: "bg-emerald-50 border-emerald-200/80",
    text: "text-emerald-700",
    icon: <Mountain className="w-3.5 h-3.5" />,
  },
  Culture: {
    bg: "bg-purple-50 border-purple-200/80",
    text: "text-purple-700",
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  Stay: {
    bg: "bg-rose-50 border-rose-200/80",
    text: "text-rose-700",
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  Transit: {
    bg: "bg-zinc-100 border-zinc-200",
    text: "text-zinc-700",
    icon: <Plane className="w-3.5 h-3.5" />,
  },
};

interface TripWorkspaceProps {
  trip: TripItem;
  onBack: () => void;
  onNavigateToSearch?: (prefill?: { destination?: string; dates?: string }) => void;
  onNavigateToChat?: (tripId: string) => void;
  onCopyLink: (trip: TripItem) => void;
}

export const TripWorkspace: React.FC<TripWorkspaceProps> = ({
  trip,
  onBack,
  onNavigateToSearch,
  onNavigateToChat,
  onCopyLink,
}) => {
  // Load default activities or generate starter activities if custom trip
  const [activities, setActivities] = useState<DayActivity[]>(() => {
    if (INITIAL_ACTIVITIES[trip.id]) {
      return INITIAL_ACTIVITIES[trip.id];
    }
    // Default starter activity for newly created trips
    return [
      {
        id: `act-${Date.now()}-1`,
        day: 1,
        time: "02:00 PM",
        period: "Afternoon",
        title: `Arrival & Hotel Check-in in ${trip.destination}`,
        category: "Stay",
        location: trip.destination,
        notes: "Settle in, meet up with group companions, and explore nearby neighbourhood.",
        votes: 1,
        hasVoted: true,
      },
      {
        id: `act-${Date.now()}-2`,
        day: 1,
        time: "07:00 PM",
        period: "Evening",
        title: "Welcome Dinner & Itinerary Review",
        category: "Food",
        location: `${trip.destination} Downtown`,
        notes: "Discuss upcoming highlights, agree on wake-up times, and split transport arrangements.",
        votes: 1,
        hasVoted: true,
      },
    ];
  });

  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Activity Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newPeriod, setNewPeriod] = useState<"Morning" | "Afternoon" | "Evening">("Morning");
  const [newCategory, setNewCategory] = useState<DayActivity["category"]>("Sightseeing");
  const [newLocation, setNewLocation] = useState(trip.destination);
  const [newNotes, setNewNotes] = useState("");
  const [newDay, setNewDay] = useState<number>(1);
  const [newCost, setNewCost] = useState("");

  // Determine available day numbers (default to 3 days or max day found)
  const maxDay = Math.max(3, ...activities.map((a) => a.day));
  const availableDays = Array.from({ length: maxDay }, (_, i) => i + 1);

  // Filter activities
  const displayedActivities = activities.filter((act) =>
    selectedDay === "all" ? true : act.day === selectedDay
  );

  // Upvote activity
  const toggleVote = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== id) return act;
        const newVoted = !act.hasVoted;
        return {
          ...act,
          hasVoted: newVoted,
          votes: newVoted ? act.votes + 1 : Math.max(0, act.votes - 1),
        };
      })
    );
  };

  // Delete activity
  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  // Add new activity
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const activity: DayActivity = {
      id: `act-${Date.now()}`,
      day: newDay,
      time: newTime.trim() || "10:00 AM",
      period: newPeriod,
      title: newTitle.trim(),
      category: newCategory,
      location: newLocation.trim() || trip.destination,
      notes: newNotes.trim() || undefined,
      cost: newCost.trim() || undefined,
      votes: 1,
      hasVoted: true,
    };

    setActivities((prev) => [...prev, activity]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewNotes("");
    setNewCost("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col pb-28">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-2xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Escapes</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigateToChat && (
            <button
              type="button"
              onClick={() => onNavigateToChat(trip.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-2xs transition-all cursor-pointer group active:scale-95"
              title={`Open group chat for ${trip.destination}`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#f15a24]" />
              <span>Trip Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f15a24]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onCopyLink(trip)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-2xs transition-all cursor-pointer"
            title="Invite travel companions"
          >
            <Share2 className="w-3.5 h-3.5 text-[#f15a24]" />
            <span className="hidden sm:inline">Invite Friends</span>
          </button>

          {onNavigateToSearch && (
            <button
              type="button"
              onClick={() =>
                onNavigateToSearch({
                  destination: trip.destination,
                  dates: trip.dates,
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs transition-all cursor-pointer group active:scale-95"
              title={`Search flights and hotels for ${trip.destination}`}
            >
              <Plane className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Search Flights &amp; Stays</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-sm mb-6 bg-zinc-950 text-white">
        <div className="h-44 sm:h-56 w-full relative">
          <img
            src={trip.image}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20" />

          {/* Badge & Invite Code */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                trip.status === "Confirmed"
                  ? "bg-emerald-500/80 text-white border border-emerald-400/30"
                  : trip.status === "Planning"
                  ? "bg-amber-500/80 text-white border border-amber-400/30"
                  : "bg-blue-500/80 text-white border border-blue-400/30"
              }`}
            >
              {trip.status}
            </span>

            <span className="text-[11px] font-bold bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
              Code: {trip.inviteCode}
            </span>
          </div>

          {/* Hero Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                {trip.destination}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-zinc-200 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                  {trip.dates}
                </span>
                {trip.budget && (
                  <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-white text-[11px] font-bold">
                    {trip.budget}
                  </span>
                )}
              </div>
            </div>

            {/* Companion Avatars */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 self-start sm:self-auto">
              <Users className="w-3.5 h-3.5 text-zinc-300" />
              <div className="flex items-center -space-x-2">
                {trip.members.map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    title={m.name}
                    className="w-7 h-7 rounded-full border-2 border-zinc-900 object-cover shadow-xs"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-300 ml-1">
                {trip.members.length} companion{trip.members.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left / Main Column: Day Tabs & Timeline */}
        <div className="w-full lg:flex-1 space-y-4">
          {/* Day Filter Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-zinc-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedDay("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDay === "all"
                    ? "bg-[#963314] text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                All Days ({activities.length})
              </button>

              {availableDays.map((d) => {
                const count = activities.filter((a) => a.day === d).length;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedDay === d
                        ? "bg-[#963314] text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <span>Day {d}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          selectedDay === d
                            ? "bg-white/25 text-white"
                            : "bg-zinc-200 text-zinc-600"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Add Activity CTA Button */}
            <button
              type="button"
              onClick={() => {
                setNewDay(typeof selectedDay === "number" ? selectedDay : 1);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Activities Timeline */}
          {displayedActivities.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-zinc-300 p-8 text-center">
              <Compass className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-zinc-800">No activities scheduled yet</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                {selectedDay === "all"
                  ? "Start planning by adding your first place or activity!"
                  : `Nothing added for Day ${selectedDay}. Add a sight, cafe, or hike!`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewDay(typeof selectedDay === "number" ? selectedDay : 1);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spot to Day {selectedDay === "all" ? 1 : selectedDay}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedActivities.map((act) => {
                const categoryStyle = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.Sightseeing;
                return (
                  <motion.div
                    key={act.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Day & Time Column */}
                      <div className="flex flex-col items-start shrink-0 w-20 sm:w-24">
                        <span className="text-[11px] font-extrabold uppercase text-[#963314] tracking-wider">
                          Day {act.day}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 mt-0.5">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>{act.time}</span>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400 mt-0.5">
                          {act.period}
                        </span>
                      </div>

                      {/* Main Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${categoryStyle.bg} ${categoryStyle.text}`}
                          >
                            {categoryStyle.icon}
                            <span>{act.category}</span>
                          </span>

                          {act.cost && (
                            <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                              {act.cost}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 leading-snug">
                          {act.title}
                        </h4>

                        <div className="flex items-center gap-1 text-xs font-medium text-zinc-500 mt-1">
                          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </div>

                        {act.notes && (
                          <p className="text-xs text-zinc-600 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-100 mt-2.5 leading-relaxed font-normal">
                            💡 {act.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Upvote & Delete */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 shrink-0">
                      {/* Group Upvote Button */}
                      <button
                        type="button"
                        onClick={() => toggleVote(act.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                          act.hasVoted
                            ? "bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 border border-zinc-200/80"
                        }`}
                        title="Vote for this activity"
                      >
                        <ThumbsUp
                          className={`w-3.5 h-3.5 ${
                            act.hasVoted ? "fill-amber-500 text-amber-600" : "text-zinc-500"
                          }`}
                        />
                        <span>{act.votes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                        title="Remove activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Companions & Trip Info Card */}
        <div className="w-full lg:w-80 space-y-4 shrink-0">
          {/* Group Companions Card */}
          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-zinc-900">Trip Companions</h3>
              <span className="text-[11px] font-bold text-[#963314] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                {trip.members.length} Active
              </span>
            </div>

            <div className="space-y-2.5 mb-4">
              {trip.members.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-50/80 border border-zinc-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-2xs"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">
                        {idx === 0 ? "Trip Organizer (You)" : "Companion"}
                      </div>
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>

            {onNavigateToChat && (
              <button
                type="button"
                onClick={() => onNavigateToChat(trip.id)}
                className="w-full mb-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 group"
                title={`Open group chat for ${trip.destination}`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span>Open Trip Group Chat</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onCopyLink(trip)}
              className="w-full py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#963314] text-xs font-bold border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Companion Invite Link</span>
            </button>
          </div>

          {/* Planned Highlights Summary */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xs p-5">
              <h3 className="text-sm font-black text-zinc-900 mb-3">Group Highlights</h3>
              <div className="space-y-2">
                {trip.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs font-bold text-zinc-700 p-2 rounded-xl bg-zinc-50 border border-zinc-100"
                  >
                    <span className="text-amber-500 text-xs">✨</span>
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* ADD ACTIVITY MODAL                                                      */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-950">Add Itinerary Activity</h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    Schedule a spot or event for {trip.destination}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 stroke-2" />
                </button>
              </div>

              <form onSubmit={handleAddActivity} className="p-6 space-y-4">
                {/* Activity Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Activity / Place Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Traditional Tea House Ceremony or Sunset Kayaking"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] focus:ring-2 focus:ring-[#963314]/10 text-sm font-semibold outline-none transition-all"
                  />
                </div>

                {/* Day and Time Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Day
                    </label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none bg-white"
                    >
                      {availableDays.map((d) => (
                        <option key={d} value={d}>
                          Day {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Time
                    </label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Category and Period Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as DayActivity["category"])}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none bg-white"
                    >
                      <option value="Sightseeing">Sightseeing 🏛️</option>
                      <option value="Food">Food &amp; Dining 🍜</option>
                      <option value="Adventure">Adventure 🥾</option>
                      <option value="Culture">Culture &amp; Arts 🎎</option>
                      <option value="Stay">Hotel &amp; Stay 🏨</option>
                      <option value="Transit">Transit &amp; Flight ✈️</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Period of Day
                    </label>
                    <select
                      value={newPeriod}
                      onChange={(e) => setNewPeriod(e.target.value as "Morning" | "Afternoon" | "Evening")}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none bg-white"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>

                {/* Location and Est Cost */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Location / Address
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Central Kyoto"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Estimated Cost (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      placeholder="e.g. Free or RM 150"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Tips / Notes for Companions
                  </label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Pre-booking required. Wear comfortable walking shoes."
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 focus:border-[#963314] text-sm font-semibold outline-none resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    Add to Timeline
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
