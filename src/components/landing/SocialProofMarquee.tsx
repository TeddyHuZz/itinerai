import React from "react";
import { Marquee } from "@/components/ui/marquee";
import { Star, ShieldCheck, MapPin } from "lucide-react";

export const SocialProofMarquee: React.FC = () => {
  const testimonials = [
    {
      name: "Marcus Chen & 5 friends",
      trip: "Tokyo & Kyoto 8-Day Trip",
      avatar: "🌸",
      text: "We had 6 different opinions on hotels. Itinerai's consensus voting got us locked in 10 minutes instead of 3 days of arguing in our WhatsApp group.",
      rating: 5,
    },
    {
      name: "Elena Rostova & crew",
      trip: "Amalfi Coast Roadtrip",
      avatar: "🍋",
      text: "A flash rainstorm hit Positano. Itinerai's AI recalculated our outdoor cliff hike to a private lemon grove cooking masterclass in seconds!",
      rating: 5,
    },
    {
      name: "David Kim & 4 roommates",
      trip: "Seoul Foodie & Nightlife Tour",
      avatar: "🍲",
      text: "Zero awkward money talks. We snapped the BBQ receipts with OCR and everyone got their exact Venmo balance within 30 seconds.",
      rating: 5,
    },
    {
      name: "Chloe & Liam",
      trip: "Swiss Alps & Interlaken",
      avatar: "🏔️",
      text: "The anti-duplicate booking guard prevented two of us from double-booking the same mountain lodge in Grindelwald. Total lifesaver!",
      rating: 5,
    },
  ];

  const partners = [
    { name: "Google Flights Aggregation", icon: "✈️" },
    { name: "Booking.com Engine", icon: "🏨" },
    { name: "Airbnb API Integration", icon: "🏡" },
    { name: "Skyscanner Live Pricing", icon: "🌍" },
    { name: "JR Pass & Shinkansen Network", icon: "🚄" },
    { name: "OpenWeather Live Radar", icon: "🌦️" },
    { name: "Splitwise & Bank Sync", icon: "💳" },
  ];

  return (
    <section className="py-12 border-y border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs uppercase tracking-widest font-bold text-zinc-600 dark:text-zinc-400">
          Connected with global travel data & trusted by real friend groups
        </p>
      </div>

      {/* Partners / Data Feeds Marquee */}
      <Marquee pauseOnHover className="[--duration:30s] mb-8">
        {partners.map((partner, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm"
          >
            <span>{partner.icon}</span>
            <span>{partner.name}</span>
          </div>
        ))}
      </Marquee>

      {/* Testimonials Marquee */}
      <Marquee reverse pauseOnHover className="[--duration:45s]">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="w-80 sm:w-96 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.avatar}</span>
                  <div>
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-white">
                      {t.name}
                    </h5>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {t.trip}
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                "{t.text}"
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Group Trip</span>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
};
