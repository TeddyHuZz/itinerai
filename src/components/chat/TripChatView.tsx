import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Sparkles,
  Users,
  ThumbsUp,
  Plus,
  Check,
  Cpu,
  RefreshCw,
  Share2,
  Search,
  ArrowLeft,
  Calendar,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { webllmService, SELECTED_MODEL } from "../../services/webllmService";
import type { TripItem } from "../itinerary/ItineraryView";

export interface ChatMessage {
  id: string;
  sender: "user" | "companion" | "ai";
  authorName: string;
  avatar: string;
  text: string;
  timestamp: string;
  poll?: {
    id: string;
    question: string;
    targetDay?: number;
    options: {
      id: string;
      title: string;
      category: string;
      cost?: string;
      image?: string;
      mapUrl?: string;
      votes: number;
      voters: string[];
    }[];
    addedToItinerary?: boolean;
  };
}

interface TripChatViewProps {
  trips: TripItem[];
  activeTripId?: string;
  onSelectTrip?: (trip: TripItem) => void;
  onAddActivityToTrip?: (tripId: string, activity: { title: string; category: string; cost?: string; day: number }) => void;
  onCopyLink?: (trip: TripItem) => void;
  onOpenItinerary?: (trip: TripItem) => void;
}

export function getGoogleMapsUrl(spotTitle: string, destination?: string): string {
  const cleanTitle = spotTitle.replace(/^\d+\.\s*/, "").replace(/[*_]/g, "").trim();
  const query = destination ? `${cleanTitle}, ${destination}` : cleanTitle;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getSpotImage(spotTitle: string, destination?: string, fallbackImage?: string): string {
  const t = spotTitle.toLowerCase();
  const d = (destination || "").toLowerCase();

  // 1. Match spot-specific keywords from spotTitle FIRST!

  // Zermatt & Swiss Alps
  if (t.includes("gornergrat") || t.includes("railway") || t.includes("train")) {
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("fondue") || t.includes("evening") || t.includes("dinner") || t.includes("cheese")) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("matterhorn") || t.includes("glacier") || t.includes("paradise")) {
    return "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("weisshorn") || t.includes("alpine") || t.includes("summit") || t.includes("peak")) {
    return "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=400&auto=format&fit=crop&q=80";
  }

  // Amalfi Coast
  if (t.includes("capri") || t.includes("boat") || t.includes("cruise") || t.includes("grotto") || t.includes("sail")) {
    return "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("ravello") || t.includes("garden") || t.includes("rufolo") || t.includes("cimbrone") || t.includes("villa")) {
    return "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("positano") || t.includes("cliffside") || t.includes("path") || t.includes("walk")) {
    return "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&auto=format&fit=crop&q=80";
  }

  // Kyoto
  if (t.includes("fushimi") || t.includes("torii") || t.includes("shrine")) {
    return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("arashiyama") || t.includes("bamboo")) {
    return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("gion") || t.includes("tea") || t.includes("geisha")) {
    return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("kinkaku") || t.includes("golden pavilion") || t.includes("temple")) {
    return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("nishiki") || t.includes("market") || t.includes("street food")) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80";
  }

  // Bali
  if (t.includes("ubud") || t.includes("rice terrace") || t.includes("tegallalang")) {
    return "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("seminyak") || t.includes("beach club") || t.includes("sunset") || t.includes("beach")) {
    return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("batur") || t.includes("volcano") || t.includes("sunrise") || t.includes("trek")) {
    return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&auto=format&fit=crop&q=80";
  }

  // General Categories
  if (t.includes("food") || t.includes("dining") || t.includes("restaurant") || t.includes("cafe") || t.includes("tasting")) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("culture") || t.includes("museum") || t.includes("castle") || t.includes("palace") || t.includes("historic")) {
    return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80";
  }
  if (t.includes("hike") || t.includes("mountain") || t.includes("nature") || t.includes("viewpoint") || t.includes("trail")) {
    return "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=400&auto=format&fit=crop&q=80";
  }

  // 2. Only if no title keyword matched, use destination defaults:
  if (d.includes("zermatt") || d.includes("swiss")) {
    return "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&auto=format&fit=crop&q=80";
  }
  if (d.includes("amalfi")) {
    return "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&auto=format&fit=crop&q=80";
  }
  if (d.includes("kyoto") || d.includes("japan")) {
    return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80";
  }
  if (d.includes("bali") || d.includes("indonesia")) {
    return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop&q=80";
  }

  return fallbackImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=80";
}

