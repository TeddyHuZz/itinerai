import React from "react";

export const TestimonialQuoteSecondSection: React.FC = () => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-36 select-none" id="perplexity-quote">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Massive Testimonial Quote */}
        <h2 className="text-[2.75rem] sm:text-[4.25rem] md:text-[5.25rem] font-black tracking-[-0.035em] text-zinc-950 leading-[1.06] mb-12 sm:mb-16">
          “We couldn’t believe<br />
          you can plan such<br />
          polished trips in{" "}
          <span className="relative inline-block mx-1">
            {/* Playful Yellow Comic / Graffiti 3D Text with Purple Stroke */}
            <span
              className="text-[#fef08a] font-black italic tracking-tighter uppercase px-3 py-1 inline-block -rotate-3 select-none text-[3.25rem] sm:text-[4.75rem] md:text-[5.75rem] leading-none"
              style={{
                WebkitTextStroke: "5px #7c3aed",
                paintOrder: "stroke fill",
                filter: "drop-shadow(3px 4px 0px #4c1d95) drop-shadow(0 0 10px rgba(124,58,237,0.3))",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              no time
            </span>
          </span>
          <br />
          at all.”
        </h2>

        {/* Author Card Badge */}
        <div className="inline-flex items-center gap-3.5 px-6 py-3.5 rounded-xl bg-white border border-zinc-200 shadow-sm text-left">
          {/* Avatar Photo */}
          <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ring-2 ring-zinc-100">
            <span className="text-sm">⚡</span>
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-zinc-950 leading-tight">
              Phi Hoang
            </h4>
            <p className="text-[12px] text-zinc-500 font-medium">
              Lead Brand Designer, Perplexity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
