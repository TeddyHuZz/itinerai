import React from "react";

export const TestimonialQuoteSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none" id="customers">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Massive Testimonial Quote */}
        <h2 className="text-[2.75rem] sm:text-[4.25rem] md:text-[5.25rem] font-black tracking-[-0.035em] text-zinc-950 leading-[1.06] mb-12 sm:mb-16">
          “Itinerai gives you no<br />
          excuse to skip{" "}
          <span className="relative inline-block px-2">
            {/* Cyan Marker Highlight (Jitter Exact Style) */}
            <span
              className="absolute inset-0 -rotate-2 rounded-md bg-[#38bdf8] opacity-90 -z-10 shadow-sm"
              style={{
                filter: "drop-shadow(0 0 6px rgba(56,189,248,0.4))",
              }}
            />
            <span className="text-zinc-950 font-black tracking-tighter">
              MOTION.
            </span>
          </span>
          <br />
          It’s that easy.”
        </h2>

        {/* Author Card Badge */}
        <div className="inline-flex items-center gap-3.5 px-6 py-3.5 rounded-xl bg-white border border-zinc-200 shadow-sm text-left">
          {/* Avatar Photo */}
          <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ring-2 ring-zinc-100">
            <span className="text-sm">🕶️</span>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-zinc-950 leading-tight">
              Matt Sewell
            </h4>
            <p className="text-[12px] text-zinc-500 font-medium">
              Product Designer, Deliveroo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
