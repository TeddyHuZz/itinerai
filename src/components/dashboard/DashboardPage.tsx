import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Search,
  Plane,
  CalendarDays,
  Wallet,
  Smartphone,
  Star,
  ExternalLink,
  LogOut,
  Check,
  Filter,
  ArrowUpDown,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  MessageSquare,
} from "lucide-react";
import { DateRangePickerModal } from "./DateRangePickerModal";
import { ItineraryView, INITIAL_TRIPS } from "../itinerary/ItineraryView";
import { TripChatView } from "../chat/TripChatView";
import { ExpensesView } from "../expenses/ExpensesView";
import { UserProfileView } from "../profile/UserProfileView";

interface DashboardPageProps {
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
  };
}

export type FlightSortType = "recommended" | "cheapest" | "fastest" | "earliest" | "stops";
export type HotelSortType = "recommended" | "cheapest" | "rating" | "reviews" | "expensive";

const FLIGHT_SORT_LABELS: Record<FlightSortType, string> = {
  recommended: "Recommended",
  cheapest: "Cheapest First",
  fastest: "Fastest Duration",
  earliest: "Earliest Departure",
  stops: "Non-stop First",
};

const HOTEL_SORT_LABELS: Record<HotelSortType, string> = {
  recommended: "Recommended",
  cheapest: "Cheapest First",
  rating: "Highest Rated",
  reviews: "Most Reviewed",
  expensive: "Highest Price",
};

interface FlightItem {
  id: string;
  airline: string;
  airlineCode: string;
  logoBg: string;
  stops: "Non-stop" | "1 Stop" | "2 Stops";
  stopsCount: number;
  duration: string;
  durationMinutes: number;
  price: string;
  priceValue: number;
  depTime: string;
  depMinutes: number;
  depCode: string;
  arrTime: string;
  arrCode: string;
  platform: string;
  platformColor: string;
  recommendedScore: number;
  badge?: string;
  badgeColor?: string;
}

interface HotelItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: string;
  priceValue: number;
  totalPrice: string;
  platform: "Airbnb" | "Trivago" | "Booking.com" | "Agoda";
  platformBadgeColor: string;
  roomType: string;
  image: string;
  recommendedScore: number;
  badge?: string;
}

