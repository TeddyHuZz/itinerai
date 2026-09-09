import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Printer,
  Lock,
  Sparkles,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { DiscordIcon } from "@/components/ui/Icons";

interface LegalModalProps {
  initialType?: "terms" | "privacy";
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialType = "terms",
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">(initialType);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    setActiveTab(initialType);
  }, [initialType]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const termsSections = [
    { id: "terms-acceptance", title: "1. Acceptance of Terms" },
    { id: "terms-accounts", title: "2. Accounts & Group Workspaces" },
    { id: "terms-content", title: "3. User Itineraries & Rights" },
    { id: "terms-ai", title: "4. AI Recommendations Disclaimer" },
    { id: "terms-expenses", title: "5. Shared Expenses & Budgets" },
    { id: "terms-conduct", title: "6. Acceptable Use & Conduct" },
    { id: "terms-thirdparty", title: "7. Third-Party Travel Providers" },
    { id: "terms-liability", title: "8. Limitation of Liability" },
    { id: "terms-termination", title: "9. Account Termination" },
    { id: "terms-contact", title: "10. Governing Law & Inquiries" },
  ];

  const privacySections = [
    { id: "privacy-collection", title: "1. Information We Collect" },
    { id: "privacy-use", title: "2. How We Use Travel Data" },
    { id: "privacy-collaboration", title: "3. Group Collaboration & Visibility" },
    { id: "privacy-ai", title: "4. AI Processing & Models" },
    { id: "privacy-sharing", title: "5. Third-Party Subprocessors" },
    { id: "privacy-security", title: "6. Data Security & Encryption" },
    { id: "privacy-retention", title: "7. Data Retention & Deletion" },
    { id: "privacy-rights", title: "8. Your Rights (GDPR & CCPA)" },
    { id: "privacy-cookies", title: "9. Cookies & Local Storage" },
    { id: "privacy-contact", title: "10. Contact Privacy Officer" },
  ];

  const currentSections = activeTab === "terms" ? termsSections : privacySections;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.99, y: 14 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-110 flex flex-col bg-zinc-50 text-zinc-900 overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* TOP STICKY APP BAR                                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="group p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
            <span className="hidden sm:inline">Back to Itinerai</span>
          </motion.button>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-950">
              Itinerai
            </span>
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              Legal Center
            </span>
          </div>
        </div>

        {/* Tab Switcher with Animated Sliding Pill */}
        <div className="relative flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200/80">
          <button
            onClick={() => setActiveTab("terms")}
            className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "terms"
                ? "text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {activeTab === "terms" && (
              <motion.div
                layoutId="legal-tab-pill"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
              />
            )}
            <span className="relative z-10">Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "privacy"
                ? "text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {activeTab === "privacy" && (
              <motion.div
                layoutId="legal-tab-pill"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
              />
            )}
            <span className="relative z-10">Privacy Policy</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            title="Print document"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: SIDEBAR + CONTENT                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex overflow-hidden">
        {/* Left Navigation Sidebar (Desktop Table of Contents) */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-between p-6 border-r border-zinc-200/80 overflow-y-auto bg-white/50">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Contents
              </p>
              <nav className="space-y-1">
                {currentSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                      activeSection === sec.id
                        ? "bg-[#a33917]/10 text-[#a33917] font-semibold"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Trust Assurance Badge */}
            <div className="p-4 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Traveler Privacy First</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Your itineraries and collaborative plans belong to you. We never sell
                individual travel tracking data to third-party ad brokers.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 pt-4 border-t border-zinc-100">
            Itinerai Technologies Inc. &bull; 2026
          </div>
        </aside>

        {/* Right Scrollable Document Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-14 bg-white">
          <div className="max-w-3xl mx-auto pb-24 text-left">
            {activeTab === "terms" ? (
              /* ================================================================= */
              /* TERMS OF SERVICE DOCUMENT                                         */
              /* ================================================================= */
              <article className="space-y-10">
                {/* Header Banner */}
                <div className="border-b border-zinc-100 pb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#a33917] text-xs font-bold mb-4">
                    <FileText className="w-3.5 h-3.5" />
                    <span>User Agreement</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                    Terms of Service
                  </h1>
                  <p className="text-sm text-zinc-500 mt-2 font-normal">
                    Effective Date: March 1, 2026 &bull; Version 2.4
                  </p>

                  <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-xs text-zinc-700 leading-relaxed">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-zinc-900">In Brief: </strong>
                      Itinerai provides collaborative trip planning and AI-assisted itinerary
                      crafting. By using our platform, you agree to respect your group members,
                      verify third-party bookings independently, and use our tools responsibly.
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <section id="terms-acceptance" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">1. Acceptance of Terms</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    By accessing or using the website, mobile applications, APIs, or collaborative
                    services provided by Itinerai Technologies Inc. (&ldquo;Itinerai&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
                    or &ldquo;our&rdquo;), you acknowledge that you have read, understood, and agreed to
                    be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you are creating a group itinerary
                    on behalf of an organization or travel party, you represent that you have the authority
                    to accept these Terms on their behalf.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="terms-accounts" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">2. Accounts & Group Workspaces</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    To access real-time collaboration, you must register for an account using a valid
                    email address or supported third-party identity provider (Google, Apple). You agree
                    to:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1.5">
                    <li>Maintain the confidentiality of your login credentials.</li>
                    <li>Ensure all information you provide is accurate and kept up-to-date.</li>
                    <li>Accept responsibility for all activities occurring under your account or shared workspaces.</li>
                    <li>Be at least 13 years old (or 16 in the European Economic Area) to create an account.</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="terms-content" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">3. User Itineraries & Content Rights</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    You retain full intellectual property ownership of all custom notes, uploaded photos,
                    personal checklists, and custom itinerary routes created within Itinerai. By making
                    a trip &ldquo;Public&rdquo; or sharing a community template, you grant Itinerai a worldwide,
                    non-exclusive, royalty-free license to display, index, and distribute that template
                    to other wanderers on the platform.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="terms-ai" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">4. AI Recommendations & Third-Party APIs Disclaimer</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Itinerai features artificial intelligence engines that analyze travel trends, calculate
                    travel durations, and generate suggested stops. While we aim for exceptional accuracy:
                  </p>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
                    <p>
                      <strong>Important Notice:</strong> Operating hours, admission prices, flight routes,
                      visa requirements, and weather conditions generated by AI or aggregated via travel
                      APIs are provided for planning guidance only. Travelers are solely responsible for
                      confirming reservations directly with airlines, hotels, tour operators, and embassies.
                    </p>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="terms-expenses" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">5. Shared Expenses & Expense Tracking</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Itinerai includes collaborative expense splitting and currency conversion calculators.
                    Itinerai is not a licensed banking institution, payment facilitator, or money transmitter.
                    All financial settlements, refunds, and reimbursement payments take place offline or
                    via third-party payment providers at the users&apos; independent discretion.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="terms-conduct" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">6. Acceptable Use & Conduct</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    When collaborating on Itinerai, you agree not to:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1.5">
                    <li>Upload abusive, defamatory, discriminatory, or unlawful materials.</li>
                    <li>Scrape, reverse-engineer, or overload our infrastructure or AI endpoints.</li>
                    <li>Share malicious links, unauthorized advertisements, or commercial spam.</li>
                    <li>Impersonate other travelers or breach fellow users&apos; private itineraries.</li>
                  </ul>
                </section>

                {/* Section 7 */}
                <section id="terms-thirdparty" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">7. Third-Party Travel Providers</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Our platform integrates mapping data (e.g., OpenStreetMap, Google Maps), booking
                    affiliates, and transit APIs. Itinerai is not responsible for cancellations, delays,
                    injuries, property damages, or service failures caused by third-party transportation
                    companies or accommodation providers.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="terms-liability" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">8. Limitation of Liability</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    To the maximum extent permitted by applicable law, Itinerai shall not be liable for
                    any indirect, incidental, special, consequential, or punitive damages, including loss of
                    profits, missed flights, travel disruptions, data corruption, or personal safety incidents
                    arising out of your travel activities.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="terms-termination" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">9. Account Termination</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    You may delete your account and export your itineraries at any time from your account
                    settings. We reserve the right to suspend or terminate accounts that repeatedly violate
                    these terms or compromise workspace security.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="terms-contact" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">10. Governing Law & Inquiries</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    These Terms are governed by general applicable principles of good faith and contract law. For inquiries, questions, or concerns regarding these Terms, please reach out via:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      href="mailto:swenfei04@gmail.com"
                      className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-white border border-zinc-200/80 hover:border-[#a33917]/40 shadow-2xs hover:shadow-sm transition-all flex items-center gap-3 text-xs group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-[#a33917]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] text-zinc-400 font-medium">Direct Email</div>
                        <div className="font-semibold text-zinc-900 group-hover:text-[#a33917] truncate transition-colors">
                          swenfei04@gmail.com
                        </div>
                      </div>
                    </a>

                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex items-center gap-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shrink-0">
                        <DiscordIcon size={18} className="text-[#5865F2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] text-zinc-400 font-medium">Discord</div>
                        <div className="font-semibold text-zinc-900 font-mono">teddyhuzz0210</div>
                      </div>
                    </div>
                  </div>
                </section>
              </article>
            ) : (
              /* ================================================================= */
              /* PRIVACY POLICY DOCUMENT                                           */
              /* ================================================================= */
              <article className="space-y-10">
                {/* Header Banner */}
                <div className="border-b border-zinc-100 pb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Traveler Data Protection</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                    Privacy Policy
                  </h1>
                  <p className="text-sm text-zinc-500 mt-2 font-normal">
                    Effective Date: March 1, 2026 &bull; Compliant with GDPR, CCPA & Global Travel Privacy
                  </p>

                  <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 text-xs text-zinc-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-zinc-900">Our Privacy Promise: </strong>
                      We build tools to bring travelers together, not to monetize personal locations or
                      private messages. You control what your travel group sees, what stays private, and can
                      delete your data at any time.
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <section id="privacy-collection" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">1. Information We Collect</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    We collect only the information strictly necessary to deliver a world-class collaborative
                    travel planning experience:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <strong className="block text-zinc-900 font-bold mb-1">Account Credentials</strong>
                      <p className="text-zinc-600">Name, email address, password hash, and profile avatar.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <strong className="block text-zinc-900 font-bold mb-1">Itinerary & Trip Data</strong>
                      <p className="text-zinc-600">Destinations, dates, packing lists, expense notes, and saved stops.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <strong className="block text-zinc-900 font-bold mb-1">Location Coordinates (Optional)</strong>
                      <p className="text-zinc-600">Used strictly with your permission to calculate route directions.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <strong className="block text-zinc-900 font-bold mb-1">Device Telemetry</strong>
                      <p className="text-zinc-600">IP address, browser type, operating system for crash prevention.</p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="privacy-use" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">2. How We Use Travel Data</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Your personal information is used exclusively to:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1.5">
                    <li>Synchronize group itineraries across all participants in real time.</li>
                    <li>Generate AI suggestions for optimized daily travel schedules.</li>
                    <li>Notify you of changes made by collaborators or upcoming reservations.</li>
                    <li>Protect against fraud, spam, and unauthorized account access.</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="privacy-collaboration" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">3. Group Collaboration & Visibility</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    When you invite friends to a trip workspace, they will be able to see the itinerary items,
                    lodging bookings, and expense cards associated with that trip. Private items labeled &ldquo;Personal
                    Only&rdquo; (e.g. passport numbers or emergency contacts) are encrypted and visible exclusively
                    to you.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="privacy-ai" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">4. AI Processing & Models</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    When you use Itinerai&apos;s AI Trip Assistant, prompt inputs (such as &ldquo;find 3 kid-friendly cafes
                    in Kyoto&rdquo;) are processed securely via enterprise AI endpoints with strict zero-data-retention
                    guarantees. Your private notes and travel history are never used to train public foundational
                    models.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="privacy-sharing" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">5. Third-Party Subprocessors</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    We partner only with vetted industry leaders that adhere to SOC-2 Type II, ISO 27001, and
                    GDPR data protection standards:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1.5">
                    <li><strong>Hosting & Database:</strong> Vercel, Supabase (AWS us-east/eu-west) with encryption at rest.</li>
                    <li><strong>Mapping Data:</strong> Mapbox / OpenStreetMap for visual routing and waypoints.</li>
                    <li><strong>Transactional Email:</strong> Resend / Sendgrid for itinerary invites and security codes.</li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="privacy-security" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">6. Data Security & Encryption</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    All network communications with Itinerai are encrypted via TLS 1.3 in transit. Stored data
                    is protected with AES-256 encryption at rest. We conduct regular penetration testing and maintain
                    automated backup failover systems.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="privacy-retention" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">7. Data Retention & Deletion</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    We retain your itineraries for as long as your account remains active so you can look back at
                    past travels. You may delete individual trips or your entire account at any time. When you request
                    deletion, all personal data is permanently purged from active databases within 30 days.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="privacy-rights" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">8. Your Rights (GDPR & CCPA)</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Depending on your jurisdiction, you possess the right to:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1.5">
                    <li>Access a copy of all personal information held about you.</li>
                    <li>Export your itineraries in standard JSON or PDF format.</li>
                    <li>Rectify inaccurate personal details.</li>
                    <li>Request complete erasure (&ldquo;Right to be Forgotten&rdquo;).</li>
                    <li>Opt out of any marketing or newsletter communications at any time.</li>
                  </ul>
                </section>

                {/* Section 9 */}
                <section id="privacy-cookies" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">9. Cookies & Local Storage</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    We use essential authentication tokens (stored securely in HttpOnly cookies or local storage)
                    to remember your active session and offline itinerary cache. We do not use third-party cross-site
                    tracking cookies.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="privacy-contact" className="scroll-mt-20 space-y-3">
                  <h2 className="text-xl font-bold text-zinc-950">10. Contact Privacy Officer</h2>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    For questions regarding our privacy practices, data requests, or to exercise your GDPR/CCPA rights, please contact us at:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      href="mailto:swenfei04@gmail.com"
                      className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-white border border-zinc-200/80 hover:border-[#a33917]/40 shadow-2xs hover:shadow-sm transition-all flex items-center gap-3 text-xs group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-[#a33917]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] text-zinc-400 font-medium">Direct Email</div>
                        <div className="font-semibold text-zinc-900 group-hover:text-[#a33917] truncate transition-colors">
                          swenfei04@gmail.com
                        </div>
                      </div>
                    </a>

                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex items-center gap-3 text-xs">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shrink-0">
                        <DiscordIcon size={18} className="text-[#5865F2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] text-zinc-400 font-medium">Discord</div>
                        <div className="font-semibold text-zinc-900 font-mono">teddyhuzz0210</div>
                      </div>
                    </div>
                  </div>
                </section>
              </article>
            )}
          </div>
        </main>
      </div>
    </motion.div>
  );
};
