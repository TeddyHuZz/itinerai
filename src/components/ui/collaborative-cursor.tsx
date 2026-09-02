import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollaborativeCursorProps {
  name: string;
  avatar: string;
  actionText?: string;
  color?: "orange" | "violet" | "emerald" | "blue" | "rose";
  x: number | string;
  y: number | string;
  className?: string;
}

const colorMap = {
  orange: {
    cursor: "fill-orange-500 stroke-white",
    badge: "bg-orange-500 text-white",
  },
  violet: {
    cursor: "fill-violet-600 stroke-white",
    badge: "bg-violet-600 text-white",
  },
  emerald: {
    cursor: "fill-emerald-500 stroke-white",
    badge: "bg-emerald-500 text-white",
  },
  blue: {
    cursor: "fill-sky-500 stroke-white",
    badge: "bg-sky-500 text-white",
  },
  rose: {
    cursor: "fill-rose-500 stroke-white",
    badge: "bg-rose-500 text-white",
  },
};

export const CollaborativeCursor: React.FC<CollaborativeCursorProps> = ({
  name,
  avatar,
  actionText,
  color = "orange",
  x,
  y,
  className,
}) => {
  const chosenColor = colorMap[color] || colorMap.orange;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ left: x, top: y }}
      className={cn("absolute pointer-events-none z-30 flex flex-col items-start gap-1 select-none", className)}
    >
      {/* Pointer SVG */}
      <svg
        className={cn("w-5 h-5 drop-shadow-md", chosenColor.cursor)}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path d="M5.653 4.144a1 1 0 011.517-.674l13.567 8.35a1 1 0 01-.065 1.748l-5.32 2.378a1 1 0 00-.518.518l-2.378 5.32a1 1 0 01-1.748.065L4.979 7.908a1 1 0 01.674-1.517l.001-.001z" />
      </svg>

      {/* Pill Badge */}
      <div
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 backdrop-blur-sm",
          chosenColor.badge
        )}
      >
        <span className="text-xs">{avatar}</span>
        <span>{name}</span>
        {actionText && (
          <span className="opacity-90 font-normal text-[11px] bg-black/20 px-1.5 py-0.5 rounded-full">
            {actionText}
          </span>
        )}
      </div>
    </motion.div>
  );
};
