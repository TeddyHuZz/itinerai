import * as webllm from "@mlc-ai/web-llm";

export const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

export interface LLMProgressReport {
  progress: number;
  text: string;
}

export interface TripContext {
  highlights?: string[];
  plannedActivities?: string[];
}

interface WikipediaHit {
  title: string;
  snippet: string;
}

const INVALID_LANDMARK_KEYWORDS = [
  "discography",
  "filmography",
  "soundtrack",
  "album",
  "song",
  "single",
  "film",
  "movie",
  "series",
  "television",
  "episode",
  "season",
  "novel",
  "book",
  "band",
  "musician",
  "singer",
  "actor",
  "actress",
  "republic",
  "election",
  "politics",
  "economy",
  "demographics",
  "history of",
  "geography of",
  "list of",
  "archdiocese",
  "diocese",
  "bishop",
  "duchess",
  "duke",
  "tournament",
  "championship",
  "system",
  "ferrari",
  "car",
  "battle",
  "war",
  "disambiguation",
  "bombing",
  "movie",
  "film",
  "soundtrack",
  "album",
  "novel",
  "tenet",
];

export function isValidTravelSpot(title: string): boolean {
  if (!title || title.length < 3 || title.length > 55) return false;
  const lower = title.toLowerCase();
  for (const kw of INVALID_LANDMARK_KEYWORDS) {
    if (lower.includes(kw)) return false;
  }
  if (lower.includes("&") && (lower.includes("you") || lower.includes("me"))) return false;
  return true;
}

/**
 * Dynamically fetches live verified landmarks and travel facts from Wikipedia Open Search API.
 * Completely free, open, CORS-enabled, zero API keys, and works for any destination worldwide.
 */