const renderFormattedMessage = (text: string, isUser = false, destination?: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const titleText = part.slice(2, -2).trim();
      return (
        <span key={idx} className="inline-flex items-center gap-1 flex-wrap align-baseline">
          <strong
            className={`font-bold ${isUser ? "text-white" : "text-zinc-950"}`}
          >
            {titleText}
          </strong>
          {!isUser && (
            <a
              href={getGoogleMapsUrl(titleText, destination)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-semibold text-[#963314] bg-[#963314]/8 hover:bg-[#963314]/15 rounded-md transition-colors"
              title={`View ${titleText} on Google Maps`}
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin className="w-2.5 h-2.5" />
              <span>Map ↗</span>
            </a>
          )}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

export const TripChatView: React.FC<TripChatViewProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onAddActivityToTrip,
  onCopyLink,
  onOpenItinerary,
}) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(
    activeTripId || (trips.length > 0 ? trips[0].id : "")
  );

  useEffect(() => {
    if (activeTripId) {
      setSelectedTripId(activeTripId);
      setShowMobileChat(true);
    }
  }, [activeTripId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread">("all");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const currentTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  // WebLLM State
  const [modelProgress, setModelProgress] = useState<{ progress: number; text: string }>({
    progress: 0,
    text: "WebGPU Engine Ready",
  });
  const [isModelReady, setIsModelReady] = useState(webllmService.isModelReady());
  const [isInitializingLLM, setIsInitializingLLM] = useState(false);

  // Chat State per Trip
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "trip-kyoto": [
      {
        id: "msg-k-1",
        sender: "companion",
        authorName: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "Hey everyone! We have Kyoto confirmed for Oct 15-24. What are we doing on Day 2 after the bamboo forest?",
        timestamp: "10:14 AM",
      },
      {
        id: "msg-k-2",
        sender: "companion",
        authorName: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "@ItinerAI can you recommend 3 great spots in Kyoto for Day 2 afternoon and let us vote?",
        timestamp: "10:16 AM",
      },
      {
        id: "msg-k-3",
        sender: "ai",
        authorName: "ItinerAI (Llama-3.2 WebGPU)",
        avatar: "ai",
        text: "Here are 3 hand-picked afternoon ideas near Central Kyoto for your group. I've set up a poll so everyone can vote on what to lock in!",
        timestamp: "10:16 AM",
        poll: {
          id: "poll-k-1",
          question: "Day 2 Afternoon Activity in Kyoto",
          targetDay: 2,
          options: [
            {
              id: "opt-1",
              title: "Nishiki Market Street Food Tasting",
              category: "Food",
              cost: "¥3,500",
              votes: 3,
              voters: ["Alex", "David", "Kenji"],
            },
            {
              id: "opt-2",
              title: "Kinkaku-ji (Golden Pavilion) Visit",
              category: "Sightseeing",
              cost: "¥500",
              votes: 2,
              voters: ["Sarah", "Alex"],
            },
            {
              id: "opt-3",
              title: "Traditional Tea Ceremony in Gion",
              category: "Culture",
              cost: "¥4,000",
              votes: 1,
              voters: ["Kenji"],
            },
          ],
        },
      },
    ],
    "trip-bali": [
      {
        id: "msg-b-1",
        sender: "companion",
        authorName: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Excited for Bali! Make sure everyone packs light shoes for the rice fields.",
        timestamp: "09:30 AM",
      },
      {
        id: "msg-b-2",
        sender: "companion",
        authorName: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "@ItinerAI where should we book dinner on our first evening in Seminyak?",
        timestamp: "09:35 AM",
      },
    ],
    "trip-amalfi": [
      {
        id: "msg-a-1",
        sender: "companion",
        authorName: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Should we rent a private boat for Capri or take the public ferry?",
        timestamp: "Yesterday",
      },
      {
        id: "msg-a-2",
        sender: "user",
        authorName: "Alex Morgan (You)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "Private gozzo boat is worth it! Let's check with @ItinerAI",
        timestamp: "Yesterday",
      },
    ],
    "trip-swiss": [
      {
        id: "msg-s-1",
        sender: "companion",
        authorName: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "Don't forget thermal layers for the Matterhorn Glacier Paradise!",
        timestamp: "Sep 2",
      },
    ],
  });

  const [inputVal, setInputVal] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [streamingAiText, setStreamingAiText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mention State
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [selectedMentionIdx, setSelectedMentionIdx] = useState(0);

  // Close mention popup on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowMentions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mentions Candidates (AI + active trip companions)
  const mentionCandidates = useMemo(() => {
    const list = [
      {
        id: "ai-itinerai",
        name: "ItinerAI",
        tag: "ItinerAI",
        role: "AI Copilot",
        avatar: "/favicon.svg",
        isAi: true,
        description: "Ask recommendations, create polls & plan days",
      },
    ];

    const seenNames = new Set(["itinerai", "alex morgan (you)", "alex morgan"]);

    if (currentTrip?.members) {
      for (const m of currentTrip.members) {
        if (!seenNames.has(m.name.toLowerCase())) {
          seenNames.add(m.name.toLowerCase());
          list.push({
            id: `member-${m.id}`,
            name: m.name,
            tag: m.name.replace(/\s+/g, ""),
            role: "Companion",
            avatar: m.avatar,
            isAi: false,
            description: `Traveling in ${currentTrip.destination.split(",")[0]}`,
          });
        }
      }
    }

    const chatMsgs = messages[currentTrip?.id || ""] || [];
    for (const msg of chatMsgs) {
      if (
        msg.sender === "companion" &&
        msg.authorName &&
        !seenNames.has(msg.authorName.toLowerCase())
      ) {
        seenNames.add(msg.authorName.toLowerCase());
        list.push({
          id: `speaker-${msg.authorName}`,
          name: msg.authorName,
          tag: msg.authorName.replace(/\s+/g, ""),
          role: "Companion",
          avatar: msg.avatar,
          isAi: false,
          description: "Group Member",
        });
      }
    }

    return list;
  }, [currentTrip, messages]);

  const filteredMentions = useMemo(() => {
    if (!mentionQuery) return mentionCandidates;
    const q = mentionQuery.toLowerCase();
    return mentionCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
    );
  }, [mentionCandidates, mentionQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    const match = val.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      setShowMentions(true);
      setMentionQuery(match[1]);
      setSelectedMentionIdx(0);
    } else {
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  const handleSelectMention = (tag: string) => {
    const replaced = inputVal.replace(/@([a-zA-Z0-9_]*)$/, `@${tag} `);
    setInputVal(replaced);
    setShowMentions(false);
    setMentionQuery("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentions && filteredMentions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIdx((prev) => (prev + 1) % filteredMentions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIdx((prev) => (prev - 1 + filteredMentions.length) % filteredMentions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSelectMention(filteredMentions[selectedMentionIdx].tag);
      } else if (e.key === "Escape") {
        setShowMentions(false);
      }
    }
  };

  // Initialize WebLLM when component mounts
  useEffect(() => {
    const unsub = webllmService.onProgress((report) => {
      setModelProgress(report);
      if (report.progress >= 1) {
        setIsModelReady(true);
        setIsInitializingLLM(false);
      }
    });

    if (!webllmService.isModelReady() && webllmService.isWebGPUSupported()) {
      setIsInitializingLLM(true);
      webllmService.initializeEngine();
    }

    return () => unsub();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingAiText, selectedTripId, showMobileChat]);

  const currentChat = currentTrip ? messages[currentTrip.id] || [] : [];

  // Filtered trips in sidebar
  const filteredTrips = trips.filter((t) => {
    const matchesQuery = t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === "unread") {
      return matchesQuery && (t.id === "trip-kyoto" || t.id === "trip-bali");
    }
    return matchesQuery;
  });

  // Get latest message preview for a trip
  const getLatestMessage = (tripId: string) => {
    const chat = messages[tripId];
    if (!chat || chat.length === 0) return "No messages yet";
    const last = chat[chat.length - 1];
    return `${last.authorName.split(" ")[0]}: ${last.text}`;
  };

  const getLatestTime = (tripId: string) => {
    const chat = messages[tripId];
    if (!chat || chat.length === 0) return "";
    return chat[chat.length - 1].timestamp;
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !currentTrip) return;

    const userText = inputVal.trim();
    const isAiQuery = userText.toLowerCase().includes("@itinerai") || userText.toLowerCase().startsWith("/");

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      authorName: "Alex Morgan (You)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [currentTrip.id]: [...(prev[currentTrip.id] || []), newMsg],
    }));

    setInputVal("");
    setShowMentions(false);
    setMentionQuery("");

    if (isAiQuery) {
      setIsAiThinking(true);
      setStreamingAiText("");

      try {
        const result = await webllmService.generateChatResponse(
          userText.replace(/@itinerai/gi, "").trim(),
          currentTrip.destination,
          (delta) => {
            setStreamingAiText((prev) => prev + delta);
          },
          {
            highlights: currentTrip.highlights,
          }
        );

        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          authorName: "ItinerAI (Llama-3.2 WebGPU)",
          avatar: "ai",
          text: result.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          poll: result.suggestedSpots && result.suggestedSpots.length > 0 ? {
            id: `poll-${Date.now()}`,
            question: `Group Vote: Suggested spots for ${currentTrip.destination}`,
            targetDay: 2,
            options: result.suggestedSpots.map((spot, i) => ({
              id: `opt-${Date.now()}-${i}`,
              title: spot.title,
              category: spot.category,
              cost: spot.cost,
              image: spot.image || getSpotImage(spot.title, currentTrip.destination, currentTrip.image),
              mapUrl: spot.mapUrl || getGoogleMapsUrl(spot.title, currentTrip.destination),
              votes: 0,
              voters: [],
            })),
          } : undefined,
        };

        setMessages((prev) => ({
          ...prev,
          [currentTrip.id]: [...(prev[currentTrip.id] || []), aiMsg],
        }));
      } catch (err) {
        console.error("AI response error:", err);
      } finally {
        setIsAiThinking(false);
        setStreamingAiText("");
      }
    }
  };

  // Vote in Poll
  const handleVote = (msgId: string, optionId: string) => {
    if (!currentTrip) return;

    setMessages((prev) => {
      const tripMsgs = prev[currentTrip.id] || [];
      const updated = tripMsgs.map((m) => {
        if (m.id !== msgId || !m.poll) return m;

        const options = m.poll.options.map((opt) => {
          if (opt.id !== optionId) return opt;
          const hasVoted = opt.voters.includes("Alex");
          return {
            ...opt,
            votes: hasVoted ? opt.votes - 1 : opt.votes + 1,
            voters: hasVoted ? opt.voters.filter((v) => v !== "Alex") : [...opt.voters, "Alex"],
          };
        });

        return { ...m, poll: { ...m.poll, options } };
      });

      return { ...prev, [currentTrip.id]: updated };
    });
  };

  // Add winning poll activity to itinerary
  const handleAddPollToItinerary = (msgId: string, optionTitle: string, category: string, cost?: string, day = 2) => {
    if (!currentTrip) return;

    if (onAddActivityToTrip) {
      onAddActivityToTrip(currentTrip.id, {
        title: optionTitle,
        category,
        cost,
        day,
      });
    }

    setMessages((prev) => {
      const tripMsgs = prev[currentTrip.id] || [];
      const updated = tripMsgs.map((m) => {
        if (m.id !== msgId || !m.poll) return m;
        return {
          ...m,
          poll: { ...m.poll, addedToItinerary: true },
        };
      });
      return { ...prev, [currentTrip.id]: updated };
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex-1 flex flex-col min-h-0 overflow-hidden pb-20 md:pb-4">
      {/* Model Download Banner (Top alert if WebGPU weights are loading) */}
      {isInitializingLLM && modelProgress.progress < 1 && (
        <div className="mb-3 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span className="font-semibold">
              Downloading {SELECTED_MODEL} into browser WebGPU cache ({Math.round(modelProgress.progress * 100)}%)
            </span>
          </div>
          <div className="w-24 bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#f15a24] h-full transition-all duration-300"
              style={{ width: `${Math.round(modelProgress.progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Two-Column Messenger Container (Airbnb Inspired) */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-1 min-h-0">
        {/* ======================================================================= */}
        {/* 1. LEFT SIDEBAR: Conversation List                                      */}
        {/* ======================================================================= */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-zinc-200 flex flex-col bg-white shrink-0 min-h-0 ${
            showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-zinc-950 tracking-tight">Messages</h2>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-lg">
                {trips.length} Escapes
              </span>
            </div>

            {/* Filter Pills (All / Unread) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterType === "all"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType("unread")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === "unread"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70"
                }`}
              >
                <span>Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f15a24]" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trip chats..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold placeholder:text-zinc-400 outline-none focus:border-[#963314] focus:ring-2 focus:ring-[#963314]/10 transition-all"
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 min-h-0">
            {filteredTrips.map((trip) => {
              const isSelected = trip.id === selectedTripId;
              const lastMsg = getLatestMessage(trip.id);
              const lastTime = getLatestTime(trip.id);

              return (
                <div
                  key={trip.id}
                  onClick={() => {
                    setSelectedTripId(trip.id);
                    setShowMobileChat(true);
                    onSelectTrip?.(trip);
                  }}
                  className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer text-left relative ${
                    isSelected ? "bg-zinc-100/80" : "hover:bg-zinc-50/80"
                  }`}
                >
                  {/* Left Indicator Bar for Selected Conversation */}
                  {isSelected && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#f15a24] rounded-r-full" />
                  )}

                  {/* Thumbnail */}
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-12 h-12 rounded-2xl object-cover shadow-2xs shrink-0 border border-zinc-200/60"
                  />

                  {/* Text Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span>{trip.dates}</span>
                      </div>
                      {lastTime && (
                        <span className="text-[10px] font-semibold text-zinc-400 shrink-0">
                          {lastTime}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-extrabold text-zinc-950 truncate leading-snug">
                      {trip.destination}
                    </h4>

                    <p className="text-xs text-zinc-500 truncate mt-0.5 font-medium">
                      {lastMsg}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. RIGHT PANEL: Active Chat Thread (Airbnb Header & Messages)           */}
        {/* ======================================================================= */}
        <div
          className={`flex-1 flex flex-col bg-white min-w-0 min-h-0 ${
            !showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-100 flex items-center justify-between gap-3 bg-white shrink-0">
            {/* Left: Mobile Back Button + Trip Thumbnail & Title */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Back Button on Mobile */}
              <button
                type="button"
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <img
                src={currentTrip?.image}
                alt={currentTrip?.destination}
                className="w-10 h-10 rounded-xl object-cover shadow-2xs shrink-0 border border-zinc-200/80"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-zinc-950 truncate leading-tight">
                    {currentTrip?.destination}
                  </h3>
                  <span
                    className={`hidden sm:inline-flex px-2 py-0.2 rounded-md text-[10px] font-extrabold ${
                      currentTrip?.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {currentTrip?.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mt-0.5">
                  <span>{currentTrip?.dates}</span>
                  <span>•</span>
                  <span>{currentTrip?.members.length} companions</span>
                </div>
              </div>
            </div>

            {/* Right: Local WebGPU Indicator & Itinerary Action */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Local WebLLM Badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700">
                <Cpu className="w-3.5 h-3.5 text-[#f15a24]" />
                <span className="text-[11px]">
                  {isModelReady ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Llama-3.2 WebGPU
                    </span>
                  ) : isInitializingLLM ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      {Math.round(modelProgress.progress * 100)}%
                    </span>
                  ) : (
                    <span className="text-zinc-600 font-medium">Local AI</span>
                  )}
                </span>
              </div>

              {/* Companion Invite */}
              {currentTrip && onCopyLink && (
                <button
                  type="button"
                  onClick={() => onCopyLink(currentTrip)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#963314] text-xs font-bold border border-orange-200/80 transition-all cursor-pointer flex items-center gap-1"
                  title="Invite companions"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Invite</span>
                </button>
              )}

              {/* View Itinerary Bridge Button */}
              {currentTrip && onOpenItinerary && (
                <button
                  type="button"
                  onClick={() => onOpenItinerary(currentTrip)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                  title="Open Day-by-Day Itinerary"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Itinerary</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0 space-y-4 bg-zinc-50/40">
            {currentChat.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <img
                  src="/favicon.svg"
                  alt="ItinerAI"
                  className="w-12 h-12 rounded-2xl object-contain shadow-xs mb-2"
                />
                <h4 className="text-sm font-bold text-zinc-700">Trip Chat Ready</h4>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Chat with friends and tag <span className="text-[#f15a24] font-bold">@ItinerAI</span> to find activities, generate polls, and vote together!
                </p>
              </div>
            ) : (
              currentChat.map((msg) => {
                const isUser = msg.sender === "user";
                const isAI = msg.sender === "ai";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 sm:gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    {isAI ? (
                      <img
                        src="/favicon.svg"
                        alt="ItinerAI"
                        className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0"
                      />
                    ) : (
                      <img
                        src={msg.avatar}
                        alt={msg.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-white shadow-2xs shrink-0"
                      />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${
                        isUser ? "items-end text-right" : "items-start text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 px-1 mb-1 text-[11px] font-medium text-zinc-400 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="font-bold text-zinc-700">{msg.authorName}</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`w-fit max-w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-left ${
                          isUser
                            ? "bg-[#963314] text-white rounded-tr-xs"
                            : isAI
                            ? "bg-white border border-zinc-200/90 text-zinc-900 rounded-tl-xs shadow-2xs"
                            : "bg-white border border-zinc-200/80 text-zinc-800 rounded-tl-xs shadow-2xs"
                        }`}
                      >
                        {renderFormattedMessage(msg.text, isUser, currentTrip?.destination)}
                      </div>

                      {/* Interactive Poll Widget */}
                      {msg.poll && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-3.5 sm:p-4 text-left space-y-3 mt-2"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                            <div>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-[#963314] uppercase tracking-wider">
                                <Users className="w-3.5 h-3.5" />
                                <span>Group Decision Poll</span>
                              </div>
                              <h5 className="text-xs sm:text-sm font-extrabold text-zinc-900 mt-0.5">
                                {msg.poll.question}
                              </h5>
                            </div>
                            {msg.poll.addedToItinerary && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                Added to Timeline
                              </span>
                            )}
                          </div>

                          {/* Poll Options */}
                          <div className="space-y-2">
                            {msg.poll.options.map((opt) => {
                              const hasVoted = opt.voters.includes("Alex");
                              const spotImage = getSpotImage(opt.title, currentTrip?.destination, opt.image || currentTrip?.image);
                              const mapUrl = opt.mapUrl || getGoogleMapsUrl(opt.title, currentTrip?.destination);

                              return (
                                <div
                                  key={opt.id}
                                  className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all bg-zinc-50/50 gap-3 group"
                                >
                                  {/* Visual Place Thumbnail */}
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-200 shadow-2xs bg-zinc-100">
                                    <img
                                      src={spotImage}
                                      alt={opt.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        if (currentTrip?.image && target.src !== currentTrip.image) {
                                          target.src = currentTrip.image;
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-bold text-zinc-900 truncate">
                                        {opt.title}
                                      </span>
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-200/80 text-zinc-700">
                                        {opt.category}
                                      </span>
                                      {opt.cost && (
                                        <span className="text-[10px] font-medium text-zinc-500">
                                          {opt.cost}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-zinc-400 font-medium">
                                        {opt.voters.length > 0
                                          ? `Voted by: ${opt.voters.join(", ")}`
                                          : "No votes yet"}
                                      </span>
                                      <span className="text-zinc-300 text-[10px]">•</span>
                                      <a
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#963314] hover:underline cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                        title={`Open ${opt.title} in Google Maps`}
                                      >
                                        <MapPin className="w-2.5 h-2.5" />
                                        <span>Map ↗</span>
                                      </a>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Vote Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleVote(msg.id, opt.id)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                        hasVoted
                                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                                          : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                                      }`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 ${hasVoted ? "fill-amber-500 text-amber-600" : ""}`} />
                                      <span>{opt.votes}</span>
                                    </button>

                                    {/* Add to Itinerary Button */}
                                    {!msg.poll?.addedToItinerary && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAddPollToItinerary(
                                            msg.id,
                                            opt.title,
                                            opt.category,
                                            opt.cost,
                                            msg.poll?.targetDay || 2
                                          )
                                        }
                                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f15a24] hover:bg-[#e04812] text-white transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                        title="Add this spot to the itinerary"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span className="hidden sm:inline">Add</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* AI Streaming Thinking Indicator */}
            {isAiThinking && (
              <div className="flex items-start gap-2.5 text-left">
                <img
                  src="/favicon.svg"
                  alt="ItinerAI"
                  className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0 animate-pulse"
                />
                <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl rounded-tl-xs text-xs text-zinc-800 space-y-1 shadow-xs">
                  <div className="text-[11px] font-bold text-[#963314] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>Llama-3.2 WebGPU is generating recommendations...</span>
                  </div>
                  {streamingAiText ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{renderFormattedMessage(streamingAiText, false, currentTrip?.destination)}</div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Footer */}
          <div className="p-3 sm:p-4 border-t border-zinc-100 bg-white space-y-2 shrink-0">
            {/* Input Row with Floating @Mention Popup */}
            <div className="relative">
              {showMentions && filteredMentions.length > 0 && (
                <div
                  className="absolute bottom-full left-0 mb-2 w-full max-w-sm sm:max-w-md bg-white rounded-2xl border border-zinc-200/90 shadow-2xl overflow-hidden z-50 p-1.5 space-y-1 text-left backdrop-blur-md"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-100">
                    <span>Mention in {currentTrip?.destination?.split(",")[0] || "Trip"}</span>
                    <span className="text-[9px] text-zinc-400 font-normal">↑↓ navigate • Enter to pick</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
                    {filteredMentions.map((item, idx) => {
                      const isSelected = idx === selectedMentionIdx;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setSelectedMentionIdx(idx)}
                          onClick={() => handleSelectMention(item.tag)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left cursor-pointer ${
                            isSelected
                              ? "bg-orange-50 border border-orange-200/80"
                              : "hover:bg-zinc-50 border border-transparent"
                          }`}
                        >
                          {/* Avatar / Icon */}
                          <div className="relative shrink-0">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-8 h-8 rounded-xl object-cover border border-zinc-200 shadow-2xs"
                            />
                            {item.isAi && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#f15a24] text-white flex items-center justify-center border border-white">
                                <Sparkles className="w-2 h-2" />
                              </div>
                            )}
                          </div>

                          {/* Member info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-zinc-900 truncate">
                                {item.name}
                              </span>
                              <span className="text-[11px] font-semibold text-[#963314]">
                                @{item.tag}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                  item.isAi
                                    ? "bg-orange-100 text-[#963314]"
                                    : "bg-zinc-100 text-zinc-600"
                                }`}
                              >
                                {item.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  placeholder={`Chat with companions or ask @ItinerAI for ${currentTrip?.destination || "trip"}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200/90 focus:border-[#963314] focus:ring-2 focus:ring-[#963314]/10 bg-zinc-50/50 text-xs sm:text-sm font-medium outline-none transition-all placeholder:text-zinc-400"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#f15a24] hover:bg-[#e04812] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>

            {/* AI Assistant Hint Subtitle */}
            <div className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-0.5 select-none">
              <Sparkles className="w-3 h-3 text-[#f15a24] shrink-0" />
              <span>
                Tip: Tag{" "}
                <button
                  type="button"
                  onClick={() => {
                    setInputVal((prev) => (prev.includes("@ItinerAI") ? prev : `@ItinerAI ${prev}`.trim() + " "));
                    inputRef.current?.focus();
                  }}
                  className="font-semibold text-[#963314] bg-orange-50 hover:bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200/60 cursor-pointer transition-colors"
                >
                  @ItinerAI
                </button>{" "}
                to assist in planning &amp; group polls with AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
