// ============================================================================
// Itinerai Google & Global Places Autocomplete Service
// Searches places in destination and autofills category, address, time, cost & tips
// ============================================================================

import type { DayActivity } from "../components/itinerary/TripWorkspace";

export interface PlaceSearchResult {
  id: string;
  name: string;
  fullName: string;
  location: string;
  category: DayActivity["category"];
  period: "Morning" | "Afternoon" | "Evening";
  time: string;
  estimatedCost?: string;
  notes?: string;
  lat?: number;
  lng?: number;
  source: "google" | "places" | "curated";
}

// Curated high-fidelity destination landmarks with smart autofill presets
const CURATED_PLACES: PlaceSearchResult[] = [
  // --- KYOTO ---
  {
    id: "kyoto-fushimi",
    name: "Fushimi Inari-taisha Torii Gates",
    fullName: "Fushimi Inari-taisha, Fushimi Ward, Kyoto",
    location: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, 612-0882",
    category: "Culture",
    period: "Morning",
    time: "08:30 AM",
    estimatedCost: "Free",
    notes: "Hike the 10,000 vermilion torii gates early to avoid heavy tourist crowds. Wear comfortable walking shoes.",
    source: "curated",
  },
  {
    id: "kyoto-nishiki",
    name: "Nishiki Market Culinary Tour",
    fullName: "Nishiki Market, Nakagyo Ward, Kyoto",
    location: "Nakagyo Ward, Kyoto, 604-8055",
    category: "Food",
    period: "Afternoon",
    time: "12:30 PM",
    estimatedCost: "¥2,500 - ¥4,000 / person",
    notes: "Sample fresh seafood skewers, matcha dango, tamagoyaki, and artisanal tofu snacks. Most vendors prefer cash.",
    source: "curated",
  },
  {
    id: "kyoto-gion",
    name: "Gion District Evening Walking Tour & Tea Ceremony",
    fullName: "Gion District, Higashiyama Ward, Kyoto",
    location: "Gionmachi, Higashiyama Ward, Kyoto, 605-0074",
    category: "Culture",
    period: "Evening",
    time: "06:30 PM",
    estimatedCost: "¥3,500 / person",
    notes: "Traditional wooden machiya houses, geisha district, lantern-lit alleys along Shirakawa canal.",
    source: "curated",
  },
  {
    id: "kyoto-arashiyama",
    name: "Arashiyama Bamboo Grove & Tenryu-ji Temple",
    fullName: "Arashiyama Bamboo Grove, Ukyo Ward, Kyoto",
    location: "Sagaogurayama Tabuchiyamacho, Ukyo Ward, Kyoto, 616-8394",
    category: "Sightseeing",
    period: "Morning",
    time: "08:30 AM",
    estimatedCost: "¥500 / person",
    notes: "Serene morning walk through towering bamboo stalks and Zen rock garden overlooking Sogenchi pond.",
    source: "curated",
  },
  {
    id: "kyoto-kinkakuji",
    name: "Kinkaku-ji (The Golden Pavilion)",
    fullName: "Kinkaku-ji Temple, Kita Ward, Kyoto",
    location: "1 Kinkakujicho, Kita Ward, Kyoto, 603-8361",
    category: "Sightseeing",
    period: "Afternoon",
    time: "02:00 PM",
    estimatedCost: "¥500 / person",
    notes: "Gilded Zen Buddhist temple reflecting over the mirror pond. Visit in afternoon sunlight for golden reflections.",
    source: "curated",
  },
  {
    id: "kyoto-kiyomizu",
    name: "Kiyomizu-dera Wooden Stage & Higashiyama Walk",
    fullName: "Kiyomizu-dera Temple, Higashiyama Ward, Kyoto",
    location: "1-294 Kiyomizu, Higashiyama Ward, Kyoto, 605-0862",
    category: "Culture",
    period: "Morning",
    time: "09:30 AM",
    estimatedCost: "¥400 / person",
    notes: "Panoramic wooden terrace overlooking Kyoto valley. Drink from Otowa Waterfall for health or wisdom.",
    source: "curated",
  },
  {
    id: "kyoto-nijo",
    name: "Nijō Castle & Nightingale Floors",
    fullName: "Nijō Castle, Nakagyo Ward, Kyoto",
    location: "541 Nijojocho, Nakagyo Ward, Kyoto, 604-8301",
    category: "Culture",
    period: "Morning",
    time: "10:30 AM",
    estimatedCost: "¥1,030 / person",
    notes: "Shogun residence with famous 'chirping' security floors and imperial Ninomaru palace chambers.",
    source: "curated",
  },
  {
    id: "kyoto-philosopher",
    name: "Philosopher's Path & Silver Pavilion (Ginkaku-ji)",
    fullName: "Philosopher's Path, Sakyo Ward, Kyoto",
    location: "Tetsugaku-no-Michi, Sakyo Ward, Kyoto",
    category: "Adventure",
    period: "Morning",
    time: "10:00 AM",
    estimatedCost: "Free (Ginkaku-ji ¥500)",
    notes: "Stone canal path lined with cherry trees and traditional ceramic shops leading to Ginkaku-ji.",
    source: "curated",
  },
  {
    id: "kyoto-pontocho",
    name: "Pontocho Alley Izakaya & Dining",
    fullName: "Pontocho Alley, Nakagyo Ward, Kyoto",
    location: "Pontocho, Nakagyo Ward, Kyoto, 604-8016",
    category: "Food",
    period: "Evening",
    time: "07:30 PM",
    estimatedCost: "¥4,000 - ¥8,000 / person",
    notes: "Atmospheric narrow corridor with riverside kawayuka dining platforms over Kamogawa river.",
    source: "curated",
  },
  {
    id: "kyoto-ryoanji",
    name: "Ryōan-ji Zen Rock Garden",
    fullName: "Ryōan-ji Temple, Ukyo Ward, Kyoto",
    location: "13 Ryoanji Goryonoshitacho, Ukyo Ward, Kyoto, 616-8001",
    category: "Culture",
    period: "Afternoon",
    time: "03:30 PM",
    estimatedCost: "¥600 / person",
    notes: "Japan's most famous karesansui dry landscape rock garden containing 15 mysteriously arranged boulders.",
    source: "curated",
  },
  {
    id: "kyoto-ramen-sen",
    name: "Ramen Sen-no-Kaze Kyoto",
    fullName: "Ramen Sen-no-Kaze, Nakagyo Ward, Kyoto",
    location: "580 Nakanocho, Nakagyo Ward, Kyoto, 604-8042",
    category: "Food",
    period: "Afternoon",
    time: "01:00 PM",
    estimatedCost: "¥1,200 - ¥1,800",
    notes: "Acclaimed tonkotsu and seafood broth ramen with chashu. Ticket machine queue system.",
    source: "curated",
  },

  // --- TOKYO ---
  {
    id: "tokyo-sensoji",
    name: "Sensō-ji Temple & Nakamise-dori",
    fullName: "Sensō-ji Temple, Asakusa, Taito City, Tokyo",
    location: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032",
    category: "Culture",
    period: "Morning",
    time: "09:00 AM",
    estimatedCost: "Free",
    notes: "Tokyo's oldest Buddhist temple. Stroll through the Kaminarimon Thunder Gate and street stalls.",
    source: "curated",
  },
  {
    id: "tokyo-shibuya",
    name: "Shibuya Scramble Crossing & Sky View",
    fullName: "Shibuya Crossing, Shibuya City, Tokyo",
    location: "2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043",
    category: "Sightseeing",
    period: "Evening",
    time: "06:00 PM",
    estimatedCost: "¥2,200 (Shibuya Sky)",
    notes: "Iconic pedestrian crossing with neon billboards. Book Shibuya Sky tickets 2 weeks ahead for sunset.",
    source: "curated",
  },
  {
    id: "tokyo-teamlab",
    name: "teamLab Planets TOKYO Digital Art",
    fullName: "teamLab Planets, Koto City, Tokyo",
    location: "6 Chome-1-16 Toyosu, Koto City, Tokyo 135-0061",
    category: "Culture",
    period: "Afternoon",
    time: "02:30 PM",
    estimatedCost: "¥3,800 / person",
    notes: "Immersive barefoot body-interactive digital art museum. Wear pants that can be rolled above knees.",
    source: "curated",
  },

  // --- BALI ---
  {
    id: "bali-tegallalang",
    name: "Tegallalang Rice Terraces & Jungle Swing",
    fullName: "Tegallalang Rice Terrace, Ubud, Gianyar, Bali",
    location: "Jl. Raya Tegallalang, Gianyar, Bali 80561",
    category: "Sightseeing",
    period: "Morning",
    time: "08:00 AM",
    estimatedCost: "IDR 50,000 / person",
    notes: "Scenic cascading emerald rice terraces carved using traditional subak irrigation systems.",
    source: "curated",
  },
  {
    id: "bali-monkey-forest",
    name: "Sacred Monkey Forest Sanctuary Ubud",
    fullName: "Sacred Monkey Forest Sanctuary, Ubud, Bali",
    location: "Jl. Monkey Forest, Ubud, Gianyar, Bali 80571",
    category: "Adventure",
    period: "Morning",
    time: "10:30 AM",
    estimatedCost: "IDR 80,000 / person",
    notes: "Lush jungle sanctuary home to over 1,000 Balinese long-tailed macaques and ancient mossy temples.",
    source: "curated",
  },
  {
    id: "bali-uluwatu",
    name: "Uluwatu Cliff Temple & Sunset Kecak Dance",
    fullName: "Uluwatu Temple, Pecatu, South Kuta, Bali",
    location: "Pecatu, South Kuta, Badung Regency, Bali 80361",
    category: "Culture",
    period: "Evening",
    time: "05:30 PM",
    estimatedCost: "IDR 150,000 / person",
    notes: "Dramatic 70-meter limestone cliff overlooking the Indian Ocean with mesmerizing fire dance at sunset.",
    source: "curated",
  },

  // --- AMALFI COAST ---
  {
    id: "amalfi-positano",
    name: "Positano Cliffside Exploration & Spiaggia Grande",
    fullName: "Positano Spiaggia Grande, Salerno, Italy",
    location: "Via del Brigantino, 84017 Positano SA, Italy",
    category: "Sightseeing",
    period: "Morning",
    time: "09:30 AM",
    estimatedCost: "Free",
    notes: "Pastel colored houses cascading into the sea, boutique linen shops, and lemon sorbet stands.",
    source: "curated",
  },
  {
    id: "amalfi-path-gods",
    name: "Path of the Gods (Sentiero degli Dei) Cliff Hike",
    fullName: "Sentiero degli Dei, Bomerano to Nocelle, Amalfi Coast",
    location: "Piazza Paolo Capasso, 80051 Agerola NA, Italy",
    category: "Adventure",
    period: "Morning",
    time: "08:00 AM",
    estimatedCost: "Free",
    notes: "Spectacular 7.8km cliffside panoramic trail high above the Tyrrhenian Sea. Bring water and sunhat.",
    source: "curated",
  },
];

