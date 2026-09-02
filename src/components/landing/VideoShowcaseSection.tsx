import React from "react";
import { Play } from "lucide-react";

interface VideoShowcaseSectionProps {
  /** Optional video source URL to replace the placeholder */
  videoSrc?: string;
  /** Optional poster image URL */
  posterSrc?: string;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  videoSrc,
  posterSrc,
}) => {
  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-28 select-none" id="product">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. HUGE BOLD HEADING (Jitter Exact Style)                                */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mb-20 sm:mb-28 text-left">
          <h2 className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem] font-black tracking-[-0.035em] text-zinc-950 leading-[1.04]">
            Itinerai helps travel groups plan and experience unforgettable trips at scale. Kickstart ideas and aggregate real-time prices with AI, then take full creative control to fine-tune every detail until it’s unmistakably yours.
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* 2. LARGE VIDEO DEMONSTRATION CANVAS (Light Gray Container + Dark Frame)   */}
        {/* ========================================================================= */}
        <div className="w-full rounded-[32px] sm:rounded-[44px] bg-[#f5f5f7] p-6 sm:p-14 md:p-20 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] bg-[#111111] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex items-center justify-center border border-zinc-800 group">
            {videoSrc ? (
              <video
                src={videoSrc}
                poster={posterSrc}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              /* Video Placeholder Display */
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-linear-to-b from-[#18181b] to-[#09090b]">
                {/* Visual Graphic Content (Matching Jitter's "SHARE YOUR WORLD" Artwork) */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
                    FONS MANS · STUDIO
                  </span>
                  <div className="text-white font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter leading-[0.9] select-none mb-6">
                    <div>SHARE</div>
                    <div>YOUR</div>
                    <div className="text-zinc-400">WORLD</div>
                  </div>

                  {/* Play Button Indicator */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition-transform duration-200 group-hover:scale-110 shadow-lg">
                    <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                  </div>
                  <span className="text-[12px] text-zinc-400 font-medium mt-3">
                    Click to play product demo
                  </span>
                </div>

                {/* Ambient Glows */}
                <div className="absolute inset-0 bg-radial from-violet-600/15 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
