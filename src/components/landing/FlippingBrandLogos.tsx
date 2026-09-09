import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PerplexityIcon,
  DeliverooIcon,
  TikTokIcon,
} from "@/components/ui/Icons";

interface BrandItem {
  id: string;
  render: () => React.ReactNode;
}

const BRAND_SETS: BrandItem[][] = [
  // Set 1: Jitter Reference Brands
  [
    {
      id: "google",
      render: () => (
        <span className="font-medium text-[22px] tracking-tight text-zinc-900 font-sans">
          Google
        </span>
      ),
    },
    {
      id: "gamma",
      render: () => (
        <span className="font-black text-[22px] tracking-tighter text-zinc-900 uppercase font-sans">
          gamma
        </span>
      ),
    },
    {
      id: "perplexity",
      render: () => (
        <div className="flex items-center gap-1.5">
          <PerplexityIcon size={20} className="text-zinc-900" />
          <span className="font-bold text-[18px] tracking-tight text-zinc-900">
            perplexity
          </span>
        </div>
      ),
    },
    {
      id: "dept",
      render: () => (
        <span className="font-black text-[20px] tracking-widest text-zinc-900 uppercase">
          DEPT.
        </span>
      ),
    },
    {
      id: "deliveroo",
      render: () => (
        <div className="flex items-center gap-1.5">
          <DeliverooIcon size={20} className="text-zinc-900" />
          <span className="font-extrabold text-[19px] tracking-tight text-zinc-900">
            deliveroo
          </span>
        </div>
      ),
    },
    {
      id: "tiktok",
      render: () => (
        <div className="flex items-center gap-1">
          <TikTokIcon size={18} className="text-zinc-900" />
          <span className="font-extrabold text-[18px] tracking-tight text-zinc-900">
            TikTok
          </span>
        </div>
      ),
    },
    {
      id: "huge",
      render: () => (
        <span className="font-serif font-extrabold text-[19px] tracking-normal text-zinc-900">
          Huge
        </span>
      ),
    },
  ],
  // Set 2: Travel Leaders
  [
    {
      id: "airbnb",
      render: () => (
        <span className="font-black text-[22px] tracking-tight text-zinc-900 lowercase">
          airbnb
        </span>
      ),
    },
    {
      id: "skyscanner",
      render: () => (
        <span className="font-extrabold text-[19px] tracking-tighter text-zinc-900">
          skyscanner
        </span>
      ),
    },
    {
      id: "booking",
      render: () => (
        <div className="flex items-center">
          <span className="font-extrabold text-[18px] text-zinc-900">Booking</span>
          <span className="font-semibold text-zinc-500 text-xs">.com</span>
        </div>
      ),
    },
    {
      id: "tripadvisor",
      render: () => (
        <span className="font-bold text-[17px] tracking-tight text-zinc-900">
          tripadvisor
        </span>
      ),
    },
    {
      id: "expedia",
      render: () => (
        <span className="font-black text-[17px] tracking-widest text-zinc-900 uppercase">
          EXPEDIA
        </span>
      ),
    },
    {
      id: "klook",
      render: () => (
        <span className="font-black text-[20px] tracking-tight text-zinc-900">
          klook
        </span>
      ),
    },
    {
      id: "jrpass",
      render: () => (
        <span className="font-extrabold text-[18px] tracking-widest text-zinc-900 uppercase">
          JR RAIL
        </span>
      ),
    },
  ],
  // Set 3: Modern Tech & Collaboration
  [
    {
      id: "notion",
      render: () => (
        <span className="font-serif font-black text-[20px] tracking-tight text-zinc-900">
          Notion
        </span>
      ),
    },
    {
      id: "figma",
      render: () => (
        <span className="font-bold text-[20px] tracking-tight text-zinc-900">
          Figma
        </span>
      ),
    },
    {
      id: "linear",
      render: () => (
        <span className="font-bold text-[19px] tracking-wider text-zinc-900 uppercase">
          Linear
        </span>
      ),
    },
    {
      id: "slack",
      render: () => (
        <span className="font-extrabold text-[19px] tracking-tight text-zinc-900">
          slack
        </span>
      ),
    },
    {
      id: "stripe",
      render: () => (
        <span className="font-black text-[20px] tracking-tight text-zinc-900">
          stripe
        </span>
      ),
    },
    {
      id: "revolut",
      render: () => (
        <span className="font-bold text-[18px] tracking-tight text-zinc-900">
          Revolut
        </span>
      ),
    },
    {
      id: "monzo",
      render: () => (
        <span className="font-extrabold text-[19px] tracking-tight text-zinc-900">
          monzo
        </span>
      ),
    },
  ],
];

export const FlippingBrandLogos: React.FC = () => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % BRAND_SETS.length);
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  const currentSet = BRAND_SETS[currentSetIndex];

  return (
    <div className="w-full flex items-center justify-between gap-6 sm:gap-10 pt-8 pb-4 flex-wrap sm:flex-nowrap opacity-90">
      {currentSet.map((brand, colIdx) => (
        <div
          key={colIdx}
          className="h-10 min-w-25 sm:min-w-30 flex items-center justify-center relative overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSetIndex}-${brand.id}`}
              initial={{ opacity: 0, rotateX: -90, y: -10 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: 90, y: 10 }}
              transition={{
                duration: 0.5,
                delay: colIdx * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="flex items-center justify-center w-full h-full cursor-default select-none"
            >
              {brand.render()}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