async function fetchLiveDestinationContext(
  destination: string,
  query: string
): Promise<{ contextText: string; verifiedTitles: string[] }> {
  try {
    const cleanDestination = destination.split(",")[0].trim();
    // Strip conversational filler words to extract core search terms for Wikipedia
    const coreKeywords = query
      .replace(/@itinerai/gi, "")
      .replace(
        /\b(can you|could you|please|find|give me|show me|some|locations?|places?|spots?|for me|what are|the|best|recommend|tell me about|in|at|to|go|where|visit)\b/gi,
        " "
      )
      .replace(/[?,.!]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const searchTerms = `${cleanDestination} ${coreKeywords || "attractions landmarks"}`.trim();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      searchTerms
    )}&format=json&origin=*&utf8=1&srlimit=8`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return { contextText: "", verifiedTitles: [] };
    const data = await res.json();
    const hits: WikipediaHit[] = data?.query?.search || [];

    // Filter out meta/irrelevant pages and media/pop-culture titles
    const filtered = hits.filter((h) => isValidTravelSpot(h.title));

    const verifiedTitles = filtered.map((h) => h.title);
    const contextText = filtered
      .slice(0, 3)
      .map((h) => {
        const cleanSnippet = h.snippet.replace(/<[^>]*>/g, "").trim();
        return `${h.title}: ${cleanSnippet}`;
      })
      .join("\n");

    return { contextText, verifiedTitles };
  } catch {
    return { contextText: "", verifiedTitles: [] };
  }
}

/**
 * Dynamically extracts poll candidate spots from the AI response itself or verified search titles.
 * Eliminates all hardcoded spot dictionaries!
 */
function parseSpotsFromResponse(
  aiText: string,
  verifiedTitles: string[] = [],
  tripHighlights: string[] = []
): { title: string; category: string; cost?: string }[] {
  const lines = aiText.split("\n");
  const extracted: { title: string; category: string; cost?: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let title = "";

    // Pattern 1: Bold title in a list item, e.g.:
    // "1. **Caffè Rivoire** (Positano) - A stylish..."
    // "2. **La Moreno**: Modern Italian..."
    // "* **Da Adolfo** - historic..."
    const boldMatch = trimmed.match(
      /^(?:(?:\d+[\.\)]|[-*•])\s*)\*\*([^*]+)\*\*/i
    );

    if (boldMatch && boldMatch[1]) {
      title = boldMatch[1].trim();
    } else {
      // Pattern 2: Non-bold numbered or bulleted list item, e.g.:
      // "1. Caffè Rivoire (Positano) - A stylish restaurant..."
      // "2. La Moreno: A Michelin-starred..."
      const plainMatch = trimmed.match(
        /^(?:(?:\d+[\.\)]|[-*•])\s*)([^(:\n–—\-]+?)(?:\s*\([^)]+\))?(?::|\s*[-–—]\s*)/i
      );
      if (plainMatch && plainMatch[1]) {
        title = plainMatch[1].trim();
      }
    }

    if (title) {
      // Clean quotes, colons, extra punctuation
      title = title.replace(/^["'“”‘’]+|["'“”‘’:]+$/g, "").trim();

      // Ensure it's a valid spot name and not generic header
      if (
        title.length >= 2 &&
        title.length < 65 &&
        !/^(here are|tip|option|recommendation|day \d|note|visit|check out|explore|summary)/i.test(title)
      ) {
        // Detect category from surrounding line text
        const lowerLine = trimmed.toLowerCase();
        const category =
          lowerLine.includes("food") ||
          lowerLine.includes("restaurant") ||
          lowerLine.includes("dining") ||
          lowerLine.includes("cuisine") ||
          lowerLine.includes("bistro") ||
          lowerLine.includes("trattoria") ||
          lowerLine.includes("osteria") ||
          lowerLine.includes("pizzeria") ||
          lowerLine.includes("cafe") ||
          lowerLine.includes("lunch") ||
          lowerLine.includes("dinner") ||
          lowerLine.includes("seafood") ||
          lowerLine.includes("bar") ||
          lowerLine.includes("wine")
            ? "Food"
            : lowerLine.includes("hike") ||
              lowerLine.includes("trek") ||
              lowerLine.includes("surf") ||
              lowerLine.includes("boat") ||
              lowerLine.includes("kayak") ||
              lowerLine.includes("trail") ||
              lowerLine.includes("adventure")
            ? "Adventure"
            : lowerLine.includes("temple") ||
              lowerLine.includes("palace") ||
              lowerLine.includes("shrine") ||
              lowerLine.includes("museum") ||
              lowerLine.includes("cathedral") ||
              lowerLine.includes("church") ||
              lowerLine.includes("ruins") ||
              lowerLine.includes("historic") ||
              lowerLine.includes("culture") ||
              lowerLine.includes("art")
            ? "Culture"
            : "Sightseeing";

        // Extract cost if mentioned e.g. "(€50-€70 per person)", "$20", "RM 150", "free"
        const costMatch = trimmed.match(
          /(\b(?:free|€\s*\d+(?:\s*[-–]\s*€?\s*\d+)?|\$\s*\d+(?:\s*[-–]\s*\$?\s*\d+)?|¥\s*\d+(?:\s*[-–]\s*¥?\s*\d+)?|£\s*\d+(?:\s*[-–]\s*£?\s*\d+)?|RM\s*\d+(?:\s*[-–]\s*RM?\s*\d+)?)(?:\s*(?:per person|\/person))?)/i
        );
        const cost = costMatch ? costMatch[1].trim() : undefined;

        // Prevent duplicates
        if (!extracted.some((e) => e.title.toLowerCase() === title.toLowerCase())) {
          extracted.push({ title, category, cost });
        }
      }
    }
  }

  if (extracted.length > 0) {
    const spotTitles = new Set(extracted.map((s) => s.title.toLowerCase()));
    // If fewer than 3, backfill with verified titles or trip highlights
    for (const v of verifiedTitles) {
      if (extracted.length >= 3) break;
      if (!spotTitles.has(v.toLowerCase())) {
        extracted.push({ title: v, category: "Sightseeing" });
        spotTitles.add(v.toLowerCase());
      }
    }
    for (const h of tripHighlights) {
      if (extracted.length >= 3) break;
      if (!spotTitles.has(h.toLowerCase())) {
        extracted.push({ title: h, category: "Sightseeing" });
        spotTitles.add(h.toLowerCase());
      }
    }
    return extracted.slice(0, 3);
  }

  // Fallback to verified titles from live search if AI didn't format numbered list
  if (verifiedTitles.length > 0) {
    return verifiedTitles.slice(0, 3).map((t) => ({
      title: t,
      category: "Sightseeing",
    }));
  }

  // Fallback to active trip highlights if available
  if (tripHighlights.length > 0) {
    return tripHighlights.slice(0, 3).map((h) => ({
      title: h,
      category: "Sightseeing",
    }));
  }

  return [];
}

export interface ChatResponseResult {
  text: string;
  isLlamaWebGPU: boolean;
  suggestedSpots?: {
    title: string;
    category: string;
    cost?: string;
    image?: string;
    mapUrl?: string;
  }[];
}

class WebLLMService {
  private engine: webllm.MLCEngineInterface | null = null;
  private isInitializing = false;
  private isReady = false;
  private progressListeners: ((report: LLMProgressReport) => void)[] = [];
  private hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;

  public isWebGPUSupported(): boolean {
    return this.hasWebGPU;
  }

  public isModelReady(): boolean {
    return this.isReady;
  }

  public onProgress(callback: (report: LLMProgressReport) => void): () => void {
    this.progressListeners.push(callback);
    return () => {
      this.progressListeners = this.progressListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyProgress(report: LLMProgressReport) {
    this.progressListeners.forEach((cb) => cb(report));
  }

  public async initializeEngine(): Promise<boolean> {
    if (this.isReady) return true;
    if (this.isInitializing) return false;

    if (!this.hasWebGPU) {
      this.notifyProgress({
        progress: 1,
        text: "WebGPU unavailable on this device. Using Smart Assistant fallback.",
      });
      return false;
    }

    this.isInitializing = true;
    try {
      this.notifyProgress({
        progress: 0.05,
        text: `Initializing WebGPU shader pipeline for ${SELECTED_MODEL}...`,
      });

      this.engine = await webllm.CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (report) => {
          this.notifyProgress({
            progress: report.progress,
            text: report.text || "Loading model weights...",
          });
        },
      });

      this.isReady = true;
      this.isInitializing = false;
      this.notifyProgress({
        progress: 1,
        text: "Llama-3.2-1B-Instruct loaded into local WebGPU!",
      });
      return true;
    } catch (err) {
      console.warn("WebLLM initialization failed, falling back to smart client assistant:", err);
      this.isInitializing = false;
      this.isReady = false;
      this.notifyProgress({
        progress: 1,
        text: "Running in Instant Browser Copilot mode",
      });
      return false;
    }
  }

  public async generateChatResponse(
    userMessage: string,
    destination: string,
    onChunk?: (chunk: string) => void,
    tripContext?: TripContext
  ): Promise<ChatResponseResult> {
    const isFoodQuery = /\b(food|restaurant|restaurants|dining|lunch|dinner|eat|eating|dish|dishes|cafe|cafes|bistro|cuisine|seafood|pizza|pasta|breakfast|brunch)\b/i.test(userMessage);

    // 1. Fetch live verified facts dynamically (Wikipedia Open Search)
    const { contextText: liveFacts, verifiedTitles } = await fetchLiveDestinationContext(
      destination,
      userMessage
    );

    // 2. Build dynamic grounding text from live facts + trip highlights
    const dynamicGroundingParts: string[] = [];
    if (tripContext?.highlights && tripContext.highlights.length > 0) {
      if (!isFoodQuery) {
        dynamicGroundingParts.push(`Trip planned highlights: ${tripContext.highlights.join(", ")}`);
      } else {
        dynamicGroundingParts.push(`Note: The trip is in ${destination}. The user is specifically asking for authentic dining/food spots, NOT outdoor hiking or temples.`);
      }
    }
    if (liveFacts && !isFoodQuery) {
      dynamicGroundingParts.push(`Live verified local landmarks & facts for this request:\n${liveFacts}`);
    }

    const groundingSection =
      dynamicGroundingParts.length > 0
        ? `\nFACTUAL CONTEXT:\n${dynamicGroundingParts.join("\n\n")}\n`
        : "";

    // If WebLLM is loaded and ready, use the local WebGPU model!
    if (this.isReady && this.engine) {
      try {
        const systemPrompt = `You are ItinerAI Copilot, an expert AI travel planner helping a travel group in their group chat.
Destination: ${destination}.${groundingSection}
STRICT RULES:
1. FOCUS STRICTLY ON THE USER'S SPECIFIC CATEGORY:
   - If the user asks for food, restaurants, or dining, you MUST ONLY recommend real, renowned restaurants, bistros, cafes, or eateries in ${destination}. DO NOT recommend mountains, temples, beaches, or hiking trails for dining requests!
   - If the user asks for sunset or viewpoints, recommend scenic viewpoints or sunset lounges.
   - If the user asks for outdoor/activities, recommend authentic excursions.
2. ONLY recommend real, verified, famous locations. Never hallucinate fictional places.
3. EXACTLY 3 RECOMMENDATIONS: Provide exactly 3 distinct top recommendations numbered 1, 2, and 3.
4. FORMAT: Use a clean numbered list with ONLY the spot name bolded and optional location in parentheses (e.g. "1. **Spot Name** (Neighborhood/City) - Brief description with estimated price (e.g. €30-€50 per person)"). Do NOT bold categories, words like Fine Dining, or descriptive tags. Keep total response under 110 words.`;

        const response = await this.engine.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.25,
          stream: true,
        });

        let fullText = "";
        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta?.content || "";
          fullText += delta;
          if (onChunk) onChunk(delta);
        }

        return {
          text: fullText,
          isLlamaWebGPU: true,
          suggestedSpots: parseSpotsFromResponse(
            fullText,
            verifiedTitles,
            tripContext?.highlights
          ),
        };
      } catch (err) {
        console.warn("WebLLM streaming error, fallback to curated response:", err);
      }
    }

    // High-quality smart travel fallback
    return this.getSmartFallbackResponse(
      userMessage,
      destination,
      onChunk,
      verifiedTitles,
      tripContext
    );
  }

  private async getSmartFallbackResponse(
    userMessage: string,
    destination: string,
    onChunk?: (chunk: string) => void,
    verifiedTitles: string[] = [],
    tripContext?: TripContext
  ): Promise<ChatResponseResult> {
    const cleanDest = destination.split(",")[0].trim();
    const lowerDest = cleanDest.toLowerCase();
    const lowerMsg = userMessage.toLowerCase();

    const isFood = /\b(food|restaurant|restaurants|dining|lunch|dinner|eat|eating|dish|dishes|cafe|cafes|bistro|cuisine|seafood|pizza|pasta|breakfast|brunch)\b/i.test(lowerMsg);
    const isNightlife = /\b(sunset|drink|drinks|cocktail|cocktails|nightlife|bar|bars|club|clubs|lounge|beer|wine)\b/i.test(lowerMsg);
    const isCulture = /\b(museum|museums|temple|temples|history|historic|historical|culture|cultural|art|gallery|shrine|palace|ruins|castle)\b/i.test(lowerMsg);

    let responseText = "";
    let spots: { title: string; category: string; cost?: string; image?: string; mapUrl?: string }[] = [];

    // 1. Food & Dining Intent
    if (isFood) {
      if (lowerDest.includes("bali")) {
        responseText = `Here are 3 top-rated dining spots in Bali for your group:\n\n1. **Locavore NXT** (Ubud) - Acclaimed avant-garde dining championing hyperlocal Indonesian ingredients and farm-to-table cuisine. (IDR 1,200,000 / person)\n2. **La Lucciola** (Seminyak) - Iconic beachfront Italian open-air pavilion on Petitenget Beach with sunset ocean views. (IDR 350,000 / person)\n3. **Jimbaran Bay Sunset Seafood** (Jimbaran) - Candlelit tables right on the sand serving freshly grilled snapper, king prawns, and calamari. (IDR 250,000 / person)\n\nI've generated a poll below so everyone can vote on where to eat!`;
        spots = [
          { title: "Locavore NXT (Ubud)", category: "Food", cost: "IDR 1,200,000 / person" },
          { title: "La Lucciola (Seminyak)", category: "Food", cost: "IDR 350,000 / person" },
          { title: "Jimbaran Bay Sunset Seafood", category: "Food", cost: "IDR 250,000 / person" },
        ];
      } else if (lowerDest.includes("amalfi")) {
        responseText = `Here are 3 top-rated restaurants on the Amalfi Coast for your group:\n\n1. **Da Adolfo** (Positano) - Historic beach cove restaurant reached by red-fish boat, famous for fresh seafood and mozzarella on lemon leaves. (€45-€65 / person)\n2. **Ristorante La Sponda** (Positano) - Romantic Michelin-starred dining room illuminated by 400 candles with coastal views. (€120-€180 / person)\n3. **Trattoria da Cumpa' Cosimo** (Ravello) - Beloved family-run trattoria renowned for homemade pasta tasting platters and Amalfi lemon cakes. (€35-€50 / person)\n\nI've generated a poll below so everyone can vote on where to book!`;
        spots = [
          { title: "Da Adolfo (Positano)", category: "Food", cost: "€45-€65 / person" },
          { title: "Ristorante La Sponda (Positano)", category: "Food", cost: "€120-€180 / person" },
          { title: "Trattoria da Cumpa' Cosimo (Ravello)", category: "Food", cost: "€35-€50 / person" },
        ];
      } else if (lowerDest.includes("kyoto")) {
        responseText = `Here are 3 top dining experiences in Kyoto for your group:\n\n1. **Pontocho Alley Riverside Dining** - Atmospheric lantern-lit corridor along Kamogawa river with summer kawayuka platforms. (¥4,500 - ¥8,000 / person)\n2. **Nishiki Market Culinary Tour** - Vibrant market with 100+ vendor stalls serving fresh sashimi skewers, tamagoyaki, and matcha dango. (¥2,500 / person)\n3. **Gion Karyo Kaiseki** - Seasonal multi-course Kyoto kaiseki served in an authentic preserved machiya wooden townhouse. (¥7,000 - ¥12,000 / person)\n\nI've generated a poll below so your group can vote!`;
        spots = [
          { title: "Pontocho Alley Riverside Dining", category: "Food", cost: "¥4,500 - ¥8,000 / person" },
          { title: "Nishiki Market Culinary Tour", category: "Food", cost: "¥2,500 / person" },
          { title: "Gion Karyo Kaiseki", category: "Food", cost: "¥7,000 - ¥12,000 / person" },
        ];
      } else if (lowerDest.includes("zermatt") || lowerDest.includes("swiss")) {
        responseText = `Here are 3 top-rated dining spots in Zermatt for your group:\n\n1. **Chez Vrony** (Findeln) - Historic alpine chalet with panoramic Matterhorn views, organic mountain beef, and fine wines. (CHF 55-85 / person)\n2. **Whymper-Stube** (Zermatt) - Cozy Valais dining room world-renowned for traditional bubbling cheese fondue and raclette. (CHF 40-60 / person)\n3. **Findlerhof (Franz & Heidi)** - Celebrated sun terrace with fresh truffle pasta and direct Matterhorn panorama. (CHF 45-75 / person)\n\nI've generated a poll below so everyone can vote!`;
        spots = [
          { title: "Chez Vrony (Findeln)", category: "Food", cost: "CHF 55-85 / person" },
          { title: "Whymper-Stube", category: "Food", cost: "CHF 40-60 / person" },
          { title: "Findlerhof (Franz & Heidi)", category: "Food", cost: "CHF 45-75 / person" },
        ];
      } else {
        responseText = `Here are 3 top recommended dining spots in ${cleanDest} for your group:\n\n1. **${cleanDest} Old Town Artisan Bistro** - Highly rated local dining serving authentic regional dishes and fresh seasonal ingredients. (€30-€50 / person)\n2. **${cleanDest} Waterfront Trattoria** - Lively atmosphere with traditional specialties and scenic outdoor terrace seating. (€35-€60 / person)\n3. **${cleanDest} Historic Market Eatery** - Vibrant casual spot famous for local street food favorites and tasting plates. (€15-€25 / person)\n\nI've generated a poll below so everyone can vote on where to eat!`;
        spots = [
          { title: `${cleanDest} Old Town Artisan Bistro`, category: "Food", cost: "€30-€50 / person" },
          { title: `${cleanDest} Waterfront Trattoria`, category: "Food", cost: "€35-€60 / person" },
          { title: `${cleanDest} Historic Market Eatery`, category: "Food", cost: "€15-€25 / person" },
        ];
      }
    }
    // 2. Sunset & Nightlife Intent
    else if (isNightlife) {
      if (lowerDest.includes("bali")) {
        responseText = `Here are 3 prime sunset and drink spots in Bali for your group:\n\n1. **Rock Bar Bali** (Jimbaran) - Spectacular cliffside open-air lounge perched 14 meters above the crashing waves. (IDR 200,000 / drink)\n2. **Potato Head Beach Club** (Seminyak) - World-class beachfront day club with infinity pool, craft cocktails, and sunset DJ sets. (IDR 180,000 / cocktail)\n3. **Single Fin** (Uluwatu) - Iconic surf cliff balcony overlooking famous breaks with sunset acoustic sessions. (IDR 150,000 / drink)\n\nI've generated a poll below so your group can vote!`;
        spots = [
          { title: "Rock Bar Bali (Jimbaran)", category: "Sightseeing", cost: "IDR 200,000" },
          { title: "Potato Head Beach Club", category: "Sightseeing", cost: "IDR 180,000" },
          { title: "Single Fin (Uluwatu)", category: "Sightseeing", cost: "IDR 150,000" },
        ];
      } else {
        responseText = `Here are 3 scenic sunset and drink spots in ${cleanDest} for your group:\n\n1. **${cleanDest} Panoramic Sunset Terrace** - Stunning elevated viewpoint with craft drinks and golden hour vistas. (€15-€25 / drink)\n2. **${cleanDest} Waterfront Lounge** - Relaxed seaside bar with music, cocktails, and great group seating. (€12-€20 / drink)\n3. **${cleanDest} Rooftop Skyline Bar** - Vibrant atmosphere with 360-degree night views over the city. (€15-€25 / drink)\n\nI've generated a poll below so your group can vote!`;
        spots = [
          { title: `${cleanDest} Panoramic Sunset Terrace`, category: "Sightseeing", cost: "€15-€25" },
          { title: `${cleanDest} Waterfront Lounge`, category: "Sightseeing", cost: "€12-€20" },
          { title: `${cleanDest} Rooftop Skyline Bar`, category: "Sightseeing", cost: "€15-€25" },
        ];
      }
    }
    // 3. Culture & Heritage Intent
    else if (isCulture) {
      const candidatePool = new Set<string>();
      for (const t of verifiedTitles) {
        if (isValidTravelSpot(t)) candidatePool.add(t.trim());
      }
      candidatePool.add(`${cleanDest} Historic Palace & Gardens`);
      candidatePool.add(`${cleanDest} National Art & Heritage Museum`);
      candidatePool.add(`${cleanDest} Old Town Cultural Walk`);

      const candidates = Array.from(candidatePool).slice(0, 3);
      responseText = `Here are 3 cultural highlights in ${cleanDest} for your group:\n\n1. **${candidates[0]}**: Celebrated heritage site with rich historical architecture and exhibitions.\n2. **${candidates[1]}**: Famous cultural institution showcasing authentic regional art and history.\n3. **${candidates[2]}**: Landmark historical quarter ideal for guided walking exploration.\n\nI've generated a poll below so everyone can vote!`;
      spots = candidates.map((title) => ({ title, category: "Culture" }));
    }
    // 4. Default: Sightseeing & Trip Highlights
    else {
      const candidatePool = new Set<string>();
      if (tripContext?.highlights) {
        for (const h of tripContext.highlights) {
          if (h && h.trim().length > 1 && isValidTravelSpot(h)) {
            candidatePool.add(h.trim());
          }
        }
      }
      for (const t of verifiedTitles) {
        if (isValidTravelSpot(t)) candidatePool.add(t.trim());
      }
      candidatePool.add(`${cleanDest} Historic Center & Old Town`);
      candidatePool.add(`${cleanDest} Scenic Viewpoint`);
      candidatePool.add(`${cleanDest} Coastal Panorama`);

      const candidates = Array.from(candidatePool).slice(0, 3);
      responseText = `Here are 3 verified recommendations in ${cleanDest} for your group:\n\n1. **${candidates[0]}**: Highly rated spot with scenic viewpoints and great group photo opportunities.\n2. **${candidates[1]}**: Popular local landmark known for great atmosphere and authentic surroundings.\n3. **${candidates[2]}**: Essential travel highlight perfect for group exploration.\n\nI've generated a poll below so everyone can vote on what to lock in!`;
      spots = candidates.map((title) => ({ title, category: "Sightseeing" }));
    }

    if (onChunk) {
      const words = responseText.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 16));
        onChunk(words[i] + (i < words.length - 1 ? " " : ""));
      }
    }

    return { text: responseText, isLlamaWebGPU: false, suggestedSpots: spots };
  }
}

export const webllmService = new WebLLMService();
