// ============================================================================
// Itinerai Route Transit & Sequence Optimizer
// Provides spatial transit calculations, route efficiency scoring, and 1-click sequence optimization
// ============================================================================

import type { DayActivity } from "../components/itinerary/TripWorkspace";

export interface TransitLeg {
  fromActivityId: string;
  toActivityId: string;
  fromTitle: string;
  toTitle: string;
  durationMinutes: number;
  distanceKm: number;
  mode: "Walk" | "Subway" | "Train" | "Bus" | "Taxi" | "Ferry";
  note?: string;
}

export interface DayRouteStats {
  totalTransitMinutes: number;
  totalDistanceKm: number;
  efficiencyScore: number; // 0 to 100
  isOptimized: boolean;
  timeSavedMinutes: number;
  legs: TransitLeg[];
  suggestedOptimizationReason?: string;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

// Known landmarks coordinates dictionary for precise transit simulation
const KNOWN_LANDMARKS: Record<string, GeoPoint> = {
  // Kyoto
  "fushimi inari": { lat: 34.9671, lng: 135.7727 },
  "nishiki market": { lat: 35.005, lng: 135.7649 },
  gion: { lat: 35.0037, lng: 135.7772 },
  arashiyama: { lat: 35.0116, lng: 135.6777 },
  "tenryu-ji": { lat: 35.0158, lng: 135.6776 },
  "kinkaku-ji": { lat: 35.0394, lng: 135.7292 },
  "golden pavilion": { lat: 35.0394, lng: 135.7292 },
  "kiyomizu-dera": { lat: 34.9949, lng: 135.785 },
  higashiyama: { lat: 34.998, lng: 135.782 },
  "kyoto station": { lat: 34.9858, lng: 135.7588 },

  // Bali
  seminyak: { lat: -8.6913, lng: 115.1682 },
  canggu: { lat: -8.6478, lng: 115.1385 },
  ubud: { lat: -8.5069, lng: 115.2625 },
  "rice terrace": { lat: -8.4325, lng: 115.2792 },
  tegallalang: { lat: -8.4325, lng: 115.2792 },
  "mount batur": { lat: -8.2424, lng: 115.3753 },
  kintamani: { lat: -8.2424, lng: 115.3753 },
  uluwatu: { lat: -8.8291, lng: 115.0849 },
  sanur: { lat: -8.6705, lng: 115.2625 },
  kuta: { lat: -8.7233, lng: 115.1723 },

  // Amalfi Coast
  positano: { lat: 40.6281, lng: 14.485 },
  amalfi: { lat: 40.634, lng: 14.6027 },
  ravello: { lat: 40.6491, lng: 14.6121 },
  capri: { lat: 40.5507, lng: 14.2426 },
  sorrento: { lat: 40.6263, lng: 14.3758 },

  // Zermatt / Alps
  zermatt: { lat: 45.9763, lng: 7.7491 },
  gornergrat: { lat: 45.9837, lng: 7.7844 },
  matterhorn: { lat: 45.9383, lng: 7.7297 },
  sunnegga: { lat: 46.015, lng: 7.778 },
  "glacier paradise": { lat: 45.9383, lng: 7.7297 },
};

// Deterministic string hash for consistent fallback coordinates
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Resolve coordinates for an activity
export const getActivityCoordinates = (activity: DayActivity): GeoPoint => {
  const query = `${activity.title} ${activity.location}`.toLowerCase();

  for (const [key, point] of Object.entries(KNOWN_LANDMARKS)) {
    if (query.includes(key)) {
      return point;
    }
  }

  // Fallback: Generate clustered coordinates based on location hash
  const h1 = hashString(activity.location || "center");
  const h2 = hashString(activity.title || "spot");

  // Center around 35.0 (temperate latitude) with tight realistic variance (~3-8 km)
  const baseLat = 35.0 + ((h1 % 100) - 50) * 0.002;
  const baseLng = 135.7 + ((h2 % 100) - 50) * 0.002;

  return { lat: baseLat, lng: baseLng };
};

// Haversine formula to compute great-circle distance in kilometers
export const computeHaversineDistance = (p1: GeoPoint, p2: GeoPoint): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const rawDist = R * c;
  // Apply 1.25 road curvature winding factor
  return Math.max(0.4, Number((rawDist * 1.25).toFixed(1)));
};