const ALL_FLIGHTS: FlightItem[] = [
  {
    id: "fl-1",
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    logoBg: "bg-[#0b1f44] text-[#d4af37]",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "4h 00m",
    durationMinutes: 240,
    price: "RM 250",
    priceValue: 250,
    depTime: "10:00",
    depMinutes: 600,
    depCode: "KUL",
    arrTime: "14:00",
    arrCode: "SIN",
    platform: "Amadeus",
    platformColor: "bg-[#f15a24] hover:bg-[#e04812]",
    recommendedScore: 98,
    badge: "Top Carrier",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "fl-2",
    airline: "AirAsia",
    airlineCode: "AK",
    logoBg: "bg-[#ed1c24] text-white",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "4h 15m",
    durationMinutes: 255,
    price: "RM 185",
    priceValue: 185,
    depTime: "13:45",
    depMinutes: 825,
    depCode: "KUL",
    arrTime: "18:00",
    arrCode: "SIN",
    platform: "Amadeus",
    platformColor: "bg-[#f15a24] hover:bg-[#e04812]",
    recommendedScore: 94,
    badge: "Popular Deal",
    badgeColor: "bg-rose-100 text-rose-800",
  },
  {
    id: "fl-3",
    airline: "Malaysia Airlines",
    airlineCode: "MH",
    logoBg: "bg-[#002f6c] text-white",
    stops: "1 Stop",
    stopsCount: 1,
    duration: "6h 30m",
    durationMinutes: 390,
    price: "RM 320",
    priceValue: 320,
    depTime: "08:00",
    depMinutes: 480,
    depCode: "KUL",
    arrTime: "14:30",
    arrCode: "SIN",
    platform: "Amadeus",
    platformColor: "bg-[#f15a24] hover:bg-[#e04812]",
    recommendedScore: 78,
  },
  {
    id: "fl-4",
    airline: "Scoot",
    airlineCode: "TR",
    logoBg: "bg-[#ffd100] text-black",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "4h 05m",
    durationMinutes: 245,
    price: "RM 155",
    priceValue: 155,
    depTime: "16:15",
    depMinutes: 975,
    depCode: "KUL",
    arrTime: "20:20",
    arrCode: "SIN",
    platform: "Skyscanner",
    platformColor: "bg-[#00a698] hover:bg-[#008f82]",
    recommendedScore: 96,
    badge: "Cheapest",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "fl-5",
    airline: "Batik Air Malaysia",
    airlineCode: "OD",
    logoBg: "bg-[#800020] text-white",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "4h 10m",
    durationMinutes: 250,
    price: "RM 210",
    priceValue: 210,
    depTime: "11:30",
    depMinutes: 690,
    depCode: "KUL",
    arrTime: "15:40",
    arrCode: "SIN",
    platform: "Skyscanner",
    platformColor: "bg-[#00a698] hover:bg-[#008f82]",
    recommendedScore: 88,
  },
  {
    id: "fl-6",
    airline: "Jetstar Asia",
    airlineCode: "3K",
    logoBg: "bg-[#ff5500] text-white",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "4h 20m",
    durationMinutes: 260,
    price: "RM 170",
    priceValue: 170,
    depTime: "06:45",
    depMinutes: 405,
    depCode: "KUL",
    arrTime: "11:05",
    arrCode: "SIN",
    platform: "Amadeus",
    platformColor: "bg-[#f15a24] hover:bg-[#e04812]",
    recommendedScore: 91,
    badge: "Early Bird",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "fl-7",
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    logoBg: "bg-[#0b1f44] text-[#d4af37]",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "3h 50m",
    durationMinutes: 230,
    price: "RM 280",
    priceValue: 280,
    depTime: "19:00",
    depMinutes: 1140,
    depCode: "KUL",
    arrTime: "22:50",
    arrCode: "SIN",
    platform: "Expedia",
    platformColor: "bg-[#00355f] hover:bg-[#002444]",
    recommendedScore: 92,
    badge: "Fastest",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  {
    id: "fl-8",
    airline: "Malaysia Airlines",
    airlineCode: "MH",
    logoBg: "bg-[#002f6c] text-white",
    stops: "Non-stop",
    stopsCount: 0,
    duration: "4h 10m",
    durationMinutes: 250,
    price: "RM 295",
    priceValue: 295,
    depTime: "14:20",
    depMinutes: 860,
    depCode: "KUL",
    arrTime: "18:30",
    arrCode: "SIN",
    platform: "Amadeus",
    platformColor: "bg-[#f15a24] hover:bg-[#e04812]",
    recommendedScore: 86,
  },
];

const ALL_HOTELS: HotelItem[] = [
  {
    id: "ht-1",
    name: "Marina View Skyline Loft",
    location: "Marina Bay, Singapore",
    rating: 4.95,
    reviewsCount: 168,
    pricePerNight: "RM 380",
    priceValue: 380,
    totalPrice: "RM 2,280 (6 nights)",
    platform: "Airbnb",
    platformBadgeColor: "bg-[#ff385c] text-white",
    roomType: "Entire Serviced Apartment · 2 Beds",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 99,
    badge: "Guest Favorite",
  },
  {
    id: "ht-2",
    name: "The Clan Hotel Heritage Suite",
    location: "Telok Ayer, Singapore",
    rating: 4.88,
    reviewsCount: 420,
    pricePerNight: "RM 420",
    priceValue: 420,
    totalPrice: "RM 2,520 (6 nights)",
    platform: "Trivago",
    platformBadgeColor: "bg-[#007fad] text-white",
    roomType: "Deluxe King Room · Breakfast Included",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 95,
    badge: "Luxury Stay",
  },
  {
    id: "ht-3",
    name: "Heritage Shophouse Boutique Hotel",
    location: "Chinatown, Singapore",
    rating: 4.76,
    reviewsCount: 235,
    pricePerNight: "RM 190",
    priceValue: 190,
    totalPrice: "RM 1,140 (6 nights)",
    platform: "Airbnb",
    platformBadgeColor: "bg-[#ff385c] text-white",
    roomType: "Historic Loft Room · Free High-speed WiFi",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 92,
    badge: "Best Value",
  },
  {
    id: "ht-4",
    name: "Oasia Hotel Downtown Oasis",
    location: "Tanjong Pagar, Singapore",
    rating: 4.83,
    reviewsCount: 560,
    pricePerNight: "RM 350",
    priceValue: 350,
    totalPrice: "RM 2,100 (6 nights)",
    platform: "Trivago",
    platformBadgeColor: "bg-[#007fad] text-white",
    roomType: "Club Suite · Skyline Pool Access",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 90,
  },
  {
    id: "ht-5",
    name: "Chinatown Capsule Pods & Co-living",
    location: "Chinatown, Singapore",
    rating: 4.62,
    reviewsCount: 680,
    pricePerNight: "RM 135",
    priceValue: 135,
    totalPrice: "RM 810 (6 nights)",
    platform: "Agoda",
    platformBadgeColor: "bg-[#2080ff] text-white",
    roomType: "Single Premium Capsule · Co-working Area",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 86,
    badge: "Cheapest",
  },
  {
    id: "ht-6",
    name: "Riverside Quay Designer Apartment",
    location: "Clarke Quay, Singapore",
    rating: 4.89,
    reviewsCount: 195,
    pricePerNight: "RM 280",
    priceValue: 280,
    totalPrice: "RM 1,680 (6 nights)",
    platform: "Airbnb",
    platformBadgeColor: "bg-[#ff385c] text-white",
    roomType: "Entire 2-Bedroom Condo · River Balcony",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 94,
  },
  {
    id: "ht-7",
    name: "Pan Pacific Orchard Sky Terrace",
    location: "Orchard Road, Singapore",
    rating: 4.93,
    reviewsCount: 710,
    pricePerNight: "RM 540",
    priceValue: 540,
    totalPrice: "RM 3,240 (6 nights)",
    platform: "Booking.com",
    platformBadgeColor: "bg-[#003580] text-white",
    roomType: "Premier King · Forest Terrace View",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 96,
    badge: "5-Star Luxury",
  },
  {
    id: "ht-8",
    name: "Garden Pod at Gardens by the Bay",
    location: "Marina South, Singapore",
    rating: 4.87,
    reviewsCount: 110,
    pricePerNight: "RM 310",
    priceValue: 310,
    totalPrice: "RM 1,860 (6 nights)",
    platform: "Trivago",
    platformBadgeColor: "bg-[#007fad] text-white",
    roomType: "Eco Suite · Garden Views & Direct Park Entry",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
    recommendedScore: 91,
  },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onLogout,
  user = { name: "Alex Morgan", email: "alex@travel.com" },
}) => {
  const [destination, setDestination] = useState("Singapore (SIN)");
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 9, 12));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 9, 18));
  const [dates, setDates] = useState("Oct 12 - 18 (6 nights)");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"flights" | "hotels">("flights");
  const [currentNav, setCurrentNav] = useState<"search" | "itinerary" | "team" | "expenses" | "profile">("search");
  const [activeChatTripId, setActiveChatTripId] = useState<string>("trip-bali");
  const [isSearching, setIsSearching] = useState(false);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  // Sorting States
  const [flightSort, setFlightSort] = useState<FlightSortType>("recommended");
  const [hotelSort, setHotelSort] = useState<HotelSortType>("recommended");

  // View Modes: "list" (1 per line with large details) vs "grid" (2x2 / multi-col)
  const [flightViewMode, setFlightViewMode] = useState<"list" | "grid">("list");
  const [hotelViewMode, setHotelViewMode] = useState<"grid" | "list">("grid");

  // Quick Filter States
  const [flightFilter, setFlightFilter] = useState<"all" | "nonstop" | "under200" | "morning">("all");
  const [hotelFilter, setHotelFilter] = useState<"all" | "airbnb" | "trivago" | "toprated" | "under300">("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 350);
  };

  const handleBook = (title: string, platform: string) => {
    setBookingNotice(`Opening ${platform} to lock in best group deal for "${title}"...`);
    setTimeout(() => setBookingNotice(null), 3000);
  };

  // Filtered and Sorted Flights
  const processedFlights = useMemo(() => {
    let result = [...ALL_FLIGHTS];

    // Filter
    if (flightFilter === "nonstop") {
      result = result.filter((f) => f.stopsCount === 0);
    } else if (flightFilter === "under200") {
      result = result.filter((f) => f.priceValue <= 200);
    } else if (flightFilter === "morning") {
      result = result.filter((f) => f.depMinutes < 720); // before 12:00 PM
    }

    // Sort
    result.sort((a, b) => {
      switch (flightSort) {
        case "cheapest":
          return a.priceValue - b.priceValue;
        case "fastest":
          return a.durationMinutes - b.durationMinutes;
        case "earliest":
          return a.depMinutes - b.depMinutes;
        case "stops":
          return a.stopsCount - b.stopsCount;
        case "recommended":
        default:
          return b.recommendedScore - a.recommendedScore;
      }
    });

    return result;
  }, [flightSort, flightFilter]);

  // Filtered and Sorted Hotels
  const processedHotels = useMemo(() => {
    let result = [...ALL_HOTELS];

    // Filter
    if (hotelFilter === "airbnb") {
      result = result.filter((h) => h.platform === "Airbnb");
    } else if (hotelFilter === "trivago") {
      result = result.filter((h) => h.platform === "Trivago");
    } else if (hotelFilter === "toprated") {
      result = result.filter((h) => h.rating >= 4.85);
    } else if (hotelFilter === "under300") {
      result = result.filter((h) => h.priceValue <= 300);
    }

    // Sort
    result.sort((a, b) => {
      switch (hotelSort) {
        case "cheapest":
          return a.priceValue - b.priceValue;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewsCount - a.reviewsCount;
        case "expensive":
          return b.priceValue - a.priceValue;
        case "recommended":
        default:
          return b.recommendedScore - a.recommendedScore;
      }
    });

    return result;
  }, [hotelSort, hotelFilter]);

  return (
    <div
      className={`bg-[#f8f9fa] text-zinc-900 font-sans selection:bg-[#963314]/20 selection:text-[#963314] flex flex-col ${
        currentNav === "team" ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* ======================================================================= */}
      {/* 1. TOP HEADER (Responsive on all screens)                               */}
      {/* ======================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 py-3 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setCurrentNav("profile")}
              className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all cursor-pointer relative group ${
                currentNav === "profile"
                  ? "ring-[#963314] ring-offset-2 scale-105 shadow-sm"
                  : "ring-[#963314]/30 hover:ring-[#963314] hover:scale-105"
              } shrink-0 bg-amber-100`}
              title="Click to view Alex Morgan's profile & passport chops"
              aria-label="View user profile and achievements"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </button>

            <button
              type="button"
              onClick={() => setCurrentNav("search")}
              className="text-left cursor-pointer group"
            >
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#963314] select-none leading-none group-hover:opacity-90 transition-opacity">
                Itenerai
              </h1>
              <span className="hidden sm:block text-[11px] text-zinc-500 font-medium mt-0.5">
                Trip Hub
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/60">
            <button
              onClick={() => setCurrentNav("search")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentNav === "search"
                  ? "bg-white text-[#963314] shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            <button
              onClick={() => setCurrentNav("itinerary")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentNav === "itinerary"
                  ? "bg-white text-[#963314] shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Itinerary</span>
            </button>

            <button
              onClick={() => setCurrentNav("team")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentNav === "team"
                  ? "bg-white text-[#963314] shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f15a24]" />
            </button>

            <button
              onClick={() => setCurrentNav("expenses")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentNav === "expenses"
                  ? "bg-white text-[#963314] shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Expenses</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Booking Toast Alert */}
      <AnimatePresence>
        {bookingNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] p-3.5 rounded-2xl bg-zinc-950 text-white text-xs flex items-center justify-between shadow-2xl border border-zinc-800"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#f15a24] shrink-0" />
              <span className="font-medium leading-tight">{bookingNotice}</span>
            </div>
            <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* 2. MAIN DYNAMIC VIEW: PROFILE, ITINERARY, TEAM, EXPENSES, OR SEARCH HUB */}
      {/* ======================================================================= */}
      {currentNav === "profile" ? (
        <UserProfileView
          onBack={() => setCurrentNav("search")}
          onOpenTrip={(tripId) => {
            setActiveChatTripId(tripId);
            setCurrentNav("itinerary");
          }}
          initialUser={{
            name: user.name,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
            location: "Kuala Lumpur, Malaysia",
            job: "Product Designer & Travel Enthusiast",
            languages: "English, Chinese, and Malay",
            bio: "I'm Alex, I love traveling and exploring new places with friends. Always looking for hidden cafes, scenic hikes, local food markets, and cultural immersion.",
          }}
        />
      ) : currentNav === "itinerary" ? (
        <ItineraryView
          onNavigateToSearch={(prefill) => {
            if (prefill?.destination) {
              setDestination(prefill.destination);
            }
            if (prefill?.dates) {
              setDates(prefill.dates);
            }
            setCurrentNav("search");
          }}
          onNavigateToChat={(tripId) => {
            setActiveChatTripId(tripId);
            setCurrentNav("team");
          }}
        />
      ) : currentNav === "team" ? (
        <TripChatView
          trips={INITIAL_TRIPS}
          activeTripId={activeChatTripId}
          onSelectTrip={(trip) => setActiveChatTripId(trip.id)}
          onOpenItinerary={() => setCurrentNav("itinerary")}
          onCopyLink={(trip) => {
            navigator.clipboard.writeText(`https://itinerai.com/trip/${trip.id}?join=${trip.inviteCode}`).catch(() => {});
            setBookingNotice(`Invite link for ${trip.destination} copied to clipboard!`);
            setTimeout(() => setBookingNotice(null), 3000);
          }}
        />
      ) : currentNav === "expenses" ? (
        <ExpensesView
          trips={INITIAL_TRIPS}
          activeTripId={activeChatTripId}
          onSelectTrip={(trip) => setActiveChatTripId(trip.id)}
          onOpenItinerary={() => setCurrentNav("itinerary")}
        />
      ) : (
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex-1 flex flex-col pb-24 md:pb-12">
        {/* Search Bar */}
        <div className="w-full mb-6">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-2.5 shadow-sm border border-zinc-200/90 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 md:divide-x md:divide-zinc-200"
          >
            {/* Field 1: Destination */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 text-left">
              <MapPin className="w-5 h-5 text-zinc-500 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to? (e.g. Singapore, Tokyo)"
                  className="w-full text-sm font-bold text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Field 2: Dates (Interactive Calendar Picker Trigger) */}
            <div
              onClick={() => setIsCalendarOpen(true)}
              className="flex-1 flex items-center gap-3 px-3 py-2 text-left cursor-pointer hover:bg-zinc-50/80 rounded-xl transition-colors group select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-100 group-hover:bg-[#963314]/10 text-zinc-500 group-hover:text-[#963314] flex items-center justify-center shrink-0 transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="w-full flex-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider pointer-events-none">
                    Travel Dates &amp; Duration
                  </label>
                </div>
                <div className="text-sm font-bold text-zinc-900 group-hover:text-[#963314] transition-colors truncate">
                  {dates || "Select travel dates"}
                </div>
              </div>
            </div>

            {/* Field 3: Search Action Button */}
            <div className="p-1 sm:pl-2">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full md:w-auto py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-[#963314] hover:bg-[#802a0f] text-white font-bold text-sm shadow-md shadow-[#963314]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-75"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Category Switcher (Flights | Hotels) + Interactive Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-3 mb-4">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setActiveCategory("flights")}
              className={`pb-1 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
                activeCategory === "flights"
                  ? "text-[#963314]"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span>Flights</span>
              {activeCategory === "flights" && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#963314] rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("hotels")}
              className={`pb-1 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
                activeCategory === "hotels"
                  ? "text-[#963314]"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span>Hotels</span>
              {activeCategory === "hotels" && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#963314] rounded-full"
                />
              )}
            </button>
          </div>

          {/* Interactive Sorting Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-zinc-500 font-medium">
              {activeCategory === "flights"
                ? `${processedFlights.length} flights found`
                : `${processedHotels.length} stays found`}
            </span>

            {/* Sort Selector Dropdown - Entire pill is clickable */}
            <label className="relative flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-zinc-200/90 shadow-2xs cursor-pointer hover:border-zinc-300 transition-colors select-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
              <span className="text-xs text-zinc-500 font-semibold pointer-events-none">Sort:</span>
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1 pointer-events-none">
                {activeCategory === "flights"
                  ? FLIGHT_SORT_LABELS[flightSort]
                  : HOTEL_SORT_LABELS[hotelSort]}
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 pointer-events-none" />
              </span>
              <select
                value={activeCategory === "flights" ? flightSort : hotelSort}
                onChange={(e) => {
                  if (activeCategory === "flights") {
                    setFlightSort(e.target.value as FlightSortType);
                  } else {
                    setHotelSort(e.target.value as HotelSortType);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {activeCategory === "flights" ? (
                  <>
                    <option value="recommended">Recommended</option>
                    <option value="cheapest">Cheapest First</option>
                    <option value="fastest">Fastest Duration</option>
                    <option value="earliest">Earliest Departure</option>
                    <option value="stops">Non-stop First</option>
                  </>
                ) : (
                  <>
                    <option value="recommended">Recommended</option>
                    <option value="cheapest">Cheapest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="expensive">Highest Price</option>
                  </>
                )}
              </select>
            </label>

            {/* View Mode Switcher: Desktop/Tablet only */}
            <div className="hidden md:flex items-center bg-white p-1 rounded-xl border border-zinc-200/90 shadow-2xs">
              <button
                type="button"
                title="1 per line (Bigger, more visible details)"
                onClick={() => {
                  if (activeCategory === "flights") setFlightViewMode("list");
                  else setHotelViewMode("list");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  (activeCategory === "flights" ? flightViewMode === "list" : hotelViewMode === "list")
                    ? "bg-[#963314] text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="text-[11px]">Line</span>
              </button>
              <button
                type="button"
                title="Grid View"
                onClick={() => {
                  if (activeCategory === "flights") setFlightViewMode("grid");
                  else setHotelViewMode("grid");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  (activeCategory === "flights" ? flightViewMode === "grid" : hotelViewMode === "grid")
                    ? "bg-[#963314] text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px]">
                  {activeCategory === "flights" ? "Grid" : "Grid View"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 text-xs">
          <span className="text-zinc-400 flex items-center gap-1 font-semibold pl-1">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filters:</span>
          </span>

          {activeCategory === "flights" ? (
            <>
              <button
                onClick={() => setFlightFilter("all")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  flightFilter === "all"
                    ? "bg-zinc-900 text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                All Flights ({ALL_FLIGHTS.length})
              </button>
              <button
                onClick={() => setFlightFilter("nonstop")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  flightFilter === "nonstop"
                    ? "bg-[#963314] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Non-stop Only
              </button>
              <button
                onClick={() => setFlightFilter("under200")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  flightFilter === "under200"
                    ? "bg-[#963314] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Under RM 200
              </button>
              <button
                onClick={() => setFlightFilter("morning")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  flightFilter === "morning"
                    ? "bg-[#963314] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Morning Flights (Before 12PM)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setHotelFilter("all")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hotelFilter === "all"
                    ? "bg-zinc-900 text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                All Stays ({ALL_HOTELS.length})
              </button>
              <button
                onClick={() => setHotelFilter("airbnb")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hotelFilter === "airbnb"
                    ? "bg-[#ff385c] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Airbnb Only
              </button>
              <button
                onClick={() => setHotelFilter("trivago")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hotelFilter === "trivago"
                    ? "bg-[#007fad] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Trivago Only
              </button>
              <button
                onClick={() => setHotelFilter("toprated")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hotelFilter === "toprated"
                    ? "bg-[#963314] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                ★ 4.85+ Top Rated
              </button>
              <button
                onClick={() => setHotelFilter("under300")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  hotelFilter === "under300"
                    ? "bg-[#963314] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Under RM 300 / night
              </button>
            </>
          )}
        </div>

        {/* ======================================================================= */}
        {/* 3. AGGREGATED FEED: FLIGHTS                                             */}
        {/* ======================================================================= */}
        {activeCategory === "flights" && (
          <>
            {/* Mobile View: Standardized clean card feed */}
            <div className="md:hidden space-y-4">
              {processedFlights.map((flight) => (
                <div
                  key={`mobile-${flight.id}`}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-zinc-200/90 text-left transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${flight.logoBg} font-black text-xs flex items-center justify-center shadow-xs border border-zinc-200 shrink-0`}
                      >
                        {flight.airlineCode}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                            {flight.airline}
                          </h3>
                          {flight.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                flight.badgeColor || "bg-zinc-100 text-zinc-700"
                              }`}
                            >
                              {flight.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                          {flight.stops} · {flight.duration}
                        </div>
                      </div>
                    </div>

                    <div className="text-base font-black text-[#963314]">
                      {flight.price}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 mb-5">
                    <div className="text-left">
                      <div className="text-base font-extrabold text-zinc-900 leading-none">
                        {flight.depTime}
                      </div>
                      <div className="text-xs text-zinc-500 font-semibold mt-1">
                        {flight.depCode}
                      </div>
                    </div>

                    <div className="flex-1 mx-4 sm:mx-6 flex items-center justify-center relative">
                      <div className="w-full border-t border-dashed border-zinc-300" />
                      <div className="absolute bg-white px-2 text-zinc-400">
                        <Plane className="w-4 h-4 rotate-90 text-[#963314]" />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-zinc-900 leading-none">
                        {flight.arrTime}
                      </div>
                      <div className="text-xs text-zinc-500 font-semibold mt-1">
                        {flight.arrCode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <span className="text-xs text-zinc-400 font-medium">
                      Aggregated live rate
                    </span>
                    <button
                      type="button"
                      onClick={() => handleBook(flight.airline, flight.platform)}
                      className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 ${flight.platformColor}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Book on {flight.platform}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet View: Toggleable between Line and Grid */}
            <div className="hidden md:block">
              {flightViewMode === "list" ? (
                /* 1 per line view (Spacious, prominent details like boarding pass) */
                <div className="space-y-4">
                  {processedFlights.map((flight) => (
                    <div
                      key={flight.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-zinc-200/90 text-left transition-all hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                    >
                      {/* Left: Airline Logo + Name + Badges */}
                      <div className="flex items-center gap-4 lg:w-64 shrink-0">
                        <div
                          className={`w-12 h-12 rounded-2xl ${flight.logoBg} font-black text-sm flex items-center justify-center shadow-xs border border-zinc-200 shrink-0`}
                        >
                          {flight.airlineCode}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug">
                              {flight.airline}
                            </h3>
                            {flight.badge && (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  flight.badgeColor || "bg-zinc-100 text-zinc-700"
                                }`}
                              >
                                {flight.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 font-medium mt-1 flex items-center gap-2">
                            <span className="font-semibold text-zinc-700">{flight.stops}</span>
                            <span>•</span>
                            <span>{flight.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Large Timeline */}
                      <div className="flex-1 flex items-center justify-center gap-4 sm:gap-8 px-2 max-w-xl mx-auto w-full">
                        <div className="text-left">
                          <div className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-none">
                            {flight.depTime}
                          </div>
                          <div className="text-xs font-bold text-zinc-500 mt-1">
                            {flight.depCode} · Kuala Lumpur
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center max-w-xs">
                          <span className="text-[11px] font-bold text-zinc-600 mb-1">
                            {flight.duration} · {flight.stops}
                          </span>
                          <div className="w-full flex items-center justify-center relative">
                            <div className="w-full border-t-2 border-dashed border-zinc-300" />
                            <div className="absolute bg-white px-2 text-zinc-400">
                              <Plane className="w-4 h-4 rotate-90 text-[#963314]" />
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-medium mt-1">
                            Aggregated via {flight.platform}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-none">
                            {flight.arrTime}
                          </div>
                          <div className="text-xs font-bold text-zinc-500 mt-1">
                            {flight.arrCode} · Singapore
                          </div>
                        </div>
                      </div>

                      {/* Right: Price Ticket Stub & Action */}
                      <div className="flex items-center lg:flex-col lg:items-end justify-between lg:justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-zinc-100 lg:pl-6 lg:w-52 shrink-0 gap-3">
                        <div className="text-left lg:text-right">
                          <div className="text-2xl sm:text-3xl font-black text-[#963314] leading-none">
                            {flight.price}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-medium mt-1">
                            per person · taxes incl.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBook(flight.airline, flight.platform)}
                          className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 ${flight.platformColor}`}
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Book on {flight.platform}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* 2x2 Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processedFlights.map((flight) => (
                    <div
                      key={flight.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-zinc-200/90 text-left transition-all hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${flight.logoBg} font-black text-xs flex items-center justify-center shadow-xs border border-zinc-200 shrink-0`}
                          >
                            {flight.airlineCode}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                                {flight.airline}
                              </h3>
                              {flight.badge && (
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    flight.badgeColor || "bg-zinc-100 text-zinc-700"
                                  }`}
                                >
                                  {flight.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500 font-medium mt-0.5">
                              {flight.stops} · {flight.duration}
                            </div>
                          </div>
                        </div>

                        <div className="text-base sm:text-lg font-black text-[#963314]">
                          {flight.price}
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-2 mb-5">
                        <div className="text-left">
                          <div className="text-base font-extrabold text-zinc-900 leading-none">
                            {flight.depTime}
                          </div>
                          <div className="text-xs text-zinc-500 font-semibold mt-1">
                            {flight.depCode}
                          </div>
                        </div>

                        <div className="flex-1 mx-4 sm:mx-6 flex items-center justify-center relative">
                          <div className="w-full border-t border-dashed border-zinc-300" />
                          <div className="absolute bg-white px-2 text-zinc-400">
                            <Plane className="w-4 h-4 rotate-90 text-[#963314]" />
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-extrabold text-zinc-900 leading-none">
                            {flight.arrTime}
                          </div>
                          <div className="text-xs text-zinc-500 font-semibold mt-1">
                            {flight.arrCode}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                        <span className="text-xs text-zinc-400 font-medium">
                          Aggregated live rate
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBook(flight.airline, flight.platform)}
                          className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 ${flight.platformColor}`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Book on {flight.platform}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ======================================================================= */}
        {/* 4. AGGREGATED FEED: HOTELS                                              */}
        {/* ======================================================================= */}
        {activeCategory === "hotels" && (
          <>
            {/* Mobile View: Standardized clean card feed */}
            <div className="md:hidden space-y-4">
              {processedHotels.map((hotel) => (
                <div
                  key={`mobile-${hotel.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 text-left transition-all flex flex-col justify-between"
                >
                  <div className="h-44 w-full relative bg-zinc-100 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${hotel.platformBadgeColor}`}
                      >
                        {hotel.platform}
                      </span>
                      {hotel.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          {hotel.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{hotel.rating}</span>
                      <span className="text-zinc-300">({hotel.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-zinc-950 leading-snug">
                          {hotel.name}
                        </h4>
                      </div>

                      <div className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{hotel.location}</span>
                      </div>

                      <div className="text-xs text-zinc-600 font-medium">
                        {hotel.roomType}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-[#963314]">
                          {hotel.pricePerNight}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-medium">/ night</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBook(hotel.name, hotel.platform)}
                        className="px-3.5 py-2 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Book on {hotel.platform}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet View: Toggleable between Grid and List */}
            <div className="hidden md:block">
              {hotelViewMode === "grid" ? (
                /* Multi-column Grid View (Default for Hotels) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {processedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 text-left transition-all hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="h-40 w-full relative bg-zinc-100 overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${hotel.platformBadgeColor}`}
                          >
                            {hotel.platform}
                          </span>
                          {hotel.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                              {hotel.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{hotel.rating}</span>
                          <span className="text-zinc-300">({hotel.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-bold text-zinc-950 leading-snug">
                              {hotel.name}
                            </h4>
                          </div>

                          <div className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">{hotel.location}</span>
                          </div>

                          <div className="text-xs text-zinc-600 font-medium">
                            {hotel.roomType}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                          <div>
                            <div className="text-base font-extrabold text-[#963314]">
                              {hotel.pricePerNight}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-medium">/ night</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleBook(hotel.name, hotel.platform)}
                            className="px-3.5 py-2 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Book on {hotel.platform}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* 1 per line List View for Hotels */
                <div className="space-y-4">
                  {processedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 text-left transition-all hover:shadow-md flex flex-col md:flex-row justify-between"
                    >
                      <div className="w-full md:w-64 h-48 md:h-auto relative bg-zinc-100 shrink-0 overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${hotel.platformBadgeColor}`}
                          >
                            {hotel.platform}
                          </span>
                          {hotel.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                              {hotel.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base sm:text-lg font-bold text-zinc-950">
                              {hotel.name}
                            </h4>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{hotel.rating}</span>
                              <span className="text-zinc-400 font-normal">({hotel.reviewsCount} reviews)</span>
                            </div>
                          </div>

                          <div className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{hotel.location}</span>
                          </div>

                          <p className="text-xs text-zinc-600 font-medium max-w-xl">
                            {hotel.roomType} · Free cancellation available · Instant confirmation
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                          <div className="text-xs text-zinc-500">
                            Total: <strong className="text-zinc-900 font-bold">{hotel.totalPrice}</strong>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-black text-[#963314]">
                                {hotel.pricePerNight}
                              </div>
                              <div className="text-[10px] text-zinc-400 font-medium">/ night</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleBook(hotel.name, hotel.platform)}
                              className="px-5 py-2.5 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Book on {hotel.platform}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      )}

      {/* ======================================================================= */}
      {/* 5. BOTTOM NAVIGATION BAR (Mobile Only)                                  */}
      {/* ======================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200/90 py-2.5 px-6 flex items-center justify-between z-30 shadow-lg">
        <button
          type="button"
          onClick={() => setCurrentNav("search")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            currentNav === "search" ? "text-[#963314]" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[11px] font-bold">Search</span>
          {currentNav === "search" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#963314] mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentNav("itinerary")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            currentNav === "itinerary" ? "text-[#963314]" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[11px] font-bold">Itinerary</span>
          {currentNav === "itinerary" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#963314] mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentNav("team")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors relative ${
            currentNav === "team" ? "text-[#963314]" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-[#f15a24] absolute -top-0.5 -right-1 border border-white" />
          </div>
          <span className="text-[11px] font-bold">Chat</span>
          {currentNav === "team" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#963314] mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentNav("expenses")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            currentNav === "expenses" ? "text-[#963314]" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[11px] font-bold">Expenses</span>
          {currentNav === "expenses" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#963314] mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentNav("profile")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            currentNav === "profile" ? "text-[#963314]" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full overflow-hidden border transition-all ${
              currentNav === "profile" ? "border-[#963314] ring-1 ring-[#963314]" : "border-zinc-300"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Alex Morgan"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[11px] font-bold">Profile</span>
          {currentNav === "profile" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#963314] mt-0.5" />
          )}
        </button>
      </nav>

      {/* Date Range Picker Calendar Modal */}
      <DateRangePickerModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onApply={(start, end, formattedStr) => {
          setStartDate(start);
          setEndDate(end);
          setDates(formattedStr);
        }}
      />
    </div>
  );
};
