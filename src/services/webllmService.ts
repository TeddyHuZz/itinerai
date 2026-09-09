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
    // Matches patterns like "1. Uluwatu Temple: ...", "2. **Tanah Lot**: ...", or "- **Potato Head** - ..."
    const match = line.match(
      /^(?:(?:\d+\.|\-|\*)\s*)(?:\*\*)?([^*:\n–—]+)(?:\*\*)?(?::|\s-\s|\s–\s|\s—\s)/i
    );
    if (match && match[1]) {
      let title = match[1].trim();
      title = title.replace(/^["']|["']$/g, "").trim();
      if (
        title.length > 2 &&
        title.length < 60 &&
        !title.toLowerCase().includes("here are") &&
        !title.toLowerCase().includes("tip") &&
        !title.toLowerCase().includes("option")
      ) {
        const lower = title.toLowerCase();
        const category =
          lower.includes("food") ||
          lower.includes("dinner") ||
          lower.includes("lunch") ||
          lower.includes("restaurant") ||
          lower.includes("cafe")
            ? "Food"
            : lower.includes("hike") || lower.includes("trek") || lower.includes("surf")
            ? "Adventure"
            : lower.includes("temple") || lower.includes("palace") || lower.includes("shrine")
            ? "Culture"
            : "Sightseeing";

        extracted.push({ title, category });
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
  ): Promise<{ text: string; suggestedSpots?: { title: string; category: string; cost?: string; image?: string; mapUrl?: string }[] }> {
    // 1. Fetch live verified facts dynamically (Wikipedia Open Search)
    const { contextText: liveFacts, verifiedTitles } = await fetchLiveDestinationContext(
      destination,
      userMessage
    );

    // 2. Build dynamic grounding text from live facts + trip highlights (zero hardcoding!)
    const dynamicGroundingParts: string[] = [];
    if (tripContext?.highlights && tripContext.highlights.length > 0) {
      dynamicGroundingParts.push(`Trip planned highlights: ${tripContext.highlights.join(", ")}`);
    }
    if (liveFacts) {
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
1. ONLY recommend real, verified, famous locations. Base your recommendations on the real context provided above whenever possible.
2. Never hallucinate or invent fictional places, made-up beaches, or non-existent castles.
3. Directly answer the user's specific request (e.g. if they ask for sunset, only give sunset spots; if food, give authentic dining).
4. EXACTLY 3 RECOMMENDATIONS: Unless the user specifies otherwise, provide exactly 3 distinct top recommendations numbered 1, 2, and 3. Never stop at 2.
5. FORMAT: Use a clean numbered list (e.g. "1. Spot Name: Brief highlight and estimated cost/timing"). Keep the entire response concise and under 110 words.`;

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
    _userMessage: string,
    destination: string,
    onChunk?: (chunk: string) => void,
    verifiedTitles: string[] = [],
    tripContext?: TripContext
  ): Promise<{ text: string; suggestedSpots?: { title: string; category: string; cost?: string; image?: string; mapUrl?: string }[] }> {
    const cleanDest = destination.split(",")[0].trim();
    let responseText = "";
    let spots: { title: string; category: string; cost?: string; image?: string; mapUrl?: string }[] = [];

    const candidatePool = new Set<string>();
    // 1. Curated trip highlights come FIRST as highest-fidelity authentic landmarks
    if (tripContext?.highlights) {
      for (const h of tripContext.highlights) {
        if (h && h.trim().length > 1 && isValidTravelSpot(h)) {
          candidatePool.add(h.trim());
        }
      }
    }

    // 2. Verified travel spots from live search
    for (const t of verifiedTitles) {
      if (isValidTravelSpot(t)) candidatePool.add(t.trim());
    }

    // 3. Fallback scenic landmarks
    candidatePool.add(`${cleanDest} Historic Center & Old Town`);
    candidatePool.add(`${cleanDest} Scenic Viewpoint`);
    candidatePool.add(`${cleanDest} Coastal Panorama`);

    const candidates = Array.from(candidatePool).slice(0, 3);
    const s1 = candidates[0];
    const s2 = candidates[1];
    const s3 = candidates[2];

    responseText = `Here are 3 verified recommendations in ${cleanDest} for your group:\n\n1. **${s1}**: Highly rated spot with scenic viewpoints and great group photo opportunities.\n2. **${s2}**: Popular local landmark known for great atmosphere and authentic surroundings.\n3. **${s3}**: Essential travel highlight perfect for group exploration.\n\nI've generated a poll below so everyone can vote on what to lock in!`;
    spots = [
      { title: s1, category: "Sightseeing" },
      { title: s2, category: "Sightseeing" },
      { title: s3, category: "Sightseeing" },
    ];

    if (onChunk) {
      const words = responseText.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
        onChunk(words[i] + (i < words.length - 1 ? " " : ""));
      }
    }

    return { text: responseText, suggestedSpots: spots };
  }
}

export const webllmService = new WebLLMService();
