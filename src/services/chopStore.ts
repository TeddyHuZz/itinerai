// ============================================================================
// Centralized Passport Chop & Trip Completion Store
// Handles unlocking location badges, dynamic custom chop generation, and persistence
// ============================================================================

export interface ChopAccentColor {
  border: string;
  bg: string;
  text: string;
  fill: string;
}

export interface TravelChopItem {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  date: string;
  status: "unlocked" | "locked";
  accentColor: ChopAccentColor;
  svgType: "mountain" | "sun" | "tea" | "palace" | "temple" | "matterhorn" | "torii" | "amalfi";
  companions: string[];
  coordinates: string;
  description: string;
  highlightMemory: string;
}

// Curated authentic base chops preloaded in the system
export const BASE_CHOPS: TravelChopItem[] = [
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
    status: "locked", // Unlocked upon completing trip in TripWorkspace
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
    id: "chop-amalfi",
    name: "Amalfi Coastline",
    location: "Positano & Capri, Italy",
    country: "Italy",
    countryCode: "IT",
    date: "September 2026",
    status: "locked",
    accentColor: {
      border: "border-rose-500",
      bg: "bg-rose-50/40 hover:bg-rose-50/70",
      text: "text-rose-600",
      fill: "#e11d48",
    },
    svgType: "amalfi",
    companions: ["Sarah Chen", "Elena Rossi"],
    coordinates: "40.6340° N, 14.6027° E",
    description: "Dramatic Mediterranean cliffs lined with pastel villas, scented lemon groves, and sapphire coastal waters.",
    highlightMemory: "Sunset boat cruise around the Faraglioni sea stacks with limoncello spritz.",
  },
  {
    id: "chop-kyoto",
    name: "Kyoto Torii Shrine",
    location: "Kyoto & Gion, Japan",
    country: "Japan",
    countryCode: "JP",
    date: "October 2026",
    status: "locked",
    accentColor: {
      border: "border-amber-600",
      bg: "bg-amber-50/40 hover:bg-amber-50/70",
      text: "text-amber-700",
      fill: "#d97706",
    },
    svgType: "torii",
    companions: ["David Kim", "Kenji Sato", "Sarah Chen"],
    coordinates: "35.0116° N, 135.7681° E",
    description: "Ancient imperial capital with thousands of vermilion torii gates, tranquil zen gardens, and historic tea houses.",
    highlightMemory: "Early morning hike through Arashiyama bamboo groves and afternoon matcha ceremony in Gion.",
  },
  {
    id: "chop-zermatt",
    name: "Zermatt Alpine",
    location: "Valais, Switzerland",
    country: "Switzerland",
    countryCode: "CH",
    date: "December 2026",
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

const DEFAULT_UNLOCKED = [
  "chop-brinchang",
  "chop-melaka",
  "chop-sungai-karang",
  "chop-johor-bahru",
];

const STORAGE_KEY_CHOPS = "itinerai_unlocked_chops_v1";
const STORAGE_KEY_CUSTOM_CHOPS = "itinerai_custom_chops_v1";
const STORAGE_KEY_TRIPS = "itinerai_completed_trips_v1";

// ============================================================================
// Storage & Synchronization Helpers
// ============================================================================

export const getUnlockedChopIds = (): string[] => {
  if (typeof window === "undefined") return DEFAULT_UNLOCKED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHOPS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_UNLOCKED;
};

export const getCustomChops = (): TravelChopItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CHOPS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveCustomChop = (chop: TravelChopItem): void => {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomChops();
    const filtered = existing.filter((c) => c.id !== chop.id);
    const next = [...filtered, chop];
    localStorage.setItem(STORAGE_KEY_CUSTOM_CHOPS, JSON.stringify(next));
  } catch {}
};

export const getAllChops = (unlockedIds?: string[]): TravelChopItem[] => {
  const activeUnlocked = unlockedIds || getUnlockedChopIds();
  const custom = getCustomChops();

  // Combine base chops and custom chops (custom chops take precedence if overlapping ID)
  const combinedMap = new Map<string, TravelChopItem>();
  for (const c of BASE_CHOPS) {
    combinedMap.set(c.id, c);
  }
  for (const c of custom) {
    combinedMap.set(c.id, c);
  }

  return Array.from(combinedMap.values()).map((c) => ({
    ...c,
    status: activeUnlocked.includes(c.id) ? "unlocked" : "locked",
  }));
};

