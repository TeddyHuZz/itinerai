import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled((prev) => {
        // Hysteresis buffer: activates at > 60px, deactivates at < 15px
        if (!prev && currentY > 60) return true;
        if (prev && currentY < 15) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Static Spacer to prevent layout jumps or jitter during transition */}
      <div className="h-20 w-full shrink-0 bg-transparent" />

      {/* Fixed Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none w-full flex justify-center transition-all duration-300 ease-out">
        <div
          className={`pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between ${
            isScrolled
              ? "mt-4 max-w-5xl w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] px-6 sm:px-8 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-2xl shadow-zinc-950/10"
              : "mt-0 max-w-7xl w-full px-8 sm:px-12 h-20 bg-white"
          }`}
        >
          {/* Brand Wordmark (Jitter Exact Style) */}
          <div className="flex items-center gap-10">
            <a href="#" className="flex items-center">
              <span
                className={`font-extrabold tracking-[-0.03em] text-zinc-950 font-sans transition-all ${
                  isScrolled ? "text-[22px]" : "text-[26px]"
                }`}
              >
                Itinerai
              </span>
            </a>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-zinc-800">
              <a href="#product" className="hover:text-zinc-950 transition-colors">
                Product
              </a>
              <a href="#customers" className="hover:text-zinc-950 transition-colors">
                Customers
              </a>
              <a href="#templates" className="hover:text-zinc-950 transition-colors">
                Templates
              </a>
              <a href="#pricing" className="hover:text-zinc-950 transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          {/* Right Actions (Jitter Style) */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#login"
              className="text-[14px] font-medium text-zinc-800 hover:text-zinc-950 transition-colors"
            >
              Log in
            </a>
            <a
              href="#try"
              className={`rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium transition-all shadow-xs ${
                isScrolled ? "px-4 py-2 text-[13px]" : "px-5 py-2.5 text-[14px]"
              }`}
            >
              Try for free
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-800 hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto absolute top-20 left-4 right-4 border border-zinc-100 bg-white px-8 py-5 rounded-2xl flex flex-col gap-4 text-left shadow-2xl">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-800 py-1"
            >
              Product
            </a>
            <a
              href="#customers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-800 py-1"
            >
              Customers
            </a>
            <a
              href="#templates"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-800 py-1"
            >
              Templates
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-800 py-1"
            >
              Pricing
            </a>
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-3">
              <a href="#login" className="text-sm font-medium text-zinc-800 py-1">
                Log in
              </a>
              <a
                href="#try"
                className="w-full text-center px-5 py-2.5 rounded-full bg-zinc-950 text-white text-sm font-medium"
              >
                Try for free
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
