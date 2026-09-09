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

interface AuthPageProps {
  initialMode?: "choose" | "signup" | "login";
  onClose: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onClose,
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
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:border-zinc-300"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.43-6.24-9.53-11.11-20.4-14.61-32.6-3.5-12.21-5.25-23.49-5.25-33.86 0-14.18 3.52-25.79 10.57-34.82 7.04-9.03 16.03-13.62 26.96-13.78 4.71 0 9.87 1.25 15.48 3.76 5.6 2.5 9.27 3.81 11 3.91 1.45 0 5.4-1.39 11.85-4.17 6.45-2.77 12.06-3.99 16.83-3.66 12.5.83 22.37 5.79 29.62 14.88-11.03 6.69-16.39 16.03-16.09 28.02.3 9.42 4.04 17.26 11.22 23.51 7.18 6.26 15.54 9.94 25.08 11.05-2.4 7.6-5.69 15.74-9.86 24.43zM119.22 33.55c0-7.39 2.67-14.32 8.01-20.78 5.34-6.46 11.89-10.42 19.65-11.87.21 1.76.32 3.3.32 4.62 0 7.33-2.74 14.37-8.22 21.13-5.48 6.75-12.09 10.74-19.82 11.95-.21-1.63-.32-3.32-.32-5.05z" />
                    </svg>
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
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:border-zinc-300"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleSocialAuth}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.43-6.24-9.53-11.11-20.4-14.61-32.6-3.5-12.21-5.25-23.49-5.25-33.86 0-14.18 3.52-25.79 10.57-34.82 7.04-9.03 16.03-13.62 26.96-13.78 4.71 0 9.87 1.25 15.48 3.76 5.6 2.5 9.27 3.81 11 3.91 1.45 0 5.4-1.39 11.85-4.17 6.45-2.77 12.06-3.99 16.83-3.66 12.5.83 22.37 5.79 29.62 14.88-11.03 6.69-16.39 16.03-16.09 28.02.3 9.42 4.04 17.26 11.22 23.51 7.18 6.26 15.54 9.94 25.08 11.05-2.4 7.6-5.69 15.74-9.86 24.43zM119.22 33.55c0-7.39 2.67-14.32 8.01-20.78 5.34-6.46 11.89-10.42 19.65-11.87.21 1.76.32 3.3.32 4.62 0 7.33-2.74 14.37-8.22 21.13-5.48 6.75-12.09 10.74-19.82 11.95-.21-1.63-.32-3.32-.32-5.05z" />
                    </svg>
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
          <a href="#terms" className="text-[#a33917] hover:underline font-medium">
            Terms of Service
          </a>{" "}
          and acknowledge our{" "}
          <a href="#privacy" className="text-[#a33917] hover:underline font-medium">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