export const unlockChopId = (chopId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const current = getUnlockedChopIds();
    if (!current.includes(chopId)) {
      const next = [...current, chopId];
      localStorage.setItem(STORAGE_KEY_CHOPS, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("itinerai_chops_changed", { detail: { chopId, all: next } }));
    }
  } catch {}
};

export const isChopUnlocked = (chopId: string): boolean => {
  return getUnlockedChopIds().includes(chopId);
};

export const getCompletedTripIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const markTripCompleted = (tripId: string): void => {
  if (typeof window === "undefined") return;
  try {
    const current = getCompletedTripIds();
    if (!current.includes(tripId)) {
      const next = [...current, tripId];
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("itinerai_trips_changed", { detail: { tripId, all: next } }));
    }
  } catch {}
};

export const isTripCompleted = (tripId: string): boolean => {
  return getCompletedTripIds().includes(tripId);
};

// Check if a trip's end date is past today
export const isPastTripDate = (endDateStr?: string): boolean => {
  if (!endDateStr) return false;
  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);

  const now = new Date();
  if (now.getFullYear() < 2026) {
    const simulated2026 = new Date(2026, 8, 10, 23, 59, 59); // Sep 10, 2026
    return end.getTime() <= simulated2026.getTime();
  }
  return end.getTime() <= now.getTime();
};

// ============================================================================
// Smart Heuristic & Dynamic Chop Generator for ANY Location Worldwide
// ============================================================================

// Known country codes dictionary
const COUNTRY_CODES: Record<string, string> = {
  malaysia: "MY",
  indonesia: "ID",
  singapore: "SG",
  thailand: "TH",
  japan: "JP",
  italy: "IT",
  switzerland: "CH",
  france: "FR",
  spain: "ES",
  germany: "DE",
  "united states": "US",
  usa: "US",
  "united kingdom": "GB",
  uk: "GB",
  korea: "KR",
  "south korea": "KR",
  australia: "AU",
  vietnam: "VN",
  philippines: "PH",
  taiwan: "TW",
  greece: "GR",
  turkey: "TR",
  netherlands: "NL",
  austria: "AT",
  norway: "NO",
  iceland: "IS",
  portugal: "PT",
  canada: "CA",
  "new zealand": "NZ",
  china: "CN",
};

// Known coordinates dictionary for major travel hubs
const CITY_COORDINATES: Record<string, string> = {
  paris: "48.8566° N, 2.3522° E",
  tokyo: "35.6762° N, 139.6503° E",
  london: "51.5074° N, 0.1278° W",
  bangkok: "13.7563° N, 100.5018° E",
  singapore: "1.3521° N, 103.8198° E",
  seoul: "37.5665° N, 126.9780° E",
  barcelona: "41.3879° N, 2.1699° E",
  rome: "41.9028° N, 12.4964° E",
  amsterdam: "52.3676° N, 4.9041° E",
  sydney: "33.8688° S, 151.2093° E",
  newyork: "40.7128° N, 74.0060° W",
  penang: "5.4141° N, 100.3288° E",
  hanoi: "21.0285° N, 105.8542° E",
  taipei: "25.0330° N, 121.5654° E",
  reykjavik: "64.1466° N, 21.9426° W",
};

