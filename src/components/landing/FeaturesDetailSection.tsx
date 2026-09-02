import React from "react";
import { 
  PenTool, 
  Grid3X3, 
  Sparkles, 
  Droplet, 
  Video, 
  Type
} from "lucide-react";

interface FeatureDetailItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DETAIL_ITEMS: FeatureDetailItem[] = [
  {
    icon: <PenTool className="w-4 h-4 text-zinc-950" />,
    title: "Pen tool and morphing",
    description: "Animate along curved paths and morph custom vector shapes and travel route maps.",
  },
  {
    icon: <Grid3X3 className="w-4 h-4 text-zinc-950" />,
    title: "Gradients & themes",
    description: "Build and customize smooth multi-stop gradients across cards, tags, and itinerary blocks.",
  },
  {
    icon: <Sparkles className="w-4 h-4 text-zinc-950" />,
    title: "Blur & glass depth",
    description: "Add live backdrop blur to maps and layers, or dial in depth for instant focus.",
  },
  {
    icon: <Droplet className="w-4 h-4 text-zinc-950" />,
    title: "Blend modes",
    description: "Add depth and editorial texture to your trip cards and shared media reels.",
  },
  {
    icon: <Video className="w-4 h-4 text-zinc-950" />,
    title: "Audio and video",
    description: "Easily attach live vlog snippets, restaurant reels, and voice notes directly to pins.",
  },
  {
    icon: <Type className="w-4 h-4 text-zinc-950" />,
    title: "1,500+ fonts & icons",
    description: "Choose from a library of 1,500+ free fonts, or import custom group assets in a click.",
  },
];

export const FeaturesDetailSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-28 select-none" id="details">
      <div className="max-w-350 mx-auto px-6 sm:px-12">
        {/* Header with Title and Right Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.035em] text-zinc-950 leading-[1.05] max-w-md text-left">
            Details worth<br />
            obsessing over
          </h2>

          <div>
            <a
              href="#explore"
              className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-xs inline-block"
            >
              Explore all features
            </a>
          </div>
        </div>

        {/* 3-Column, 2-Row Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 text-left">
          {DETAIL_ITEMS.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start">
              {/* Icon & Title */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="p-1 rounded bg-zinc-100 flex items-center justify-center">
                  {item.icon}
                </span>
                <h4 className="text-[17px] font-bold text-zinc-950 tracking-tight">
                  {item.title}
                </h4>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 font-normal leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
