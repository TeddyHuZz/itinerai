import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Briefcase,
  MessageCircle,
  Users,
  Compass,
  Award,
  Edit3,
  X,
  Check,
  Lock,
} from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

// ============================================================================
// Types & Interfaces
// ============================================================================
export interface TravelChop {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  date: string;
  status: "unlocked" | "locked";
  accentColor: {
    border: string;
    bg: string;
    text: string;
    fill: string;
  };
  svgType: "mountain" | "sun" | "tea" | "palace" | "temple" | "matterhorn" | "torii" | "amalfi";
  companions: string[];
  coordinates: string;
  description: string;
  highlightMemory: string;
}

export interface UserProfileData {
  name: string;
  avatar: string;
  location: string;
  job: string;
  languages: string;
  bio: string;
  tripsCount: number;
  reviewsCount: number;
  monthsActive: number;
  verified: boolean;
}

interface UserProfileViewProps {
  onBack?: () => void;
  onOpenTrip?: (tripId: string) => void;
  initialUser?: Partial<UserProfileData>;
}

// ============================================================================
// Authentic Clean Passport Chop Vector SVGs
// ============================================================================
const MountainSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 55 L42 12 L62 42" />
    <path d="M48 42 L65 18 L90 55" />
    <path d="M33 25 L42 35 L52 28" strokeDasharray="2 3" />
    <circle cx="80" cy="16" r="5" strokeWidth="1.8" />
    <line x1="5" y1="55" x2="95" y2="55" strokeWidth="2.2" />
  </svg>
);

const SunBeaconSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="50" cy="32" r="14" strokeWidth="2.5" />
    <line x1="50" y1="8" x2="50" y2="13" />
    <line x1="50" y1="51" x2="50" y2="56" />
    <line x1="26" y1="32" x2="31" y2="32" />
    <line x1="69" y1="32" x2="74" y2="32" />
    <line x1="33" y1="15" x2="37" y2="19" />
    <line x1="63" y1="45" x2="67" y2="49" />
    <line x1="33" y1="49" x2="37" y2="45" />
    <line x1="63" y1="19" x2="67" y2="15" />
    <path d="M18 58 Q50 52 82 58" strokeWidth="1.8" />
  </svg>
);

const TeaHeritageSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="34" y="20" width="32" height="34" rx="6" />
    <path d="M42 20 V14 C42 12 58 12 58 14 V20" />
    <circle cx="50" cy="36" r="4" strokeWidth="2" />
    <line x1="50" y1="20" x2="50" y2="32" strokeDasharray="2 2" />
    <path d="M22 54 C30 52 70 52 78 54" strokeWidth="2" />
  </svg>
);

const SultanPalaceSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 10 C46 16 46 22 50 25 C54 22 54 16 50 10 Z" fill="currentColor" fillOpacity="0.15" />
    <rect x="42" y="25" width="16" height="30" />
    <rect x="24" y="32" width="14" height="23" />
    <rect x="62" y="32" width="14" height="23" />
    <path d="M31 22 L31 32" />
    <path d="M69 22 L69 32" />
    <line x1="14" y1="55" x2="86" y2="55" strokeWidth="2.5" />
  </svg>
);

const BaliTempleSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Balinese Candi Bentar Split Gate */}
    <path d="M38 15 L32 20 L38 25 L30 32 L38 38 L26 55 H42 V15 Z" />
    <path d="M62 15 L68 20 L62 25 L70 32 L62 38 L74 55 H58 V15 Z" />
    <line x1="16" y1="55" x2="84" y2="55" strokeWidth="2.5" />
    <path d="M46 55 V42 H54 V55" />
  </svg>
);

const MatterhornSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 55 L48 10 L54 18 L68 32 L88 55" />
    <path d="M48 10 L44 26 L54 36 L60 55" strokeDasharray="2 3" />
    <line x1="8" y1="55" x2="92" y2="55" strokeWidth="2.2" />
    {/* Cable car line */}
    <line x1="25" y1="20" x2="80" y2="38" strokeWidth="1.2" strokeDasharray="1 2" />
    <rect x="50" y="29" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const ToriiGateSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    {/* Torii Upper Beam with Curvature */}
    <path d="M18 18 Q50 14 82 18" strokeWidth="3" />
    <line x1="24" y1="24" x2="76" y2="24" strokeWidth="2.2" />
    {/* Pillars */}
    <line x1="33" y1="18" x2="30" y2="55" strokeWidth="2.8" />
    <line x1="67" y1="18" x2="70" y2="55" strokeWidth="2.8" />
    <line x1="15" y1="55" x2="85" y2="55" strokeWidth="2.2" />
  </svg>
);