// Curated authentic passport stamp ink color palettes
const CHOP_PALETTES: ChopAccentColor[] = [
  {
    border: "border-teal-600",
    bg: "bg-teal-50/40 hover:bg-teal-50/70",
    text: "text-teal-700",
    fill: "#0d9488",
  },
  {
    border: "border-rose-500",
    bg: "bg-rose-50/40 hover:bg-rose-50/70",
    text: "text-rose-600",
    fill: "#e11d48",
  },
  {
    border: "border-emerald-600",
    bg: "bg-emerald-50/40 hover:bg-emerald-50/70",
    text: "text-emerald-700",
    fill: "#059669",
  },
  {
    border: "border-indigo-600",
    bg: "bg-indigo-50/40 hover:bg-indigo-50/70",
    text: "text-indigo-700",
    fill: "#4f46e5",
  },
  {
    border: "border-amber-600",
    bg: "bg-amber-50/40 hover:bg-amber-50/70",
    text: "text-amber-700",
    fill: "#d97706",
  },
  {
    border: "border-violet-500",
    bg: "bg-violet-50/40 hover:bg-violet-50/70",
    text: "text-violet-600",
    fill: "#8b5cf6",
  },
  {
    border: "border-blue-600",
    bg: "bg-blue-50/40 hover:bg-blue-50/70",
    text: "text-blue-700",
    fill: "#2563eb",
  },
];

// Simple deterministic hash to consistently select palette & SVG type
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Generates an authentic passport chop for ANY arbitrary destination
export const generateDynamicChop = (
  trip: { id: string; destination: string; dates: string; members?: { name: string }[] }
): TravelChopItem => {
  const parts = trip.destination.split(",").map((s) => s.trim());
  const cityName = parts[0] || trip.destination;
  const countryName = parts.length > 1 ? parts[parts.length - 1] : "Global Escape";
  const lowerDest = trip.destination.toLowerCase();
  const lowerCity = cityName.toLowerCase();
  const lowerCountry = countryName.toLowerCase();

  // 1. Determine Country Code
  let countryCode = COUNTRY_CODES[lowerCountry] || COUNTRY_CODES[lowerCity];
  if (!countryCode) {
    // Check if any country name is a substring
    for (const [key, code] of Object.entries(COUNTRY_CODES)) {
      if (lowerDest.includes(key)) {
        countryCode = code;
        break;
      }
    }
  }
  if (!countryCode) {
    // Fallback to first 2 letters of country or EXP for Explorer
    countryCode = (countryName.replace(/[^A-Za-z]/g, "").slice(0, 2) || "EXP").toUpperCase();
  }

  // 2. Determine SVG Graphic Type via heuristic semantic keywords
  let svgType: TravelChopItem["svgType"] = "sun";
  if (lowerDest.includes("torii") || lowerDest.includes("japan") || lowerDest.includes("kyoto") || lowerDest.includes("tokyo") || lowerDest.includes("osaka")) {
    svgType = "torii";
  } else if (lowerDest.includes("temple") || lowerDest.includes("bali") || lowerDest.includes("ubud") || lowerDest.includes("thailand") || lowerDest.includes("pagoda")) {
    svgType = "temple";
  } else if (lowerDest.includes("matterhorn") || lowerDest.includes("zermatt") || lowerDest.includes("alps") || lowerDest.includes("glacier") || lowerDest.includes("snow")) {
    svgType = "matterhorn";
  } else if (lowerDest.includes("amalfi") || lowerDest.includes("coast") || lowerDest.includes("positano") || lowerDest.includes("capri") || lowerDest.includes("beach") || lowerDest.includes("island") || lowerDest.includes("sea")) {
    svgType = "amalfi";
  } else if (lowerDest.includes("mountain") || lowerDest.includes("hike") || lowerDest.includes("volcano") || lowerDest.includes("trail") || lowerDest.includes("hill")) {
    svgType = "mountain";
  } else if (lowerDest.includes("tea") || lowerDest.includes("plantation") || lowerDest.includes("highlands") || lowerDest.includes("garden") || lowerDest.includes("farm")) {
    svgType = "tea";
  } else if (lowerDest.includes("palace") || lowerDest.includes("castle") || lowerDest.includes("heritage") || lowerDest.includes("city") || lowerDest.includes("capital") || lowerDest.includes("square")) {
    svgType = "palace";
  } else {
    // Deterministic selection from available icons based on destination hash
    const svgTypes: TravelChopItem["svgType"][] = ["sun", "palace", "mountain", "temple", "amalfi"];
    svgType = svgTypes[hashString(trip.destination) % svgTypes.length];
  }

  // 3. Deterministic Stamp Color Theme
  const palette = CHOP_PALETTES[hashString(trip.destination) % CHOP_PALETTES.length];

  // 4. Coordinates
  let coordinates = CITY_COORDINATES[lowerCity] || CITY_COORDINATES[cityName.replace(/\s+/g, "").toLowerCase()];
  if (!coordinates) {
    const lat = (1 + (hashString(cityName) % 65)).toFixed(4);
    const lon = (1 + (hashString(countryName) % 150)).toFixed(4);
    coordinates = `${lat}° N, ${lon}° E`;
  }

  // 5. Companions
  const companions = trip.members && trip.members.length > 0
    ? trip.members.map((m) => m.name)
    : ["Alex Morgan", "Sarah Chen"];

  const chopId = `chop-${trip.id}`;

  return {
    id: chopId,
    name: cityName,
    location: trip.destination,
    country: countryName,
    countryCode,
    date: trip.dates,
    status: isChopUnlocked(chopId) ? "unlocked" : "locked",
    accentColor: palette,
    svgType,
    companions,
    coordinates,
    description: `Official passport memory chop unlocked for exploring ${trip.destination}. Verified travel milestone.`,
    highlightMemory: `Memorable highlights and collaborative journey through ${cityName} with travel companions.`,
  };
};

