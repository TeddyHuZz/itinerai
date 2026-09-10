import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
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
  onLoginSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onClose,
  onOpenLegal,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(
    initialMode === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("alex@travel.com");
  const [password, setPassword] = useState("demo123456");
  const [name, setName] = useState("Alex Morgan");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      onLoginSuccess?.();
    }, 1200);
  };

  const handleSocialAuth = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      onLoginSuccess?.();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-100 flex flex-col md:flex-row bg-white overflow-y-auto select-none"
    >
      {/* ========================================================================= */}
      {/* LEFT / TOP COLUMN: Scenic Mountain Header & Brand Showcase                */}
      {/* ========================================================================= */}
      <div className="relative w-full md:w-1/2 lg:w-[48%] xl:w-[45%] shrink-0 h-36 sm:h-44 md:h-auto md:min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
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
        <div className="relative z-10 flex flex-col justify-between h-full w-full">
          <div className="flex items-center justify-between w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="group px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1 duration-200" />
              <span>Back to home</span>
            </motion.button>

            {/* Mobile close button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="md:hidden w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Product Title & Tagline */}
          <div className="flex flex-col items-start text-left pt-1 sm:pt-2 md:pt-6">
            <h1 className="text-xl sm:text-2xl md:text-4xl xl:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Itinerai
            </h1>
            <p className="text-[11px] sm:text-xs md:text-base font-medium text-white/85 mt-0.5 md:mt-2 tracking-wide drop-shadow-md">
              Plan together. Wander together.
            </p>
          </div>
        </div>

        {/* Bottom subtle copyright (Desktop only) */}
        <div className="relative z-10 hidden md:block text-xs text-white/50 text-left">
          &copy; {new Date().getFullYear()} Itinerai
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT / MAIN COLUMN: Interactive Login & Sign Up Screen                   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between bg-white px-5 py-4 sm:px-10 sm:py-8 lg:p-14 overflow-y-visible md:overflow-y-auto md:min-h-screen">
        {/* Desktop Close Button */}
        <div className="hidden md:flex items-center justify-end w-full max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Center Auth Form Container */}
        <div className="w-full max-w-md mx-auto my-0 md:my-auto py-2 sm:py-6">
          {/* Mode Switcher Tabs with Animated Sliding Pill */}
          <div className="relative flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200/80 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`relative z-10 flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer ${
                mode === "login"
                  ? "text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {mode === "login" && (
                <motion.div
                  layoutId="auth-tab-pill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-xs"
                />
              )}
              <span className="relative z-10">Log In</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`relative z-10 flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer ${
                mode === "signup"
                  ? "text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {mode === "signup" && (
                <motion.div
                  layoutId="auth-tab-pill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-xs"
                />
              )}
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success Confirmation State with Redirecting Animation */
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
                  Redirecting to your collaborative workspace...
                </p>

                {/* Animated Redirect Progress Bar */}
                <div className="w-48 h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-6">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
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
                <div className="mb-4 sm:mb-6 text-left">
                  <h2 className="text-xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">
                    Enter your email and password to access your itineraries.
                  </p>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-zinc-300 active:scale-[0.99]"
                  >
                    <GoogleIcon size={16} />
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <AppleIcon size={16} />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-4 sm:mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <span className="relative bg-white px-3 text-[10px] sm:text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    or continue with email
                  </span>
                </div>

                {/* Input Fields */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 text-left">
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-700 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 sm:top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@travel.com"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] sm:text-xs font-bold text-zinc-700">Password</label>
                      <a
                        href="#forgot"
                        className="text-[11px] sm:text-xs text-[#a33917] font-semibold hover:underline"
                      >
                        Forgot?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 sm:top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 sm:top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
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

                  <div className="flex items-center justify-between mt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-zinc-300 text-[#a33917] focus:ring-[#a33917] accent-[#a33917]"
                      />
                      <span className="text-[11px] sm:text-xs text-zinc-600 font-medium">Remember for 30 days</span>
                    </label>
                  </div>

                  {/* Primary Terracotta Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3 sm:py-3.5 px-6 mt-1 sm:mt-2 rounded-xl bg-[#a33917] hover:bg-[#8f3214] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#a33917]/20 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    Log In
                  </button>

                  <div className="text-center mt-2 sm:mt-3">
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
                <div className="mb-4 sm:mb-6 text-left">
                  <h2 className="text-xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-1">
                    Start planning unforgettable adventures with your favorite people.
                  </p>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-zinc-300 active:scale-[0.99]"
                  >
                    <GoogleIcon size={16} />
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <AppleIcon size={16} />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-4 sm:mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <span className="relative bg-white px-3 text-[10px] sm:text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    or register with email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 text-left">
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-700 block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 sm:top-3.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Taylor"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-700 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 sm:top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@travel.com"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] sm:text-xs font-bold text-zinc-700 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 sm:top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#a33917] focus:ring-2 focus:ring-[#a33917]/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 sm:top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
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
                    className="w-full py-3 sm:py-3.5 px-6 mt-1 sm:mt-2 rounded-xl bg-[#a33917] hover:bg-[#8f3214] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#a33917]/20 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    Create Account
                  </button>

                  <div className="text-center mt-2 sm:mt-3">
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
        <div className="w-full max-w-md mx-auto pt-3 sm:pt-6 pb-4 sm:pb-0 text-center text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed">
          By signing up or logging in, you agree to Itinerai&apos;s{" "}
          <button
            type="button"
            onClick={() => onOpenLegal?.("terms")}
            className="text-[#a33917] hover:underline font-medium cursor-pointer transition-colors"
          >
            Terms of Service
          </button>{" "}
          and acknowledge our{" "}
          <button
            type="button"
            onClick={() => onOpenLegal?.("privacy")}
            className="text-[#a33917] hover:underline font-medium cursor-pointer transition-colors"
          >
            Privacy Policy
          </button>
          .
        </div>
      </div>
    </motion.div>
  );
};

