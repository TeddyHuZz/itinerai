import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          <svg className="w-5 h-5 fill-current text-zinc-900" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.2l6 3.75v3.45L12 7.65 6 11.4V7.95l6-3.75z" />
          </svg>
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
          <svg className="w-5 h-5 fill-current text-zinc-900" viewBox="0 0 24 24">
            <path d="M18.8 6.2c-.3-.3-.8-.3-1.1 0l-5.7 5.7-2.7-2.7c-.3-.3-.8-.3-1.1 0s-.3.8 0 1.1l3.3 3.3c.3.3.8.3 1.1 0l6.2-6.3c.3-.3.3-.8 0-1.1z" />
          </svg>
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
          <svg className="w-4 h-4 fill-current text-zinc-900" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .57.04.84.12V9.36a6.34 6.34 0 00-.84-.06 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 009.79 5.34V12.9a8.27 8.27 0 005.17 1.8v-3.46a4.84 4.84 0 01-2.01-.89 4.84 4.84 0 01-1.4-2.66z" />
          </svg>
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
