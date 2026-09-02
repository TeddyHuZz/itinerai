import React from "react";

interface ItineraiLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ItineraiLogo: React.FC<ItineraiLogoProps> = ({
  className = "",
  showText = true,
  size = "md",
}) => {
  if (!showText) {
    // Icon-only badge version (Favicon / Avatar style)
    return (
      <div
        className={`rounded-xl bg-[#09090b] border-2 border-[#ec4899] shadow-md shadow-pink-500/20 flex items-center justify-center select-none ${
          size === "sm"
            ? "w-7 h-7 text-xs"
            : size === "lg"
            ? "w-11 h-11 text-base"
            : "w-9 h-9 text-sm"
        } ${className}`}
      >
        <span className="text-pink-400 font-black italic -rotate-12 -translate-y-px">
          ✈︎
        </span>
      </div>
    );
  }

  // Full Badge Style (Matching user screenshot)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#09090b] border-2 border-[#ec4899] shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-105 select-none ${
        size === "sm"
          ? "px-2.5 py-1 text-xs"
          : size === "lg"
          ? "px-5 py-2.5 text-base"
          : "px-3.5 py-1.5 text-sm"
      } ${className}`}
    >
      <span
        className="font-black italic tracking-tighter text-[#f472b6] leading-none uppercase"
        style={{ WebkitTextStroke: "0.5px #ffffff" }}
      >
        ITINERAI
      </span>
      <span className="text-[#a855f7] font-extrabold text-[11px] tracking-wider leading-none">
        TRIPS
      </span>
      <span className="text-[#c084fc] font-bold text-xs -rotate-12">
        ✈︎
      </span>
    </div>
  );
};