// Match or create a TravelChop for any trip (built-in or dynamic custom location)
export const getChopForTrip = (
  trip: { id: string; destination: string; dates: string; members?: { name: string }[] }
): TravelChopItem => {
  const destLower = trip.destination.toLowerCase();

  // Check if matches built-in Bali
  if (trip.id === "trip-bali" || destLower.includes("bali") || destLower.includes("indonesia")) {
    const chop = BASE_CHOPS.find((c) => c.id === "chop-bali")!;
    return {
      ...chop,
      status: isChopUnlocked(chop.id) ? "unlocked" : "locked",
    };
  }

  // Check if matches built-in Amalfi
  if (trip.id === "trip-amalfi" || destLower.includes("amalfi") || destLower.includes("positano")) {
    const chop = BASE_CHOPS.find((c) => c.id === "chop-amalfi")!;
    return {
      ...chop,
      status: isChopUnlocked(chop.id) ? "unlocked" : "locked",
    };
  }

  // Check if matches built-in Kyoto
  if (trip.id === "trip-kyoto" || destLower.includes("kyoto") || (destLower.includes("japan") && !destLower.includes("tokyo"))) {
    const chop = BASE_CHOPS.find((c) => c.id === "chop-kyoto")!;
    return {
      ...chop,
      status: isChopUnlocked(chop.id) ? "unlocked" : "locked",
    };
  }

  // Check if matches built-in Zermatt
  if (trip.id === "trip-swiss" || destLower.includes("zermatt") || destLower.includes("swiss")) {
    const chop = BASE_CHOPS.find((c) => c.id === "chop-zermatt")!;
    return {
      ...chop,
      status: isChopUnlocked(chop.id) ? "unlocked" : "locked",
    };
  }

  // Check if custom chop was already created in local storage
  const customChops = getCustomChops();
  const existing = customChops.find((c) => c.id === `chop-${trip.id}` || c.location.toLowerCase() === destLower);
  if (existing) {
    return {
      ...existing,
      status: isChopUnlocked(existing.id) ? "unlocked" : "locked",
    };
  }

  // Otherwise generate an authentic dynamic chop on the fly
  return generateDynamicChop(trip);
};

// Helper to register and unlock a chop when user completes ANY trip
export const completeAndUnlockTrip = (
  trip: { id: string; destination: string; dates: string; members?: { name: string }[] }
): TravelChopItem => {
  const chop = getChopForTrip(trip);
  // Persist custom chop if not already part of BASE_CHOPS
  if (!BASE_CHOPS.some((c) => c.id === chop.id)) {
    saveCustomChop({ ...chop, status: "unlocked" });
  }

  markTripCompleted(trip.id);
  unlockChopId(chop.id);
  return { ...chop, status: "unlocked" };
};
