// ============================================================================
// Itinerai Hybrid Image Search Service
// Dynamically finds real online photos for any travel place via Wikipedia/Wikimedia
// with seamless fallback to curated category & destination photography.
// ============================================================================

import { getSpotImage } from "../components/chat/TripChatView";

// In-memory cache to prevent duplicate network calls across views and renders
const imageCache = new Map<string, string>();

// Generic broad geographic pages to ignore (avoid satellite maps of continents)
const IGNORED_BROAD_TITLES = new Set([
  "alps",
  "europe",
  "asia",
  "indonesia",
  "italy",
  "japan",
  "switzerland",
  "ocean",
  "earth",
  "world",
]);

/**
 * Searches online for an authentic photo of a place.
 * Returns the online image URL if found, or gracefully falls back to getSpotImage.
 */
export async function fetchOnlinePlaceImage(
  spotTitle: string,
  destination?: string,
  category?: string,
  index = 0,
  fallbackImage?: string
): Promise<string> {
  const cacheKey = `${spotTitle.toLowerCase()}_${(destination || "").toLowerCase()}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // Clean title: remove parentheticals like "(Findeln)", "(Positano)", "(Ubud)"
  const cleanTitle = spotTitle.replace(/\s*\([^)]*\)/g, "").trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800); // Fast 1.8s timeout

    // Search Wikipedia with clean title and destination
    const query = cleanTitle.length > 3 ? cleanTitle : `${cleanTitle} ${destination || ""}`.trim();
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=2&prop=pageimages&piprop=thumbnail&pithumbsize=600&format=json&origin=*`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Api-User-Agent": "ItinerAI/1.0 (https://itinerai.app; hello@itinerai.app)",
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const pages = data?.query?.pages || {};

      for (const pageId in pages) {
        const page = pages[pageId];
        const pageTitle = (page?.title || "").toLowerCase();
        const thumbSrc = page?.thumbnail?.source;

        // Skip generic continent or territory pages
        if (IGNORED_BROAD_TITLES.has(pageTitle)) continue;

        // Skip SVGs, flags, or map diagrams
        if (
          thumbSrc &&
          !thumbSrc.includes(".svg") &&
          !thumbSrc.includes("location_map") &&
          !thumbSrc.includes("flag_of")
        ) {
          imageCache.set(cacheKey, thumbSrc);
          return thumbSrc;
        }
      }
    }
  } catch {
    // Network error or timeout: seamlessly drop to fallback
  }

  // Hybrid fallback: use category and destination aware image
  const fallback = getSpotImage(spotTitle, destination, fallbackImage, category, index);
  imageCache.set(cacheKey, fallback);
  return fallback;
}