const AmalfiCoastSVG: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 65" className="w-20 h-14 mx-auto" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 55 Q35 30 60 22 T90 12" />
    <rect x="25" y="38" width="10" height="10" rx="1.5" />
    <rect x="42" y="30" width="10" height="12" rx="1.5" />
    <rect x="58" y="24" width="10" height="10" rx="1.5" />
    {/* Sea waves */}
    <path d="M12 55 Q25 51 38 55 T64 55 T90 55" strokeWidth="1.8" />
  </svg>
);

// ============================================================================
// Curated Authentic Travel Chops Dataset
// ============================================================================
const INITIAL_CHOPS: TravelChop[] = [
  {
    id: "chop-brinchang",
    name: "Brinchang",
    location: "Berincang, Malaysia",
    country: "Malaysia",
    countryCode: "MY",
    date: "September 2026",
    status: "unlocked",
    accentColor: {
      border: "border-emerald-600",
      bg: "bg-emerald-50/40 hover:bg-emerald-50/70",
      text: "text-emerald-700",
      fill: "#059669",
    },
    svgType: "mountain",
    companions: ["Sarah Chen", "David Kim"],
    coordinates: "4.4925° N, 101.3892° E",
    description: "Alpine tea sanctuary situated 1,500m high in the Cameron Highlands. Misty morning hikes and fresh strawberry groves.",
    highlightMemory: "Morning trek up Gunung Brinchang cloud forest with sunrise over the BOH tea valley.",
  },
  {
    id: "chop-melaka",
    name: "Melaka Tengah",
    location: "Malacca, Malaysia",
    country: "Malaysia",
    countryCode: "MY",
    date: "March 2026",
    status: "unlocked",
    accentColor: {
      border: "border-rose-500",
      bg: "bg-rose-50/40 hover:bg-rose-50/70",
      text: "text-rose-600",
      fill: "#e11d48",
    },
    svgType: "sun",
    companions: ["Elena Rostova", "Alex Morgan"],
    coordinates: "2.1896° N, 102.2501° E",
    description: "UNESCO World Heritage trading port known for Red Square Dutch architecture, Jonker Walk street food, and maritime history.",
    highlightMemory: "Evening river cruise past illuminated heritage bridges and sampling authentic Nyonya cendol.",
  },
  {
    id: "chop-sungai-karang",
    name: "Sungai Karang",
    location: "Kuantan, Malaysia",
    country: "Malaysia",
    countryCode: "MY",
    date: "December 2025",
    status: "unlocked",
    accentColor: {
      border: "border-amber-600",
      bg: "bg-amber-50/40 hover:bg-amber-50/70",
      text: "text-amber-700",
      fill: "#d97706",
    },
    svgType: "tea",
    companions: ["David Kim", "Sarah Chen"],
    coordinates: "3.9142° N, 103.3644° E",
    description: "Pristine East Coast beach haven renowned for breezy casuarina palms, artisanal batik crafts, and fresh seafood barbecue.",
    highlightMemory: "Seaside sunset campfire with fresh grilled sea bass and coconut water under starry skies.",
  },
  {
    id: "chop-johor-bahru",
    name: "Johor Bahru",
    location: "Johor Bahru, Malaysia",
    country: "Malaysia",
    countryCode: "MY",
    date: "September 2025",
    status: "unlocked",
    accentColor: {
      border: "border-indigo-600",
      bg: "bg-indigo-50/40 hover:bg-indigo-50/70",
      text: "text-indigo-700",
      fill: "#4f46e5",
    },
    svgType: "palace",
    companions: ["Sarah Chen", "Elena Rostova", "David Kim"],
    coordinates: "1.4927° N, 103.7414° E",
    description: "Southern cultural crossroads featuring royal Victorian architecture, Jalan Dhoby heritage cafes, and vibrant cross-border energy.",
    highlightMemory: "Exploring Tan Hiok Nee heritage street and bakery hopping for freshly baked banana cake.",
  },
  {
    id: "chop-bali",
    name: "Bali Sea Sanctuary",
    location: "Ubud & Seminyak, Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    date: "August 2026",
    status: "unlocked",
    accentColor: {
      border: "border-teal-600",
      bg: "bg-teal-50/40 hover:bg-teal-50/70",
      text: "text-teal-700",
      fill: "#0d9488",
    },
    svgType: "temple",
    companions: ["Sarah Chen", "David Kim"],
    coordinates: "8.5069° S, 115.2625° E",
    description: "Island of the Gods. Sacred waterfall trails, lush terraced rice paddies, and beachfront seafood feasts under golden sunsets.",
    highlightMemory: "Jimbaran Bay seafood grill split with companions right after Uluwatu Kecak fire dance.",
  },
  {
    id: "chop-zermatt",
    name: "Zermatt Alpine",
    location: "Valais, Switzerland",
    country: "Switzerland",
    countryCode: "CH",
    date: "Upcoming (Oct 2026)",
    status: "locked",
    accentColor: {
      border: "border-violet-400",
      bg: "bg-zinc-50 hover:bg-violet-50/30",
      text: "text-violet-600",
      fill: "#8b5cf6",
    },
    svgType: "matterhorn",
    companions: ["Sarah Chen", "Elena Rostova"],
    coordinates: "45.9765° N, 7.7491° E",
    description: "Car-free glacier paradise beneath the iconic pyramidal peak of the Matterhorn. Glacial gondolas and Swiss fondue cabins.",
    highlightMemory: "Gornergrat cogwheel train ride booked to witness sunrise over 29 alpine four-thousander peaks.",
  },
];