// Calculate transit leg between two activities
export const calculateTransitLeg = (actA: DayActivity, actB: DayActivity): TransitLeg => {
  const p1 = getActivityCoordinates(actA);
  const p2 = getActivityCoordinates(actB);
  const dist = computeHaversineDistance(p1, p2);

  let mode: TransitLeg["mode"] = "Walk";
  let duration = Math.round(dist * 13); // ~13 mins per km walking
  let note: string | undefined;

  const combinedLoc = `${actA.location} ${actB.location}`.toLowerCase();

  if (combinedLoc.includes("capri") || combinedLoc.includes("island")) {
    mode = "Ferry";
    duration = Math.max(25, Math.round(dist * 2.8 + 15));
    note = "High-speed hydrofoil ferry";
  } else if (dist <= 1.2) {
    mode = "Walk";
    duration = Math.max(5, Math.round(dist * 12));
    note = "Pleasant scenic walk";
  } else if (dist <= 6.5) {
    mode = "Subway";
    duration = Math.max(10, Math.round(5 + dist * 2.2));
    note = "Direct transit line";
  } else if (dist <= 18) {
    mode = "Train";
    duration = Math.max(18, Math.round(8 + dist * 1.8));
    note = "Regional railway / Express";
  } else {
    mode = "Taxi";
    duration = Math.max(25, Math.round(10 + dist * 1.6));
    note = "Recommended rideshare / cab";
  }

  return {
    fromActivityId: actA.id,
    toActivityId: actB.id,
    fromTitle: actA.title,
    toTitle: actB.title,
    durationMinutes: duration,
    distanceKm: dist,
    mode,
    note,
  };
};

// Compute route stats for all activities in a day
export const calculateDayRouteStats = (activities: DayActivity[]): DayRouteStats => {
  if (activities.length <= 1) {
    return {
      totalTransitMinutes: 0,
      totalDistanceKm: 0,
      efficiencyScore: 100,
      isOptimized: true,
      timeSavedMinutes: 0,
      legs: [],
    };
  }

  const legs: TransitLeg[] = [];
  let totalDistance = 0;
  let totalTransit = 0;

  for (let i = 0; i < activities.length - 1; i++) {
    const leg = calculateTransitLeg(activities[i], activities[i + 1]);
    legs.push(leg);
    totalDistance += leg.distanceKm;
    totalTransit += leg.durationMinutes;
  }

  // Calculate theoretical optimal order using Nearest-Neighbor heuristic
  const optimizedActivities = optimizeDayActivities(activities);
  let optDistance = 0;
  let optTransit = 0;

  for (let i = 0; i < optimizedActivities.length - 1; i++) {
    const leg = calculateTransitLeg(optimizedActivities[i], optimizedActivities[i + 1]);
    optDistance += leg.distanceKm;
    optTransit += leg.durationMinutes;
  }

  const timeSaved = Math.max(0, totalTransit - optTransit);
  const distanceSaved = Math.max(0, totalDistance - optDistance);

  // Efficiency score: 100% if already optimal, degraded by distance excess
  let efficiencyScore = 95;
  if (timeSaved > 8 || distanceSaved > 2) {
    efficiencyScore = Math.max(62, Math.min(88, Math.round((optTransit / Math.max(1, totalTransit)) * 100)));
  } else {
    efficiencyScore = Math.min(98, 92 + Math.min(6, activities.length));
  }

  const isOptimized = timeSaved < 8;

  let suggestedOptimizationReason: string | undefined;
  if (!isOptimized) {
    suggestedOptimizationReason = `Reordering reduces zigzag transit by ${timeSaved} mins (${distanceSaved.toFixed(1)} km saved)`;
  }

  return {
    totalTransitMinutes: Math.round(totalTransit),
    totalDistanceKm: Number(totalDistance.toFixed(1)),
    efficiencyScore,
    isOptimized,
    timeSavedMinutes: Math.round(timeSaved),
    legs,
    suggestedOptimizationReason,
  };
};

// Nearest-Neighbor Traveling Salesperson clustering to reorder activities chronologically
export const optimizeDayActivities = (activities: DayActivity[]): DayActivity[] => {
  if (activities.length <= 2) return [...activities];

  const unvisited = [...activities];
  // Keep the first morning activity or starting point as origin
  const origin = unvisited.shift()!;
  const ordered: DayActivity[] = [origin];

  let current = origin;
  while (unvisited.length > 0) {
    const currentCoord = getActivityCoordinates(current);
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const candidateCoord = getActivityCoordinates(unvisited[i]);
      const d = computeHaversineDistance(currentCoord, candidateCoord);
      if (d < shortestDist) {
        shortestDist = d;
        nearestIdx = i;
      }
    }

    const nextSpot = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(nextSpot);
    current = nextSpot;
  }

  // Adjust standard timeline times and periods for the reordered sequence
  const timeSlots = [
    { time: "09:00 AM", period: "Morning" as const },
    { time: "11:30 AM", period: "Morning" as const },
    { time: "01:30 PM", period: "Afternoon" as const },
    { time: "04:00 PM", period: "Afternoon" as const },
    { time: "06:30 PM", period: "Evening" as const },
    { time: "08:30 PM", period: "Evening" as const },
  ];

  return ordered.map((act, index) => {
    const slot = timeSlots[Math.min(index, timeSlots.length - 1)];
    return {
      ...act,
      time: slot.time,
      period: slot.period,
    };
  });
};