/**
 * Searches places matching user query, prioritizing the trip's destination.
 * Checks curated catalog first, then calls live OpenStreetMap Nominatim for global coverage.
 */
export async function searchPlaces(
  query: string,
  destination: string
): Promise<PlaceSearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return [];

  const destClean = destination.toLowerCase().split(",")[0].trim();

  // 1. Search curated database first (instant 0ms response)
  const curatedMatches = CURATED_PLACES.filter((p) => {
    const queryMatch =
      p.name.toLowerCase().includes(trimmed) ||
      p.location.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed);

    const destMatch =
      p.location.toLowerCase().includes(destClean) ||
      p.fullName.toLowerCase().includes(destClean);

    return queryMatch && (destMatch || trimmed.length >= 3);
  });

  // If we have 3 or more curated matches, return immediately for instant snappy UX
  if (curatedMatches.length >= 4) {
    return curatedMatches.slice(0, 6);
  }

  // 2. Fetch live global geocoding from OpenStreetMap Nominatim API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const searchQuery = `${trimmed}, ${destClean}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
      searchQuery
    )}&limit=5`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const liveResults: PlaceSearchResult[] = (data || []).map((item: any, idx: number) => {
        const rawType = (item.type || item.class || "").toLowerCase();
        const displayName = item.display_name || item.name || query;
        const nameParts = displayName.split(",");
        const primaryName = nameParts[0]?.trim() || query;
        const locationSnippet = nameParts.slice(1, 4).join(",").trim() || destination;

        // Categorize intelligently based on OpenStreetMap tags
        let category: DayActivity["category"] = "Sightseeing";
        let period: "Morning" | "Afternoon" | "Evening" = "Afternoon";
        let time = "02:00 PM";
        let cost = "Free";
        let notes = `Located in ${locationSnippet}.`;

        if (
          ["restaurant", "cafe", "fast_food", "bar", "pub", "bakery", "food_court"].includes(
            rawType
          )
        ) {
          category = "Food";
          period = "Evening";
          time = "07:00 PM";
          cost = "Moderate";
          notes = "Popular local food and dining spot. Reservations or off-peak visits advised.";
        } else if (
          ["hotel", "hostel", "guest_house", "motel", "apartment", "lodging"].includes(rawType)
        ) {
          category = "Stay";
          period = "Afternoon";
          time = "03:00 PM";
          notes = "Check-in time usually starts at 3:00 PM. Keep reservation confirmation handy.";
        } else if (
          [
            "museum",
            "temple",
            "monastery",
            "church",
            "shrine",
            "castle",
            "monument",
            "artwork",
          ].includes(rawType)
        ) {
          category = "Culture";
          period = "Morning";
          time = "10:00 AM";
          cost = "Admission fee may apply";
          notes = "Respect local photography rules and dress codes where applicable.";
        } else if (
          ["park", "forest", "hiking", "peak", "beach", "waterfall", "trail"].includes(rawType)
        ) {
          category = "Adventure";
          period = "Morning";
          time = "08:30 AM";
          cost = "Free";
          notes = "Scenic outdoor area. Check weather and wear proper footwear.";
        } else if (
          ["aeroway", "railway", "station", "subway", "ferry_terminal", "bus_station"].includes(
            rawType
          )
        ) {
          category = "Transit";
          period = "Morning";
          time = "09:00 AM";
          cost = "Transit fare";
        }

        return {
          id: `osm-${item.osm_id || idx}-${Date.now()}`,
          name: primaryName,
          fullName: displayName,
          location: locationSnippet,
          category,
          period,
          time,
          estimatedCost: cost,
          notes,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          source: "google" as const,
        };
      });

      // Merge curated matches on top of live results without duplicates
      const seenNames = new Set<string>();
      const combined: PlaceSearchResult[] = [];

      for (const item of [...curatedMatches, ...liveResults]) {
        const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!seenNames.has(key)) {
          seenNames.add(key);
          combined.push(item);
        }
      }

      return combined.slice(0, 6);
    }
  } catch {
    // Network fallback: return whatever curated matches we have
  }

  return curatedMatches.slice(0, 6);
}
