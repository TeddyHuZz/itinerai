import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
  Award,
  CheckCircle2,
  Navigation,
  Zap,
  Footprints,
  Train,
  Car,
  Sparkles,
  Map,
  ChevronDown,
  ChevronUp,
  GripVertical,
  MoreVertical,
  ChevronRight,
  Moon,
  Search,
  Loader2,
} from "lucide-react";
import type { TripItem } from "./ItineraryView";
import {
  isPastTripDate,
  isTripCompleted,
  completeAndUnlockTrip,
  getChopForTrip,
} from "../../services/chopStore";
import { renderModalChopSVG } from "../profile/UserProfileView";
import { searchPlaces, type PlaceSearchResult } from "../../services/placeSearchService";
import {
  calculateDayRouteStats,
  optimizeDayActivities,
  calculateTransitLeg,
  type TransitLeg,
  type DayRouteStats,
} from "../../services/routeOptimizer";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

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
  onUpdateTrip?: (updatedTrip: TripItem) => void;
  onViewChopInProfile?: () => void;
}

export const TripWorkspace: React.FC<TripWorkspaceProps> = ({
  trip,
  onBack,
  onNavigateToSearch,
  onNavigateToChat,
  onCopyLink,
  onUpdateTrip,
  onViewChopInProfile,
}) => {
  const [isCompleted, setIsCompleted] = useState(
    () => trip.status === "Completed" || isTripCompleted(trip.id)
  );
  const [showChopCelebration, setShowChopCelebration] = useState(false);
  const isPast = useMemo(() => isPastTripDate(trip.endDate), [trip.endDate]);
  const matchingChop = useMemo(() => getChopForTrip(trip), [trip]);

  const handleCompleteTrip = () => {
    setIsCompleted(true);
    completeAndUnlockTrip(trip);
    if (onUpdateTrip) {
      onUpdateTrip({
        ...trip,
        status: "Completed",
      });
    }
    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#0d9488", "#f15a24", "#d97706", "#4f46e5", "#10b981", "#fbbf24"],
      });
    } catch {}
    setShowChopCelebration(true);
  };
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

  // Prevent background page scrolling when modals are open
  useBodyScrollLock(isAddModalOpen, () => setIsAddModalOpen(false));
  useBodyScrollLock(showChopCelebration, () => setShowChopCelebration(false));

  // New Activity Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newPeriod, setNewPeriod] = useState<"Morning" | "Afternoon" | "Evening">("Morning");
  const [newCategory, setNewCategory] = useState<DayActivity["category"]>("Sightseeing");
  const [newLocation, setNewLocation] = useState(trip.destination);
  const [newNotes, setNewNotes] = useState("");
  const [newDay, setNewDay] = useState<number>(1);
  const [newCost, setNewCost] = useState("");

  // Place Search & Google Autofill State
  const [placeSearchQuery, setPlaceSearchQuery] = useState("");
  const [placeSearchResults, setPlaceSearchResults] = useState<PlaceSearchResult[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const [autofilledPlace, setAutofilledPlace] = useState<PlaceSearchResult | null>(null);

  useEffect(() => {
    if (!placeSearchQuery.trim() || placeSearchQuery.trim().length < 2) {
      setPlaceSearchResults([]);
      setIsSearchingPlaces(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingPlaces(true);
      try {
        const results = await searchPlaces(placeSearchQuery, trip.destination);
        setPlaceSearchResults(results);
      } catch {
        setPlaceSearchResults([]);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [placeSearchQuery, trip.destination]);

  const handleSelectPlace = (place: PlaceSearchResult) => {
    setNewTitle(place.name);
    setNewLocation(place.location);
    setNewCategory(place.category);
    setNewPeriod(place.period);
    setNewTime(place.time);
    if (place.estimatedCost) setNewCost(place.estimatedCost);
    if (place.notes) setNewNotes(place.notes);
    setAutofilledPlace(place);
    setShowPlaceDropdown(false);
  };

  // Determine available day numbers (default to 3 days or max day found)
  const maxDay = Math.max(3, ...activities.map((a) => a.day));
  const availableDays = Array.from({ length: maxDay }, (_, i) => i + 1);

  // Filter activities
  const displayedActivities = activities.filter((act) =>
    selectedDay === "all" ? true : act.day === selectedDay
  );

  // Feature C: Route & Transit Optimizer States
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showRouteFlow, setShowRouteFlow] = useState(false);
  const [routeOptimizationToast, setRouteOptimizationToast] = useState<string | null>(null);

  // Determine active target day for route metrics (defaults to Day 1 when viewing "all")
  const activeTargetDay = selectedDay === "all" ? 1 : selectedDay;
  const activeDayActivities = useMemo(() => {
    return activities.filter((a) => a.day === activeTargetDay);
  }, [activities, activeTargetDay]);

  const activeDayRouteStats = useMemo<DayRouteStats>(() => {
    return calculateDayRouteStats(activeDayActivities);
  }, [activeDayActivities]);

  const handleOptimizeRoute = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const otherActivities = activities.filter((a) => a.day !== activeTargetDay);
      const reordered = optimizeDayActivities(activeDayActivities);

      setActivities([...otherActivities, ...reordered].sort((a, b) => a.day - b.day));
      setIsOptimizing(false);
      setRouteOptimizationToast(
        activeDayRouteStats.timeSavedMinutes > 0
          ? `✨ Route optimized! Grouped nearby spots to save ${activeDayRouteStats.timeSavedMinutes} mins of zigzag transit.`
          : `✨ Day ${activeTargetDay} sequence clustered for minimal transit time!`
      );
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.6 },
          colors: ["#10b981", "#059669", "#34d399", "#f59e0b", "#6366f1"],
        });
      } catch {}
      setTimeout(() => setRouteOptimizationToast(null), 4000);
    }, 450);
  };

  const renderTransitModeIcon = (mode: TransitLeg["mode"]) => {
    switch (mode) {
      case "Walk":
        return <Footprints className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case "Subway":
      case "Train":
        return <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case "Taxi":
        return <Car className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case "Ferry":
        return <Compass className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
      default:
        return <Navigation className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    }
  };

  // Drag & Drop and Reordering States
  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const draggedActivityIdRef = useRef<string | null>(null);
  const isTouchDraggingRef = useRef(false);
  const [dragOverTarget, setDragOverTarget] = useState<{
    id: string;
    position: "above" | "below";
  } | null>(null);
  const dragOverTargetRef = useRef<{ id: string; position: "above" | "below" } | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const dragOverDayRef = useRef<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Auto-scroll on Drag (smooth inertial edge scrolling)
  const autoScrollFrameRef = useRef<number | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const scrollVelocityRef = useRef<number>(0);
  const lastHitTestTimeRef = useRef<number>(0);

  const safeSetDragOverTarget = (target: { id: string; position: "above" | "below" } | null) => {
    if (
      dragOverTargetRef.current?.id === target?.id &&
      dragOverTargetRef.current?.position === target?.position
    ) {
      return;
    }
    dragOverTargetRef.current = target;
    setDragOverTarget(target);
  };

  const safeSetDragOverDay = (day: number | null) => {
    if (dragOverDayRef.current === day) return;
    dragOverDayRef.current = day;
    setDragOverDay(day);
  };

  const updateDropTargetAtPoint = (clientX: number, clientY: number) => {
    const currentDragged = draggedActivityIdRef.current;
    if (!currentDragged) return;

    const elem = document.elementFromPoint(clientX, clientY);
    if (!elem) return;

    // Check if over an activity card
    const card = elem.closest('[data-activity-card="true"]') as HTMLElement | null;
    if (card) {
      const targetId = card.getAttribute("data-activity-id");
      if (targetId && targetId !== currentDragged) {
        const rect = card.getBoundingClientRect();
        const relY = clientY - rect.top;
        const height = rect.height;

        // Hysteresis deadzone: prevents rapid flipping near the middle boundary
        let position: "above" | "below";
        if (dragOverTargetRef.current?.id === targetId) {
          if (dragOverTargetRef.current.position === "above") {
            position = relY > height * 0.58 ? "below" : "above";
          } else {
            position = relY < height * 0.42 ? "above" : "below";
          }
        } else {
          position = relY < height * 0.5 ? "above" : "below";
        }

        safeSetDragOverTarget({ id: targetId, position });
        safeSetDragOverDay(null);
        return;
      }
    }

    // Check if over a day section or header
    const dayElem = elem.closest("[data-day-container]") as HTMLElement | null;
    if (dayElem) {
      const dayStr = dayElem.getAttribute("data-day-container");
      const dayNum = dayStr ? parseInt(dayStr, 10) : null;
      if (dayNum !== null && !isNaN(dayNum)) {
        safeSetDragOverDay(dayNum);
        safeSetDragOverTarget(null);
      }
    }
  };

  const startAutoScroll = () => {
    if (autoScrollFrameRef.current !== null) return;
    scrollVelocityRef.current = 0;

    const scrollLoop = () => {
      const isDragging = !!draggedActivityIdRef.current || isTouchDraggingRef.current;
      if (!isDragging) {
        stopAutoScroll();
        return;
      }

      const pointer = pointerPosRef.current;
      let targetVelocity = 0;

      if (pointer) {
        const topThreshold = 170;
        const bottomThreshold = 170;
        const windowHeight = window.innerHeight;
        const y = pointer.y;

        if (y < topThreshold && window.scrollY > 0) {
          // Hovering near top: progressive acceleration up to ~50px/frame (~3,000px/s)
          const ratio = Math.max(0, (topThreshold - y) / topThreshold);
          const speed = 7 + Math.pow(ratio, 1.3) * 45;
          targetVelocity = -Math.min(52, speed);
        } else if (y > windowHeight - bottomThreshold) {
          // Hovering near bottom: progressive acceleration downwards
          const maxScroll = document.documentElement.scrollHeight - windowHeight;
          if (window.scrollY < maxScroll) {
            const ratio = Math.max(0, (y - (windowHeight - bottomThreshold)) / bottomThreshold);
            const speed = 7 + Math.pow(ratio, 1.3) * 45;
            targetVelocity = Math.min(52, speed);
          }
        }
      }

      // Snappy yet smooth velocity interpolation
      scrollVelocityRef.current = scrollVelocityRef.current * 0.74 + targetVelocity * 0.26;
      if (Math.abs(scrollVelocityRef.current) < 0.3) {
        scrollVelocityRef.current = 0;
      }

      const scrollDelta = Math.round(scrollVelocityRef.current);
      if (scrollDelta !== 0) {
        window.scrollBy(0, scrollDelta);

        // Throttle hit-testing to ~45ms during scrolling to maintain solid 60fps
        const now = performance.now();
        if (pointer && now - lastHitTestTimeRef.current > 45) {
          lastHitTestTimeRef.current = now;
          updateDropTargetAtPoint(pointer.x, pointer.y);
        }
      }

      autoScrollFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    autoScrollFrameRef.current = requestAnimationFrame(scrollLoop);
  };

  const stopAutoScroll = () => {
    if (autoScrollFrameRef.current !== null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
    scrollVelocityRef.current = 0;
    pointerPosRef.current = null;
  };

  // Global dragover/dragend listener for smooth edge scrolling on desktop
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      if (draggedActivityIdRef.current) {
        pointerPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleGlobalDragEnd = () => {
      stopAutoScroll();
    };

    window.addEventListener("dragover", handleGlobalDragOver);
    window.addEventListener("dragend", handleGlobalDragEnd);
    return () => {
      window.removeEventListener("dragover", handleGlobalDragOver);
      window.removeEventListener("dragend", handleGlobalDragEnd);
      stopAutoScroll();
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggedActivityIdRef.current = id;
    setDraggedActivityId(id);
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    startAutoScroll();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);

    // Set drag ghost preview to the ENTIRE activity card
    const targetElement = e.currentTarget as HTMLElement;
    const card = targetElement.closest('[data-activity-card="true"]') as HTMLElement | null;
    if (card && e.dataTransfer.setDragImage) {
      const rect = card.getBoundingClientRect();
      const offsetX = Math.max(16, Math.min(e.clientX - rect.left, rect.width - 16));
      const offsetY = Math.max(16, Math.min(e.clientY - rect.top, rect.height - 16));
      try {
        e.dataTransfer.setDragImage(card, offsetX, offsetY);
      } catch {
        // Browser fallback
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    const currentDragged = draggedActivityIdRef.current || draggedActivityId;
    if (!currentDragged || currentDragged === id) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const height = rect.height;

    // Hysteresis deadzone: prevents rapid flipping near the middle boundary
    let position: "above" | "below";
    if (dragOverTargetRef.current?.id === id) {
      if (dragOverTargetRef.current.position === "above") {
        position = relY > height * 0.58 ? "below" : "above";
      } else {
        position = relY < height * 0.42 ? "above" : "below";
      }
    } else {
      position = relY < height * 0.5 ? "above" : "below";
    }

    safeSetDragOverTarget({ id, position });
  };

  const handleDragEnd = () => {
    stopAutoScroll();
    draggedActivityIdRef.current = null;
    isTouchDraggingRef.current = false;
    setDraggedActivityId(null);
    safeSetDragOverTarget(null);
    safeSetDragOverDay(null);
  };

  // Touch Drag & Drop support for mobile devices
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    pointerPosRef.current = { x: touch.clientX, y: touch.clientY };
    draggedActivityIdRef.current = id;
    setDraggedActivityId(id);
    isTouchDraggingRef.current = true;
    startAutoScroll();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDraggingRef.current || !draggedActivityIdRef.current) return;
    const touch = e.touches[0];
    pointerPosRef.current = { x: touch.clientX, y: touch.clientY };
    updateDropTargetAtPoint(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    stopAutoScroll();
    if (!isTouchDraggingRef.current) return;
    isTouchDraggingRef.current = false;
    const sourceId = draggedActivityIdRef.current;

    if (sourceId && dragOverTarget) {
      const { id: targetId, position } = dragOverTarget;
      if (sourceId !== targetId) {
        setActivities((prev) => {
          const sourceAct = prev.find((a) => a.id === sourceId);
          if (!sourceAct) return prev;
          const withoutSource = prev.filter((a) => a.id !== sourceId);
          const targetIndex = withoutSource.findIndex((a) => a.id === targetId);
          if (targetIndex === -1) return prev;
          const targetAct = withoutSource[targetIndex];
          const updatedSource = { ...sourceAct, day: targetAct.day };
          const insertIndex = position === "above" ? targetIndex : targetIndex + 1;
          const result = [...withoutSource];
          result.splice(insertIndex, 0, updatedSource);
          return result;
        });
      }
    } else if (sourceId && dragOverDay !== null) {
      const targetDay = dragOverDay;
      setActivities((prev) => {
        const sourceAct = prev.find((a) => a.id === sourceId);
        if (!sourceAct) return prev;
        const withoutSource = prev.filter((a) => a.id !== sourceId);
        const firstTargetIndex = withoutSource.findIndex((a) => a.day === targetDay);
        const updatedSource = { ...sourceAct, day: targetDay };
        const result = [...withoutSource];
        if (firstTargetIndex === -1) {
          result.push(updatedSource);
        } else {
          result.splice(firstTargetIndex, 0, updatedSource);
        }
        return result;
      });
    }

    handleDragEnd();
  };

  // Drop directly onto an activity (above or below)
  const handleDropOnActivity = (
    e: React.DragEvent,
    targetId: string,
    position: "above" | "below"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId =
      e.dataTransfer.getData("text/plain") || draggedActivityIdRef.current || draggedActivityId;

    handleDragEnd();

    if (!sourceId || sourceId === targetId) return;

    setActivities((prev) => {
      const sourceAct = prev.find((a) => a.id === sourceId);
      if (!sourceAct) return prev;

      const withoutSource = prev.filter((a) => a.id !== sourceId);
      const targetIndex = withoutSource.findIndex((a) => a.id === targetId);
      if (targetIndex === -1) return prev;

      const targetAct = withoutSource[targetIndex];
      const updatedSource = { ...sourceAct, day: targetAct.day };

      const insertIndex = position === "above" ? targetIndex : targetIndex + 1;
      const result = [...withoutSource];
      result.splice(insertIndex, 0, updatedSource);

      return result;
    });
  };

  // Drop on Day Header or Day Group Container (moves to that day)
  const handleDropOnDay = (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId =
      e.dataTransfer.getData("text/plain") || draggedActivityIdRef.current || draggedActivityId;

    handleDragEnd();

    if (!sourceId) return;

    setActivities((prev) => {
      const sourceAct = prev.find((a) => a.id === sourceId);
      if (!sourceAct) return prev;

      const withoutSource = prev.filter((a) => a.id !== sourceId);
      const firstTargetIndex = withoutSource.findIndex((a) => a.day === targetDay);
      const updatedSource = { ...sourceAct, day: targetDay };

      const result = [...withoutSource];
      if (firstTargetIndex === -1) {
        result.push(updatedSource);
      } else {
        result.splice(firstTargetIndex, 0, updatedSource);
      }

      return result;
    });
  };

  // Drop on Transit Connector between two activities
  const handleDropBetweenActivities = (
    e: React.DragEvent,
    _prevActId: string,
    nextActId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId =
      e.dataTransfer.getData("text/plain") || draggedActivityIdRef.current || draggedActivityId;

    handleDragEnd();

    if (!sourceId || sourceId === nextActId) return;

    setActivities((prev) => {
      const sourceAct = prev.find((a) => a.id === sourceId);
      if (!sourceAct) return prev;

      const withoutSource = prev.filter((a) => a.id !== sourceId);
      const nextIndex = withoutSource.findIndex((a) => a.id === nextActId);
      if (nextIndex === -1) return prev;

      const nextAct = withoutSource[nextIndex];
      const updatedSource = { ...sourceAct, day: nextAct.day };

      const result = [...withoutSource];
      result.splice(nextIndex, 0, updatedSource);

      return result;
    });
  };

  const moveActivityWithinDay = (id: string, direction: "up" | "down") => {
    setActivities((prev) => {
      const act = prev.find((a) => a.id === id);
      if (!act) return prev;

      const sameDay = prev.filter((a) => a.day === act.day);
      const currentIndex = sameDay.findIndex((a) => a.id === id);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= sameDay.length) return prev;

      const targetAct = sameDay[targetIndex];
      const globalIdx1 = prev.findIndex((a) => a.id === act.id);
      const globalIdx2 = prev.findIndex((a) => a.id === targetAct.id);

      const next = [...prev];
      next[globalIdx1] = targetAct;
      next[globalIdx2] = act;
      return next;
    });
  };

  const handleMoveToDay = (activityId: string, newDayNumber: number) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? { ...act, day: newDayNumber } : act))
    );
    setMenuOpenId(null);
    setRouteOptimizationToast(`Moved activity to Day ${newDayNumber}`);
    setTimeout(() => setRouteOptimizationToast(null), 3000);
  };

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
    setAutofilledPlace(null);
    setShowPlaceDropdown(false);
    setPlaceSearchQuery("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col pb-28">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-2xs transition-all cursor-pointer group shrink-0"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Back to Escapes</span>
          <span className="sm:hidden">Escapes</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onNavigateToChat && (
            <button
              type="button"
              onClick={() => onNavigateToChat(trip.id)}
              className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-2xs transition-all cursor-pointer group active:scale-95 shrink-0"
              title={`Open group chat for ${trip.destination}`}
              aria-label="Trip Chat"
            >
              <MessageSquare className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#f15a24]" />
              <span className="hidden sm:inline">Trip Chat</span>
              <span className="absolute top-1 right-1 sm:static sm:top-auto sm:right-auto w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#f15a24]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onCopyLink(trip)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200/90 shadow-2xs transition-all cursor-pointer shrink-0"
            title="Invite travel companions"
            aria-label="Invite Friends"
          >
            <Share2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#f15a24]" />
            <span className="hidden sm:inline">Invite Friends</span>
          </button>

          {/* Complete Trip Action button when trip date is past today */}
          {isPast && !isCompleted && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleCompleteTrip}
              className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer group active:scale-95 shrink-0"
              title="Trip date has ended! Click to complete trip and unlock location badge"
              aria-label="Complete Trip"
            >
              <CheckCircle2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Complete Trip</span>
            </motion.button>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={() => setShowChopCelebration(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 shadow-2xs transition-all cursor-pointer shrink-0"
              title="Trip completed! Click to view your unlocked location chop badge"
              aria-label="Chop Unlocked"
            >
              <Award className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Chop Unlocked</span>
            </button>
          )}

          {onNavigateToSearch && (
            <button
              type="button"
              onClick={() =>
                onNavigateToSearch({
                  destination: trip.destination,
                  dates: trip.dates,
                })
              }
              className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs transition-all cursor-pointer group active:scale-95 shrink-0"
              title={`Search flights and hotels for ${trip.destination}`}
              aria-label="Search Flights & Stays"
            >
              <Plane className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Search Flights &amp; Stays</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-sm mb-6 bg-zinc-950 text-white">
        <div className="h-40 sm:h-56 w-full relative">
          <img
            src={trip.image}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20" />

          {/* Badge & Invite Code & Complete Trip Action */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                  isCompleted
                    ? "bg-emerald-600/90 text-white border border-emerald-400/40"
                    : trip.status === "Confirmed"
                    ? "bg-emerald-500/80 text-white border border-emerald-400/30"
                    : trip.status === "Planning"
                    ? "bg-amber-500/80 text-white border border-amber-400/30"
                    : "bg-blue-500/80 text-white border border-blue-400/30"
                }`}
              >
                {isCompleted ? "Completed" : trip.status}
              </span>
            </div>

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
          {/* Day Filter Tabs & Add Activity CTA */}
          <div className="flex items-center gap-2">
            {/* Scrollable Day Tabs */}
            <div className="flex-1 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              <div className="inline-flex w-max min-w-max items-center gap-1.5 bg-white p-1 rounded-2xl border border-zinc-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSelectedDay("all")}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
                      className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
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
            </div>

            {/* Add Activity CTA Button - pinned on the right, never clipped */}
            <button
              type="button"
              onClick={() => {
                setNewDay(typeof selectedDay === "number" ? selectedDay : 1);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#f15a24] hover:bg-[#e04812] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
              title="Add Activity"
            >
              <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Add Activity</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Feature C: AI Route Efficiency & Sequence Optimizer Bar */}
          {displayedActivities.length > 1 && (
            <div className="p-3 sm:p-4 rounded-2xl bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white shadow-md border border-zinc-800 space-y-2.5 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Efficiency Badge */}
                  <div
                    className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border shadow-2xs ${
                      activeDayRouteStats.efficiencyScore >= 88
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{activeDayRouteStats.efficiencyScore}% Route Efficiency</span>
                  </div>

                  {/* Transit Metrics */}
                  <div className="text-xs font-medium text-zinc-300 flex items-center gap-2">
                    <span className="font-bold text-white">
                      ~{activeDayRouteStats.totalTransitMinutes}m transit
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span>{activeDayRouteStats.totalDistanceKm} km total</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">Day {activeTargetDay}</span>
                  </div>
                </div>

                {/* Right Actions: Route Flow Toggle & 1-Click Optimize */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowRouteFlow((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    title="Toggle visual route flow"
                  >
                    <Map className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="hidden sm:inline">Route Flow</span>
                    {showRouteFlow ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    disabled={isOptimizing || activeDayRouteStats.isOptimized}
                    onClick={handleOptimizeRoute}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      activeDayRouteStats.isOptimized
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 cursor-default"
                        : "bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-900/40 border border-emerald-400/40"
                    }`}
                    title="Reorder activities geographically to minimize travel time"
                  >
                    {isOptimizing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </motion.div>
                        <span>Optimizing...</span>
                      </>
                    ) : activeDayRouteStats.isOptimized ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Route Optimized</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI Optimize Route</span>
                        {activeDayRouteStats.timeSavedMinutes > 0 && (
                          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-md text-emerald-200">
                            Save ~{activeDayRouteStats.timeSavedMinutes}m
                          </span>
                        )}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Expandable Route Flow Stepper */}
              <AnimatePresence>
                {showRouteFlow && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-2 border-t border-zinc-800"
                  >
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Geographic Stop Sequence · Day {activeTargetDay}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {activeDayActivities.map((act, idx) => {
                        const nextLeg = activeDayRouteStats.legs[idx];
                        return (
                          <React.Fragment key={act.id}>
                            <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-700/80 shrink-0">
                              <span className="w-5 h-5 rounded-full bg-zinc-700 text-[10px] font-black flex items-center justify-center text-zinc-300">
                                {idx + 1}
                              </span>
                              <div className="max-w-32.5 truncate text-xs font-bold text-zinc-200">
                                {act.title}
                              </div>
                            </div>
                            {nextLeg && (
                              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-1 shrink-0">
                                {renderTransitModeIcon(nextLeg.mode)}
                                <span>{nextLeg.durationMinutes}m</span>
                                <span className="text-zinc-600">→</span>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
            (() => {
              const renderActivityCard = (
                act: DayActivity,
                index: number,
                dayList: DayActivity[]
              ) => {
                const categoryStyle = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.Sightseeing;
                const nextAct = dayList[index + 1];
                const isFirstInDay = index === 0;
                const isLastInDay = index === dayList.length - 1;
                const isDraggingThis = draggedActivityId === act.id;
                const isDropAbove =
                  dragOverTarget?.id === act.id &&
                  dragOverTarget.position === "above" &&
                  draggedActivityId !== act.id;
                const isDropBelow =
                  dragOverTarget?.id === act.id &&
                  dragOverTarget.position === "below" &&
                  draggedActivityId !== act.id;
                const isMenuOpen = menuOpenId === act.id;

                return (
                  <React.Fragment key={act.id}>
                    <motion.div
                      layout={!draggedActivityId}
                      layoutId={`act-card-${act.id}`}
                      data-activity-card="true"
                      data-activity-id={act.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: isDraggingThis ? 0.3 : 1,
                        scale: isDraggingThis ? 0.98 : 1,
                        y: 0,
                      }}
                      transition={{
                        layout: { type: "spring", stiffness: 450, damping: 30 },
                        scale: { duration: 0.16 },
                        opacity: { duration: 0.16 },
                      }}
                      onDragOver={(e) => handleDragOver(e, act.id)}
                      onDrop={(e) => {
                        const pos = dragOverTarget?.position || "below";
                        handleDropOnActivity(e, act.id, pos);
                      }}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-2xl border transition-colors duration-150 p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group relative ${
                        isDraggingThis
                          ? "border-dashed border-zinc-400 bg-zinc-50 shadow-inner"
                          : isDropAbove
                          ? "border-t-[#963314] shadow-xs"
                          : isDropBelow
                          ? "border-b-[#963314] shadow-xs"
                          : "border-zinc-200/90 shadow-2xs hover:shadow-md"
                      }`}
                    >
                      {/* Insertion Line Indicator Above (Absolute - 0 layout shift) */}
                      {isDropAbove && (
                        <div className="absolute -top-1.5 inset-x-2 h-1 bg-[#963314] rounded-full shadow-md z-30 pointer-events-none flex items-center justify-between">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#963314] -ml-1 border-2 border-white ring-1 ring-[#963314]" />
                          <span className="bg-[#963314] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                            Insert Above
                          </span>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#963314] -mr-1 border-2 border-white ring-1 ring-[#963314]" />
                        </div>
                      )}

                      {/* Insertion Line Indicator Below (Absolute - 0 layout shift) */}
                      {isDropBelow && (
                        <div className="absolute -bottom-1.5 inset-x-2 h-1 bg-[#963314] rounded-full shadow-md z-30 pointer-events-none flex items-center justify-between">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#963314] -ml-1 border-2 border-white ring-1 ring-[#963314]" />
                          <span className="bg-[#963314] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                            Insert Below
                          </span>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#963314] -mr-1 border-2 border-white ring-1 ring-[#963314]" />
                        </div>
                      )}
                      <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                        {/* Drag Handle & Up/Down Reorder */}
                        <div className="flex flex-col items-center justify-start pt-0.5 shrink-0 select-none">
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, act.id)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(e) => handleTouchStart(e, act.id)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{ touchAction: "none" }}
                            className="p-1.5 sm:p-1 text-zinc-400 hover:text-zinc-700 cursor-grab active:cursor-grabbing rounded-md hover:bg-zinc-100 transition-colors touch-none"
                            title="Drag to reorder activity"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col opacity-75 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity -space-y-0.5 mt-0.5">
                            <button
                              type="button"
                              disabled={isFirstInDay}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveActivityWithinDay(act.id, "up");
                              }}
                              className="p-1 sm:p-0.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 disabled:hover:text-zinc-400 cursor-pointer active:scale-75 transition-transform"
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isLastInDay}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveActivityWithinDay(act.id, "down");
                              }}
                              className="p-1 sm:p-0.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 disabled:hover:text-zinc-400 cursor-pointer active:scale-75 transition-transform"
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

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

                      {/* Right Column: Upvote, 3-Dots Menu & Quick Trash */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 shrink-0">
                        <div className="flex items-center gap-1.5">
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

                          {/* 3-Dots Action Menu */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenId(isMenuOpen ? null : act.id);
                              }}
                              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                                isMenuOpen
                                  ? "bg-zinc-200 text-zinc-900 shadow-2xs"
                                  : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                              }`}
                              title="Activity options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpenId(null);
                                  }}
                                />
                                <div
                                  className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-52 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-xl border border-zinc-200/90 py-2 z-40 text-left animate-in fade-in zoom-in-95 duration-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="px-3 pb-1 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                                    Move to Another Day
                                  </div>
                                  <div className="max-h-40 overflow-y-auto px-1 space-y-0.5">
                                    {availableDays
                                      .filter((d) => d !== act.day)
                                      .map((d) => (
                                        <button
                                          key={d}
                                          type="button"
                                          onClick={() => handleMoveToDay(act.id, d)}
                                          className="w-full px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg font-medium flex items-center justify-between transition-colors text-left cursor-pointer"
                                        >
                                          <span className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                            <span>Move to Day {d}</span>
                                          </span>
                                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                                        </button>
                                      ))}
                                  </div>

                                  <div className="h-px bg-zinc-100 my-1.5" />

                                  <div className="px-3 pb-1 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                                    Order in Day {act.day}
                                  </div>
                                  <div className="px-1 space-y-0.5">
                                    <button
                                      type="button"
                                      disabled={isFirstInDay}
                                      onClick={() => {
                                        moveActivityWithinDay(act.id, "up");
                                        setMenuOpenId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 rounded-lg font-medium flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                      <span>Move Up</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLastInDay}
                                      onClick={() => {
                                        moveActivityWithinDay(act.id, "down");
                                        setMenuOpenId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 rounded-lg font-medium flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      <span>Move Down</span>
                                    </button>
                                  </div>

                                  <div className="h-px bg-zinc-100 my-1.5" />

                                  <div className="px-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleDeleteActivity(act.id);
                                        setMenuOpenId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete Activity</span>
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

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

                    {/* Transit Connector between consecutive activities in the same day */}
                    {nextAct && (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(e) => handleDropBetweenActivities(e, act.id, nextAct.id)}
                        className="relative py-1 flex items-center justify-center cursor-default"
                        title="Drop here to insert between these spots"
                      >
                        <div className="absolute inset-x-8 sm:inset-x-16 h-px border-dashed border-t border-zinc-200" />
                        <div className="relative z-10 px-3 py-1 rounded-full bg-zinc-50 hover:bg-orange-50 border border-zinc-200/90 hover:border-[#963314] text-[11px] font-bold text-zinc-700 flex items-center gap-2 shadow-2xs transition-all">
                          {(() => {
                            const leg = calculateTransitLeg(act, nextAct);
                            return (
                              <>
                                <span className="flex items-center gap-1.5 text-zinc-900">
                                  {renderTransitModeIcon(leg.mode)}
                                  <span>{leg.durationMinutes}m transit</span>
                                </span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-zinc-500 font-mono text-[10px]">{leg.distanceKm} km</span>
                                {leg.note && (
                                  <>
                                    <span className="text-zinc-300">•</span>
                                    <span className="text-zinc-500 font-normal italic hidden sm:inline truncate max-w-50">
                                      {leg.note}
                                    </span>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              };

              // If viewing "All Days", group activities cleanly under distinct day banners
              if (selectedDay === "all") {
                return (
                  <div className="space-y-6">
                    {availableDays.map((dayNum, dayIndex) => {
                      const dayActs = activities.filter((a) => a.day === dayNum);

                      if (dayActs.length === 0) {
                        return (
                          <div
                            key={`day-group-${dayNum}`}
                            data-day-container={dayNum}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                              if (dragOverDay !== dayNum) setDragOverDay(dayNum);
                            }}
                            onDragLeave={() => setDragOverDay(null)}
                            onDrop={(e) => handleDropOnDay(e, dayNum)}
                            className={`rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                              dragOverDay === dayNum
                                ? "border-[#963314] bg-orange-50/60 ring-2 ring-[#963314]/30"
                                : "border-zinc-200 bg-zinc-50/40"
                            }`}
                          >
                            <span className="text-xs font-bold text-zinc-500">
                              Day {dayNum} — No spots yet. Drop an activity here to move to Day {dayNum}!
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`day-group-${dayNum}`}
                          data-day-container={dayNum}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(e) => handleDropOnDay(e, dayNum)}
                          className="space-y-3"
                        >
                          {/* Day Section Header */}
                          <div
                            data-day-container={dayNum}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                              if (dragOverDay !== dayNum) setDragOverDay(dayNum);
                            }}
                            onDragLeave={(e) => {
                              const currentTarget = e.currentTarget as HTMLElement;
                              const relatedTarget = e.relatedTarget as Node | null;
                              if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
                                if (dragOverDay === dayNum) setDragOverDay(null);
                              }
                            }}
                            onDrop={(e) => handleDropOnDay(e, dayNum)}
                            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 border shadow-2xs transition-all duration-150 ${
                              dragOverDay === dayNum
                                ? "bg-amber-100/90 border-[#963314] ring-2 ring-[#963314]/40 scale-[1.01]"
                                : "bg-zinc-100/90 border-zinc-200/80"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-xl bg-[#963314] text-white flex items-center justify-center text-xs font-black tracking-tight shadow-xs">
                                D{dayNum}
                              </span>
                              <div>
                                <h3 className="text-sm font-black text-zinc-900 leading-none">
                                  Day {dayNum} Itinerary
                                </h3>
                                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                                  {dragOverDay === dayNum ? (
                                    <span className="text-[#963314] font-bold">Release to move spot to Day {dayNum}</span>
                                  ) : (
                                    `${dayActs.length} ${dayActs.length === 1 ? "activity" : "activities"} scheduled`
                                  )}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedDay(dayNum)}
                              className="text-[11px] font-bold text-[#963314] hover:text-[#7a280e] bg-white hover:bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                            >
                              <span>Focus Day {dayNum}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Day's Activities List */}
                          <div className="space-y-3">
                            {dayActs.map((act, actIdx) => renderActivityCard(act, actIdx, dayActs))}
                          </div>

                          {/* Overnight Divider between days */}
                          {dayIndex < availableDays.length - 1 && (
                            <div className="py-2.5 flex items-center gap-3">
                              <div className="flex-1 border-t-2 border-dashed border-zinc-200" />
                              <div className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-zinc-100 text-[11px] font-bold flex items-center gap-2 shadow-sm">
                                <Moon className="w-3.5 h-3.5 text-amber-400" />
                                <span>Overnight • Rest & Recharge in {trip.destination.split(",")[0].trim()}</span>
                              </div>
                              <div className="flex-1 border-t-2 border-dashed border-zinc-200" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              // Single Day View
              return (
                <div className="space-y-3">
                  {displayedActivities.map((act, actIdx) =>
                    renderActivityCard(act, actIdx, displayedActivities)
                  )}
                </div>
              );
            })()
          )}
        </div>

        {/* Right Sidebar: Route Intelligence, Companions & Trip Info */}
        <div className="w-full lg:w-80 space-y-4 shrink-0">
          {/* AI Route Intelligence Card */}
          {activeDayActivities.length > 0 && (
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xs p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-zinc-900">Route Intelligence</h3>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                  Day {activeTargetDay}
                </span>
              </div>

              {/* Transit Breakdown Pills */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="text-base font-black text-zinc-900">
                    {activeDayRouteStats.totalTransitMinutes}m
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Transit Time</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="text-base font-black text-zinc-900">
                    {activeDayRouteStats.totalDistanceKm} km
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Distance</div>
                </div>
              </div>

              {/* Stop-by-stop Sequence */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Stops Breakdown ({activeDayActivities.length})
                </div>
                <div className="space-y-1">
                  {activeDayActivities.map((act, i) => (
                    <div
                      key={act.id}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 py-1 px-2 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <span className="w-4 h-4 rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate flex-1">{act.title}</span>
                      <span className="text-[10px] text-zinc-400 shrink-0 font-mono">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Local Transit Pro Tip */}
              <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 text-xs text-[#963314] leading-relaxed">
                <div className="font-extrabold flex items-center gap-1.5 mb-0.5">
                  <span>AI Transit Insight</span>
                </div>
                {activeDayRouteStats.isOptimized ? (
                  <p className="text-[11px] text-zinc-700">
                    Your spots on Day {activeTargetDay} follow a natural geographic arc with minimal transit overhead!
                  </p>
                ) : (
                  <p className="text-[11px] text-zinc-700">
                    {activeDayRouteStats.suggestedOptimizationReason ||
                      `Save up to ${activeDayRouteStats.timeSavedMinutes}m transit by clustering nearby spots together.`}
                  </p>
                )}
              </div>
            </div>
          )}

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
      {isAddModalOpen && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-sm overscroll-contain">
            <div
              className="absolute inset-0"
              onClick={() => setIsAddModalOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-y-auto max-h-[90vh] overscroll-contain z-10 flex flex-col"
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
                {/* Activity Name with Google Places Autocomplete */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Activity / Place Name *
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value);
                        setPlaceSearchQuery(e.target.value);
                        setShowPlaceDropdown(true);
                        if (autofilledPlace && e.target.value !== autofilledPlace.name) {
                          setAutofilledPlace(null);
                        }
                      }}
                      onFocus={() => {
                        if (placeSearchResults.length > 0 || newTitle.length >= 2) {
                          setShowPlaceDropdown(true);
                        }
                      }}
                      placeholder="Type place name (e.g. Fushimi Inari, Kinkaku-ji, Gion)..."
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-zinc-200 focus:border-[#963314] focus:ring-2 focus:ring-[#963314]/10 text-sm font-semibold outline-none transition-all shadow-2xs"
                    />
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />

                    {isSearchingPlaces ? (
                      <Loader2 className="w-4 h-4 text-[#963314] absolute right-3 top-3 animate-spin pointer-events-none" />
                    ) : newTitle ? (
                      <button
                        type="button"
                        onClick={() => {
                          setNewTitle("");
                          setPlaceSearchQuery("");
                          setAutofilledPlace(null);
                          setShowPlaceDropdown(false);
                        }}
                        className="w-4 h-4 text-zinc-400 hover:text-zinc-600 absolute right-3 top-3 cursor-pointer"
                        title="Clear"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    {/* Google & Places Search Dropdown */}
                    {showPlaceDropdown && (placeSearchResults.length > 0 || isSearchingPlaces) && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-zinc-200/90 z-50 overflow-hidden divide-y divide-zinc-100 max-h-64 overflow-y-auto">
                        <div className="px-3.5 py-1.5 bg-zinc-50 flex items-center justify-between text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                          <span className="flex items-center gap-1.5 text-zinc-700">
                            <MapPin className="w-3 h-3 text-[#963314]" />
                            <span>Places in {trip.destination.split(",")[0]}</span>
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                            Click to Autofill
                          </span>
                        </div>

                        {placeSearchResults.map((place) => (
                          <button
                            key={place.id}
                            type="button"
                            onClick={() => handleSelectPlace(place)}
                            className="w-full px-3.5 py-2.5 text-left hover:bg-orange-50/60 flex items-start justify-between gap-3 transition-colors cursor-pointer group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-zinc-900 group-hover:text-[#963314] transition-colors truncate">
                                  {place.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                                {place.location}
                              </p>
                              {place.notes && (
                                <p className="text-[10px] text-zinc-400 italic truncate mt-0.5">
                                  💡 {place.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 group-hover:bg-orange-100 group-hover:text-orange-900 transition-colors">
                                {place.category}
                              </span>
                              {place.estimatedCost && (
                                <span className="text-[10px] font-medium text-zinc-500">
                                  {place.estimatedCost.split("/")[0]}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Autofilled Success Banner */}
                  {autofilledPlace && (
                    <div className="mt-2 px-3 py-2 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-900 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate">
                          Autofilled details from Google Places: Category, Location, Cost &amp; Tips
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutofilledPlace(null)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-950 underline shrink-0 cursor-pointer"
                      >
                        Edit fields
                      </button>
                    </div>
                  )}
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
        </AnimatePresence>,
        document.body
      )}

      {/* ======================================================================= */}
      {/* CELEBRATION MODAL: UNLOCKED LOCATION CHOP BADGE                         */}
      {/* ======================================================================= */}
      {showChopCelebration && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <div
            onClick={() => setShowChopCelebration(false)}
            className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-zinc-200 cursor-default"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
                <div className="flex items-center gap-2">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900">Trip Completed!</h3>
                    <p className="text-[10px] font-mono text-emerald-700 font-bold">PASSPORT CHOP UNLOCKED</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChopCelebration(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stamp Showcase */}
              <div className="p-6 text-center space-y-4 bg-radial from-teal-50/60 via-white to-white">
                <div
                  className={`p-6 rounded-3xl border-3 mx-auto w-44 h-36 flex flex-col items-center justify-between shadow-sm ${
                    matchingChop.accentColor.border
                  } ${matchingChop.accentColor.bg}`}
                >
                  <span className={`text-base font-black tracking-tight ${matchingChop.accentColor.text}`}>
                    {matchingChop.name}
                  </span>
                  <div className="w-16 h-10 flex items-center justify-center">
                    <div className="scale-125">
                      {renderModalChopSVG(matchingChop.svgType, matchingChop.accentColor.fill)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold text-zinc-500">
                    <span>{matchingChop.countryCode}</span>
                    <span>✦</span>
                    <span>{matchingChop.date.split(" ")[0]}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-black text-zinc-950">{trip.destination}</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto font-medium">
                    Congratulations! You completed this escape and unlocked the official{" "}
                    <strong className="text-zinc-900">{matchingChop.name}</strong> stamp in your passport collection.
                  </p>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="px-6 pb-6 space-y-3">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Coordinates</span>
                    <span className="font-mono font-bold text-zinc-800">{matchingChop.coordinates}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Travel Party</span>
                    <span className="font-bold text-zinc-800">
                      {trip.members.map((m) => m.name).join(", ") || matchingChop.companions.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {onViewChopInProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowChopCelebration(false);
                        onViewChopInProfile();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View in Passport</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowChopCelebration(false)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
      {/* Route Optimization Toast Alert */}
      <AnimatePresence>
        {routeOptimizationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 max-w-md w-[calc(100%-2rem)] p-3.5 rounded-2xl text-white text-xs flex items-center justify-between shadow-2xl shadow-emerald-950/60 border border-emerald-500/50 bg-zinc-950/95 backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-zinc-100">{routeOptimizationToast}</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