// ============================================================================
// Main User Profile Component
// ============================================================================
export const UserProfileView: React.FC<UserProfileViewProps> = ({
  initialUser,
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "trips" | "connections">("about");
  const [chops] = useState<TravelChop[]>(INITIAL_CHOPS);
  const [selectedChop, setSelectedChop] = useState<TravelChop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dynamically compute completed/unlocked trips
  const unlockedTrips = useMemo(
    () => chops.filter((c) => c.status === "unlocked"),
    [chops]
  );

  // User Profile State (Demo account: Alex Morgan)
  const [user, setUser] = useState<UserProfileData>({
    name: initialUser?.name || "Alex Morgan",
    avatar:
      initialUser?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
    location: initialUser?.location || "Kuala Lumpur, Malaysia",
    job: initialUser?.job || "Product Designer & Travel Enthusiast",
    languages: initialUser?.languages || "English, Chinese, and Malay",
    bio:
      initialUser?.bio ||
      "I'm Alex, I love traveling and exploring new places with friends. Always looking for hidden cafes, scenic hikes, local food markets, and cultural immersion.",
    tripsCount: initialUser?.tripsCount || INITIAL_CHOPS.filter((c) => c.status === "unlocked").length,
    reviewsCount: 12,
    monthsActive: 11,
    verified: true,
  });

  // Edit form state
  const [editForm, setEditForm] = useState<UserProfileData>(user);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(editForm);
    setIsEditModalOpen(false);
  };

  const renderChopSVG = (type: TravelChop["svgType"], color: string) => {
    switch (type) {
      case "mountain":
        return <MountainSVG color={color} />;
      case "sun":
        return <SunBeaconSVG color={color} />;
      case "tea":
        return <TeaHeritageSVG color={color} />;
      case "palace":
        return <SultanPalaceSVG color={color} />;
      case "temple":
        return <BaliTempleSVG color={color} />;
      case "matterhorn":
        return <MatterhornSVG color={color} />;
      case "torii":
        return <ToriiGateSVG color={color} />;
      case "amalfi":
        return <AmalfiCoastSVG color={color} />;
      default:
        return <MountainSVG color={color} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans pb-20">
      {/* Main Responsive Grid Layout (Airbnb Profile Inspired) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ================================================================= */}
          {/* LEFT COLUMN: Profile Sidebar Navigation & Fast Jump               */}
          {/* ================================================================= */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
                Profile
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Manage your public traveler bio, group reputation &amp; passport chops
              </p>
            </div>

            {/* Sidebar Tab Selectors */}
            <nav className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all text-left font-bold text-sm cursor-pointer ${
                  activeTab === "about"
                    ? "bg-zinc-100 text-zinc-950 ring-1 ring-zinc-300/80 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shrink-0 bg-amber-100">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="flex-1">About me</span>
                {activeTab === "about" && <div className="w-1.5 h-4 rounded-full bg-[#963314]" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("trips")}
                className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all text-left font-bold text-sm cursor-pointer ${
                  activeTab === "trips"
                    ? "bg-zinc-100 text-zinc-950 ring-1 ring-zinc-300/80 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-orange-50 text-[#963314] border border-orange-200/80 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <span className="flex-1">Past trips</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                  {unlockedTrips.length}
                </span>
                {activeTab === "trips" && <div className="w-1.5 h-4 rounded-full bg-[#963314]" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("connections")}
                className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all text-left font-bold text-sm cursor-pointer ${
                  activeTab === "connections"
                    ? "bg-zinc-100 text-zinc-950 ring-1 ring-zinc-300/80 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-50/80 text-amber-800 border border-amber-200/70 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <span className="flex-1">Connections</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                  3
                </span>
                {activeTab === "connections" && <div className="w-1.5 h-4 rounded-full bg-[#963314]" />}
              </button>
            </nav>

            {/* Authentic Passport Booklet Page & Level Progress Card */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-orange-50/80 to-amber-50/50 border border-orange-200/80 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#963314] font-extrabold text-xs tracking-wider uppercase">
                  <span>Passport Page 1 · Level 1</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#963314]">
                  {unlockedTrips.length} / 6
                </span>
              </div>

              {/* 6 Passport Stamp Visual Slots Grid */}
              <div className="grid grid-cols-6 gap-1.5 pt-1">
                {[...Array(6)].map((_, i) => {
                  const isStamped = i < unlockedTrips.length;
                  return (
                    <div
                      key={i}
                      className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                        isStamped
                          ? "bg-[#963314] text-white border-[#963314] shadow-2xs"
                          : "border-dashed border-orange-300 bg-white/60 text-orange-400"
                      }`}
                      title={isStamped ? `Stamp ${i + 1} collected` : "Slot 6 (Upcoming: Zermatt)"}
                    >
                      {isStamped ? "✓" : i + 1}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Passports have <strong>6 stamps per page</strong>. Complete your next trip to{" "}
                <strong className="text-zinc-900">Zermatt</strong> to stamp the final slot on Page 1 and unlock{" "}
                <strong className="text-[#963314]">Passport Page 2 (Level 2)</strong>!
              </p>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-orange-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#963314] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((unlockedTrips.length / 6) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                  <span>83% filled</span>
                  <span>1 trip to Level 2</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Tab Content Display                                 */}
          {/* ================================================================= */}
          <section className="lg:col-span-8 space-y-10">
            {/* TAB 1: ABOUT ME VIEW */}
            {activeTab === "about" && (
              <div className="space-y-10">
                {/* Header with Title and Edit Pill */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
                    About me
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm(user);
                      setIsEditModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-full border border-zinc-200 hover:border-zinc-400 bg-white text-xs font-bold text-zinc-800 transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Edit profile</span>
                  </button>
                </div>

                {/* Airbnb Style Profile Hero Card with Split Stats */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-xl shadow-zinc-200/50 border border-zinc-200/80 max-w-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Avatar & Identification */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white shadow-md bg-amber-100">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Verified Badge Overlay */}
                      {user.verified && (
                        <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#e11d48] text-white flex items-center justify-center shadow-md border-2 border-white" title="Identity Verified">
                          <Check className="w-4 h-4 stroke-3" />
                        </div>
                      )}
                    </div>
                    <div className="pt-1">
                      <h4 className="text-xl sm:text-2xl font-black text-zinc-950 leading-tight">
                        {user.name}
                      </h4>
                      <p className="text-xs text-zinc-500 font-medium">{user.location}</p>
                    </div>
                  </div>

                  {/* Right Stats Block inside Card */}
                  <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-100 pt-4 sm:pt-0 sm:pl-8 flex sm:flex-col justify-around gap-4 text-left">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-zinc-950 leading-none">
                        {unlockedTrips.length}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-semibold mt-0.5">Trips</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-zinc-950 leading-none">
                        {user.reviewsCount}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-semibold mt-0.5">Reviews</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-zinc-950 leading-none">
                        {user.monthsActive}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-semibold mt-0.5">Months on Itinerai</div>
                    </div>
                  </div>
                </div>

                {/* Personal Highlight Attributes */}
                <div className="space-y-3.5 text-sm text-zinc-800">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>My work: <strong className="font-semibold text-zinc-900">{user.job}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>Speaks <strong className="font-semibold text-zinc-900">{user.languages}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="underline underline-offset-4 decoration-zinc-300 font-semibold text-zinc-900">
                      Identity verified
                    </span>
                  </div>
                </div>

                {/* Bio Description */}
                <div className="space-y-2 max-w-2xl">
                  <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                    {user.bio}
                  </p>
                </div>

                <hr className="border-zinc-200/80" />

                {/* ============================================================= */}
                {/* "WHERE I'VE BEEN" - CHOP ACHIEVEMENT COLLECTION              */}
                {/* ============================================================= */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
                        Where I&apos;ve been
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Collectible travel chops earned after each completed journey
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#963314] bg-orange-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span>Passport Page 1</span>
                      <span className="text-zinc-300">•</span>
                      <span>{unlockedTrips.length} of 6 Stamped</span>
                    </span>
                  </div>

                  {/* Grid of Authentic Retro Chop Stamp Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {chops.map((chop) => {
                      const isLocked = chop.status === "locked";
                      return (
                        <motion.button
                          key={chop.id}
                          type="button"
                          whileHover={{ y: -3, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedChop(chop)}
                          className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-48 group shadow-2xs hover:shadow-md ${
                            chop.accentColor.border
                          } ${chop.accentColor.bg} ${
                            isLocked ? "opacity-60 border-dashed" : ""
                          }`}
                        >
                          {/* Top Header: City Name */}
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`text-sm font-black tracking-tight truncate ${chop.accentColor.text}`}
                            >
                              {chop.name}
                            </span>
                            {isLocked && <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                          </div>

                          {/* Center Landmark Graphic */}
                          <div className="py-2 flex items-center justify-center">
                            {renderChopSVG(chop.svgType, chop.accentColor.fill)}
                          </div>

                          {/* Bottom Row: Country Code & Seal */}
                          <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold">
                            <span className="text-zinc-500 uppercase">{chop.countryCode}</span>
                            <div className="w-3.5 h-3.5 rounded-full border border-current opacity-40 flex items-center justify-center text-[7px]">
                              ✦
                            </div>
                          </div>

                          {/* Subtitle Details directly below inside the card border */}
                          <div className="pt-2 border-t border-black/5 mt-1">
                            <p className="text-[11px] font-bold text-zinc-800 truncate">
                              {chop.location}
                            </p>
                            <p className="text-[10px] text-zinc-400 font-medium truncate">
                              {chop.date}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PAST TRIPS VIEW */}
            {activeTab === "trips" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-zinc-950">Past Trips Completed</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Journeys you have explored with friends on Itinerai
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {unlockedTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#963314] uppercase tracking-wider">
                            {trip.country}
                          </span>
                          <span className="text-xs text-zinc-400 font-medium">{trip.date}</span>
                        </div>
                        <h4 className="text-lg font-black text-zinc-950">{trip.location}</h4>
                        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                          {trip.description}
                        </p>
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Users className="w-3.5 h-3.5" />
                            <span>{trip.companions.join(", ")}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedChop(trip)}
                            className="text-xs font-bold text-[#963314] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <span>View Chop</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: CONNECTIONS VIEW */}
            {activeTab === "connections" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-zinc-950">Travel Connections</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Friends and companions you frequently travel and split bills with
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Sarah Chen",
                      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                      role: "Co-Planner",
                      trips: 4,
                    },
                    {
                      name: "David Kim",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                      role: "Budget Lead",
                      trips: 3,
                    },
                    {
                      name: "Elena Rostova",
                      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
                      role: "Foodie Guide",
                      trips: 2,
                    },
                  ].map((connection, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs text-center space-y-3"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-zinc-100 shadow-2xs">
                        <img src={connection.avatar} alt={connection.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-zinc-900">{connection.name}</h4>
                        <p className="text-[11px] text-zinc-500">{connection.role}</p>
                      </div>
                      <div className="pt-2 border-t border-zinc-100 text-xs font-bold text-[#963314]">
                        {connection.trips} Shared Journeys
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* MODAL 1: INTERACTIVE PASSPORT CHOP INSPECTION MODAL                   */}
      {/* ===================================================================== */}
      <ChopDetailModal
        isOpen={Boolean(selectedChop)}
        onClose={() => setSelectedChop(null)}
        chop={selectedChop}
      />

      {/* ===================================================================== */}
      {/* MODAL 2: EDIT PROFILE MODAL                                           */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div
            onClick={() => setIsEditModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-zinc-200 cursor-default"
            >
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-zinc-900">Edit Traveler Profile</h3>
                  <p className="text-xs text-zinc-500">Update your public traveler card</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs font-bold text-zinc-700">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#963314] font-medium text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Home Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#963314] font-medium text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">My Work</label>
                  <input
                    type="text"
                    value={editForm.job}
                    onChange={(e) => setEditForm({ ...editForm, job: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#963314] font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    value={editForm.languages}
                    onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#963314] font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1">About Me Bio</label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#963314] font-medium text-sm resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Save Changes
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

// ============================================================================
// Modal: Chop Detail Passport Visa Inspection
// ============================================================================
interface ChopDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chop: TravelChop | null;
}

const renderModalChopSVG = (type: TravelChop["svgType"], color: string) => {
  switch (type) {
    case "mountain":
      return <MountainSVG color={color} />;
    case "sun":
      return <SunBeaconSVG color={color} />;
    case "tea":
      return <TeaHeritageSVG color={color} />;
    case "palace":
      return <SultanPalaceSVG color={color} />;
    case "temple":
      return <BaliTempleSVG color={color} />;
    case "matterhorn":
      return <MatterhornSVG color={color} />;
    case "torii":
      return <ToriiGateSVG color={color} />;
    case "amalfi":
      return <AmalfiCoastSVG color={color} />;
    default:
      return <MountainSVG color={color} />;
  }
};

const ChopDetailModal: React.FC<ChopDetailModalProps> = ({ isOpen, onClose, chop }) => {
  useBodyScrollLock(isOpen, onClose);

  if (!isOpen || !chop) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-zinc-200 cursor-default"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#963314] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900">Official Travel Stamp</h3>
                <p className="text-[10px] font-mono text-zinc-400">PASSPORT MEMORY RECORD</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stamp Graphic Showcase */}
          <div className="p-6 text-center space-y-4 bg-radial from-amber-50/50 via-white to-white">
            <div
              className={`p-6 rounded-3xl border-3 mx-auto w-44 h-36 flex flex-col items-center justify-between shadow-sm ${
                chop.accentColor.border
              } ${chop.accentColor.bg}`}
            >
              <span className={`text-base font-black tracking-tight ${chop.accentColor.text}`}>
                {chop.name}
              </span>
              <div className="w-16 h-10 flex items-center justify-center">
                {/* Dynamic SVG vector */}
                <div className="scale-125">
                  {renderModalChopSVG(chop.svgType, chop.accentColor.fill)}
                </div>
              </div>
              <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold text-zinc-500">
                <span>{chop.countryCode}</span>
                <span>✦</span>
                <span>{chop.date.split(" ")[0]}</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-black text-zinc-950">{chop.location}</h4>
              <p className="text-xs text-zinc-500 mt-0.5">{chop.date} • Verified Visit</p>
            </div>
          </div>

          {/* Stamp Certificate Details */}
          <div className="px-6 pb-6 space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span>Coordinates</span>
                <span className="font-mono font-bold text-zinc-800">{chop.coordinates}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500">
                <span>Travel Party</span>
                <span className="font-bold text-zinc-800">{chop.companions.join(", ")}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-1">
              <span className="text-[10px] font-bold text-[#963314] uppercase tracking-wider">
                Trip Memory Highlight
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                &ldquo;{chop.highlightMemory}&rdquo;
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
