import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Compass,
  X,
  Check,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { GoogleIcon, AppleIcon } from "@/components/ui/Icons";

interface AuthPageProps {
  initialMode?: "choose" | "signup" | "login";
  onClose: () => void;
  onOpenLegal?: (type: "terms" | "privacy") => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onClose,
  onOpenLegal,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(
    initialMode === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSocialAuth = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col md:flex-row bg-white overflow-y-auto select-none">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Scenic Mountain Background & Brand Showcase                  */}
      {/* ========================================================================= */}
      <div className="relative w-full md:w-1/2 lg:w-[48%] xl:w-[45%] shrink-0 min-h-65 md:min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 sm:p-8 lg:p-12 overflow-hidden">
        {/* Scenic Mountain Background Wallpaper */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/auth_mountain_bg.jpg')`,
          }}
        />

        {/* Ambient Overlay Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Header Controls & Product Title */}
        <div className="relative z-10 flex flex-col items-start space-y-6">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </button>

            {/* Mobile close button (shown only on small screens on the hero image) */}
            <button
              onClick={onClose}
              className="md:hidden w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Product Title & Tagline (positioned below back button) */}
          <div className="hidden md:flex flex-col items-start text-left pt-4 lg:pt-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Itinerai
            </h1>
            <p className="text-sm lg:text-base font-medium text-white/85 mt-2 tracking-wide drop-shadow-md">
              Plan together. Wander together.
            </p>
          </div>
        </div>

        {/* Bottom subtle copyright */}
        <div className="relative z-10 hidden md:block text-xs text-white/50 text-left">
          &copy; {new Date().getFullYear()} Itinerai
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Interactive Login & Sign Up Screen                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between bg-[#faf9f6] md:bg-white p-6 sm:p-10 lg:p-14 overflow-y-auto min-h-screen">
        {/* Top Header bar with Desktop Close Button */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          {/* Mobile brand header (shown if screen < md) */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#09090b] border border-zinc-700 flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900 text-sm tracking-tight">Itinerai</span>
          </div>

          <div className="hidden md:block" />

          <button
            onClick={onClose}
            className="hidden md:flex w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Auth Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80 mb-8">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                mode === "login"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success Confirmation State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">
                  {mode === "signup" ? "Account Created!" : "Welcome back!"}
                </h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-xs">
                  Preparing your trips and collaborative itineraries...
                </p>
              </motion.div>
            ) : mode === "login" ? (
              /* View: Log In Form */
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="mb-6 text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Enter your email and password to access your itineraries.
                  </p>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:border-zinc-300 active:scale-[0.99]"
                  >
                    <GoogleIcon size={18} />
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                  >
                    <AppleIcon size={18} />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <span className="relative bg-[#faf9f6] md:bg-white px-3 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    or continue with email
                  </span>
                </div>

                {/* Input Fields */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@travel.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-zinc-700">Password</label>
                      <a
                        href="#forgot"
                        className="text-xs text-[#a33917] font-semibold hover:underline"
                      >
                        Forgot?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-[#a33917] focus:ring-[#a33917] accent-[#a33917]"
                      />
                      <span className="text-xs text-zinc-600 font-medium">Remember for 30 days</span>
                    </label>
                  </div>

                  {/* Primary Terracotta Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 mt-2 rounded-xl bg-[#a33917] hover:bg-[#8f3214] text-white font-bold text-sm shadow-md shadow-[#a33917]/20 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    Log In
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-xs text-zinc-500">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-[#a33917] font-bold hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </span>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* View: Sign Up Form */
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <div className="mb-6 text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Start planning unforgettable adventures with your favorite people.
                  </p>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:border-zinc-300 active:scale-[0.99]"
                  >
                    <GoogleIcon size={18} />
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                  >
                    <AppleIcon size={18} />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <span className="relative bg-[#faf9f6] md:bg-white px-3 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    or register with email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Taylor"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@travel.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 mt-2 rounded-xl bg-[#a33917] hover:bg-[#8f3214] text-white font-bold text-sm shadow-md shadow-[#a33917]/20 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    Create Account
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-xs text-zinc-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-[#a33917] font-bold hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </span>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legal Disclaimer / Terms Footer on Right */}
        <div className="w-full max-w-md mx-auto pt-6 text-center text-[11px] text-zinc-400 leading-relaxed">
          By signing up or logging in, you agree to Itinerai&apos;s{" "}
          <button
            type="button"
            onClick={() => onOpenLegal?.("terms")}
            className="text-[#a33917] hover:underline font-medium cursor-pointer"
          >
            Terms of Service
          </button>{" "}
          and acknowledge our{" "}
          <button
            type="button"
            onClick={() => onOpenLegal?.("privacy")}
            className="text-[#a33917] hover:underline font-medium cursor-pointer"
          >
            Privacy Policy
          </button>
          .
        </div>
      </div>
    </div>
  );
};

