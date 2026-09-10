import React, { useState } from "react";
import { Play, ExternalLink, Sparkles, RotateCcw } from "lucide-react";

interface VideoShowcaseSectionProps {
  /** Optional video source URL (e.g. mp4/webm) to replace the YouTube embed */
  videoSrc?: string;
  /** Optional poster image URL */
  posterSrc?: string;
  /** YouTube video ID (defaults to Team Axiom's pitch video 'O1C6u-I6iaM') */
  youtubeId?: string;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  videoSrc,
  posterSrc,
  youtubeId = "O1C6u-I6iaM",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const youtubeUrl = `https://youtu.be/${youtubeId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  const defaultPoster = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <section className="w-full bg-white pt-24 sm:pt-36 pb-28 select-none scroll-mt-20" id="product">
      <div className="max-w-350 mx-auto px-6 sm:px-12">
        {/* ========================================================================= */}
        {/* 1. HUGE BOLD HEADING (Jitter Exact Style)                                */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mb-20 sm:mb-28 text-left">
          <h2 className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem] font-black tracking-[-0.035em] text-zinc-950 leading-[1.04]">
            ItinerAI helps travel groups plan and experience unforgettable trips at scale. Kickstart ideas and aggregate real-time prices with AI, then take full creative control to fine-tune every detail until it’s unmistakably yours.
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* 2. LARGE VIDEO DEMONSTRATION CANVAS (Light Gray Container + Dark Frame)   */}
        {/* ========================================================================= */}
        <div className="w-full rounded-4xl sm:rounded-[44px] bg-[#f5f5f7] p-6 sm:p-14 md:p-20 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-5xl aspect-video bg-[#09090b] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex items-center justify-center border border-zinc-800 group">
            {videoSrc ? (
              <video
                src={videoSrc}
                poster={posterSrc || defaultPoster}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            ) : isPlaying ? (
              <div className="relative w-full h-full">
                <iframe
                  src={embedUrl}
                  title="Team Axiom ItinerAI Pitch & Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
                {/* Return / Close Overlay Button */}
                <button
                  onClick={() => setIsPlaying(false)}
                  title="Return to preview"
                  className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white/90 text-xs font-medium backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            ) : (
              /* High-End Product Showcase Card */
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 cursor-pointer overflow-hidden"
              >
                {/* Background Thumbnail Image with Cinematic Gradient */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${posterSrc || defaultPoster})`,
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-radial from-violet-600/20 via-transparent to-transparent pointer-events-none" />

                {/* Top Bar Header */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono tracking-widest text-zinc-300 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Team Axiom · CodeNection 2026</span>
                  </div>

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-medium text-white transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Center Hero & Play Trigger */}
                <div className="relative z-10 flex flex-col items-center text-center my-auto py-6">
                  {/* Glowing Play Button */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl mb-5 group-hover:border-purple-400/50">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white translate-x-0.5 transition-transform group-hover:scale-105" />
                  </div>

                  <h3 className="text-white font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight select-none mb-2 drop-shadow-md">
                    Watch ItinerAI in Action
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-xl font-normal drop-shadow">
                    See our on-device WebGPU AI, live Amadeus booking integration, and collaborative group workflow in a 4-minute walkthrough.
                  </p>
                </div>

                {/* Bottom Tags Strip */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Pitch & Prototype Demo
                    </span>
                    <span className="hidden sm:inline text-zinc-600">•</span>
                    <span className="hidden sm:inline text-zinc-400">4-min Walkthrough</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Llama 3.2</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">WebGPU</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Amadeus API</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
