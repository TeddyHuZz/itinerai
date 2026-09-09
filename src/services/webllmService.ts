import * as webllm from "@mlc-ai/web-llm";

export const SELECTED_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export interface LLMProgressReport {
  progress: number;
  text: string;
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
        text: "Qwen2.5-0.5B-Instruct loaded into local WebGPU!",
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
    onChunk?: (chunk: string) => void
  ): Promise<{ text: string; suggestedSpots?: { title: string; category: string; cost?: string }[] }> {
    // If WebLLM is loaded and ready, use the local WebGPU model!
    if (this.isReady && this.engine) {
      try {
        const systemPrompt = `You are ItinerAI Copilot, an expert AI travel planner helping a travel group in their group chat.
Destination: ${destination}.
Provide helpful, friendly, and practical travel recommendations.
Keep answers concise (under 120 words). Recommend 2-3 specific spots with estimated price and why to visit.`;

        const response = await this.engine.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
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
          suggestedSpots: this.extractSpotsFromDestination(destination, userMessage),
        };
      } catch (err) {
        console.warn("WebLLM streaming error, fallback to curated response:", err);
      }
    }

    // High-quality smart travel fallback
    return this.getSmartFallbackResponse(userMessage, destination, onChunk);
  }

  private async getSmartFallbackResponse(
    userMessage: string,
    destination: string,
    onChunk?: (chunk: string) => void
  ): Promise<{ text: string; suggestedSpots?: { title: string; category: string; cost?: string }[] }> {
    const lower = userMessage.toLowerCase();
    const destLower = destination.toLowerCase();

    let responseText = "";
    let spots: { title: string; category: string; cost?: string }[] = [];

    if (lower.includes("food") || lower.includes("dinner") || lower.includes("eat") || lower.includes("restaurant") || lower.includes("cafe")) {
      if (destLower.includes("kyoto") || destLower.includes("japan")) {
        responseText = `Here are 3 top-rated dining spots in Kyoto for your group:\n\n1. **Nishiki Market Skewers & Matcha**: Vibrant street eats, fresh grilled wagyu skewers & artisanal dango.\n2. **Gion Karyo (Kaiseki)**: Traditional multi-course Kyoto seasonal dining in an authentic machiya.\n3. **Chao Chao Gyoza**: Casual, energetic spot renowned for crispy winged gyoza.\n\nI've created a group poll below so everyone can vote on tonight's spot!`;
        spots = [
          { title: "Nishiki Market Culinary Tour", category: "Food", cost: "¥3,500 / person" },
          { title: "Gion Karyo Traditional Kaiseki", category: "Food", cost: "¥8,000 / person" },
          { title: "Chao Chao Gyoza Sanjo", category: "Food", cost: "¥1,800 / person" },
        ];
      } else if (destLower.includes("bali")) {
        responseText = `Top dining picks in Bali for your group:\n\n1. **Seminyak Beach Club Sunset Dinner**: Oceanside daybeds, grilled seafood & cocktail pairings.\n2. **Bebek Bengil (Dirty Duck) Ubud**: Legendary crispy duck overlooking rice paddies.\n3. **Cuca Flavor Jimbaran**: High-end innovative tapas with tropical ingredients.\n\nVote in the poll below to pick where we dine!`;
        spots = [
          { title: "Seminyak Beach Club Dinner", category: "Food", cost: "IDR 450,000" },
          { title: "Bebek Bengil Crispy Duck Ubud", category: "Food", cost: "IDR 220,000" },
          { title: "Cuca Jimbaran Signature Tapas", category: "Food", cost: "IDR 600,000" },
        ];
      } else {
        responseText = `Here are 3 fantastic food options in ${destination}:\n\n1. **Old Town Evening Food Trail**: Tasting local street delicacies and specialty bites.\n2. **Rooftop Sunset Lounge**: Panoramic city skyline views with local wines.\n3. **Artisan Waterfront Bistro**: Catch of the day prepared in traditional style.\n\nCast your vote below!`;
        spots = [
          { title: `${destination} Old Town Tasting`, category: "Food", cost: "RM 85" },
          { title: "Skyline Sunset Dining", category: "Food", cost: "RM 140" },
          { title: "Harbour View Bistro", category: "Food", cost: "RM 110" },
        ];
      }
    } else if (lower.includes("hike") || lower.includes("outdoor") || lower.includes("adventure") || lower.includes("sight") || lower.includes("place")) {
      if (destLower.includes("kyoto") || destLower.includes("japan")) {
        responseText = `Great sight & adventure picks for Kyoto:\n\n1. **Fushimi Inari Torii Gates Trail**: Climb the sacred mountain path surrounded by 10,000 vermilion arches.\n2. **Arashiyama Sagano Bamboo Grove**: Serene morning walk paired with the Tenryu-ji Zen garden.\n3. **Kiyomizu-dera Cliff Terrace**: Historic wooden hall overlooking the maple tree valley.\n\nVote on which spot you'd like to lock in for tomorrow!`;
        spots = [
          { title: "Fushimi Inari Torii Gates Trek", category: "Culture", cost: "Free" },
          { title: "Arashiyama Bamboo Forest & Tenryu-ji", category: "Sightseeing", cost: "¥500" },
          { title: "Kiyomizu-dera Panorama Terrace", category: "Culture", cost: "¥400" },
        ];
      } else if (destLower.includes("amalfi") || destLower.includes("italy")) {
        responseText = `Must-see attractions for Amalfi Coast:\n\n1. **Positano Cliffside Walk**: Stunning stairs through bougainvillea paths down to the Spiaggia Grande.\n2. **Capri Private Gozzo Boat Charter**: Faraglioni rock tunnels & swimming in the Green Grotto.\n3. **Villa Cimbrone Infinity Terrace in Ravello**: Marble bust balcony high above the Mediterranean.\n\nVote below to add to your itinerary!`;
        spots = [
          { title: "Positano Cliffside Walk", category: "Sightseeing", cost: "Free" },
          { title: "Capri Private Boat Charter", category: "Adventure", cost: "€180 / person" },
          { title: "Villa Cimbrone Infinity Terrace", category: "Sightseeing", cost: "€10" },
        ];
      } else {
        responseText = `Exciting itinerary highlights for ${destination}:\n\n1. **Iconic Scenic Viewpoint Hike**: Panoramic sunrise vistas over the surrounding landscape.\n2. **Historic Landmark & Old Quarter**: Guided walking discovery through iconic architecture.\n3. **Local Cultural Workshop**: Hands-on artisanal crafts & photography spots.\n\nVote below to approve for your itinerary!`;
        spots = [
          { title: `${destination} Scenic Viewpoint Trail`, category: "Adventure", cost: "Free" },
          { title: "Historic Old Town Walking Tour", category: "Sightseeing", cost: "RM 45" },
          { title: "Cultural Discovery & Sunset Walk", category: "Culture", cost: "RM 60" },
        ];
      }
    } else {
      responseText = `I've analyzed popular group activities in ${destination} based on your travel dates. Here are 3 top recommendations tailored for your companions:\n\n1. **Morning Cultural Landmark Discovery**: Beat the afternoon heat and explore with early access.\n2. **Traditional Lunch & Local Market**: Taste authentic regional delicacies.\n3. **Sunset Viewpoint & Drinks**: Perfect group photography spot before dinner.\n\nVote in the poll below to add your favorite directly to the itinerary!`;
      spots = this.extractSpotsFromDestination(destination, userMessage);
    }

    // Simulate natural streaming cadence
    if (onChunk) {
      const words = responseText.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
        onChunk(words[i] + (i < words.length - 1 ? " " : ""));
      }
    }

    return { text: responseText, suggestedSpots: spots };
  }

  private extractSpotsFromDestination(
    destination: string,
    _query: string
  ): { title: string; category: string; cost?: string }[] {
    const dest = destination.toLowerCase();
    if (dest.includes("kyoto") || dest.includes("japan")) {
      return [
        { title: "Fushimi Inari Torii Gates Trail", category: "Culture", cost: "Free" },
        { title: "Arashiyama Bamboo Forest & Tenryu-ji", category: "Sightseeing", cost: "¥500" },
        { title: "Nishiki Market Food Stalls", category: "Food", cost: "¥3,000" },
      ];
    }
    if (dest.includes("bali")) {
      return [
        { title: "Tegallalang Rice Terraces & Swing", category: "Sightseeing", cost: "IDR 250,000" },
        { title: "Seminyak Beach Club Sunset", category: "Food", cost: "IDR 450,000" },
        { title: "Mount Batur Sunrise Hike", category: "Adventure", cost: "IDR 450,000" },
      ];
    }
    if (dest.includes("amalfi") || dest.includes("italy")) {
      return [
        { title: "Positano Cliffside Walk", category: "Sightseeing", cost: "Free" },
        { title: "Capri Private Gozzo Boat Charter", category: "Adventure", cost: "€180" },
        { title: "Villa Cimbrone Gardens in Ravello", category: "Sightseeing", cost: "€10" },
      ];
    }
    if (dest.includes("swiss") || dest.includes("zermatt")) {
      return [
        { title: "Gornergrat Scenic Cogwheel Railway", category: "Transit", cost: "CHF 110" },
        { title: "Matterhorn Glacier Paradise Caves", category: "Adventure", cost: "CHF 95" },
        { title: "Alpine Cheese Fondue Feast", category: "Food", cost: "CHF 45" },
      ];
    }
    return [
      { title: `${destination} Iconic Landmark Tour`, category: "Sightseeing", cost: "Free" },
      { title: `${destination} Waterfront Sunset Dinner`, category: "Food", cost: "RM 95" },
      { title: `${destination} Adventure Trail`, category: "Adventure", cost: "RM 60" },
    ];
  }
}

export const webllmService = new WebLLMService();
