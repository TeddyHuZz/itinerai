import React from "react";
import { 
  Cpu, 
  Plane, 
  Receipt, 
  Vote, 
  Award, 
  FileCheck
} from "lucide-react";

interface FeatureDetailItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DETAIL_ITEMS: FeatureDetailItem[] = [
  {
    icon: <Cpu className="w-4 h-4 text-purple-600" />,
    title: "On-Device WebGPU AI",
    description: "Runs Llama 3.2 locally inside your browser via WebGPU. Private, instantaneous, and zero cloud API subscription costs.",
  },
  {
    icon: <Plane className="w-4 h-4 text-blue-600" />,
    title: "Real-Time Amadeus GDS",
    description: "Live airfare searches and hotel availability with direct hand-off to Skyscanner and Expedia for seamless booking.",
  },
  {
    icon: <Receipt className="w-4 h-4 text-emerald-600" />,
    title: "Tesseract OCR Bill Scanner",
    description: "Snap crumpled receipts from overseas dinners or Grab rides to digitize line items and auto-calculate fair debts.",
  },
  {
    icon: <Vote className="w-4 h-4 text-amber-600" />,
    title: "Group Consensus Polls",
    description: "Eliminate endless WhatsApp deliberation with built-in activity voting, quorum thresholds, and automatic itinerary lock-in.",
  },
  {
    icon: <Award className="w-4 h-4 text-rose-600" />,
    title: "Gamified Badges & XP",
    description: "Earn collectible badges like Globe Trotter, Frugal Flyer, and Night Owl as your travel group plans and finishes trips.",
  },
  {
    icon: <FileCheck className="w-4 h-4 text-indigo-600" />,
    title: "Tax-Compliant E-Invoicing",
    description: "Generate officially certified digital e-invoices with LHDN QR codes, companion debt allocations, and printable expense sheets.",
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
