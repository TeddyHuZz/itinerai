import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { CardShowcaseSection } from "@/components/landing/CardShowcaseSection";
import { VideoShowcaseSection } from "@/components/landing/VideoShowcaseSection";
import { StackedCardsSection } from "@/components/landing/StackedCardsSection";
import { FeaturesBentoSection } from "@/components/landing/FeaturesBentoSection";
import { FeaturesDetailSection } from "@/components/landing/FeaturesDetailSection";
import { TestimonialQuoteSection } from "@/components/landing/TestimonialQuoteSection";
import { ScaleFeaturesSection } from "@/components/landing/ScaleFeaturesSection";
import { TestimonialQuoteSecondSection } from "@/components/landing/TestimonialQuoteSecondSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-purple-200 selection:text-zinc-950">
      {/* Dynamic Floating Navbar on Scroll */}
      <Navbar />

      <main>
        {/* Section 1: Jitter Exact Hero with 3D Flipping Logos */}
        <HeroSection />

        {/* Section 2: Infinite Left-Sliding Cards */}
        <CardShowcaseSection />

        {/* Section 3: Huge Heading + Video Showcase Canvas */}
        <VideoShowcaseSection />

        {/* Section 4: Scroll-Driven Stacked Cards (Slide Up One by One) */}
        <StackedCardsSection />

        {/* Section 5: Supercharge Your Creativity Bento 2x2 Grid */}
        <FeaturesBentoSection />

        {/* Section 6: Details Worth Obsessing Over 6-Grid */}
        <FeaturesDetailSection />

        {/* Section 7: Massive Testimonial Quote with Cyan Marker (Deliveroo) */}
        <TestimonialQuoteSection />

        {/* Section 8: Where Groups Plan at Scale */}
        <ScaleFeaturesSection />

        {/* Section 9: Second Testimonial Quote with 3D Comic Stroke (Perplexity) */}
        <TestimonialQuoteSecondSection />
      </main>

      {/* Section 10: "Try Itinerai today" CTA + 5-Col Footer Links + Black Newsletter Banner */}
      <FooterSection />
    </div>
  );
}
