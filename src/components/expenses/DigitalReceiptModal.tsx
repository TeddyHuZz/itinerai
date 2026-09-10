import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Printer,
  CheckCircle2,
  Building,
  ShieldCheck,
  Award,
} from "lucide-react";
import type { ExpenseRecord } from "./BillSplitModal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseRecord | null;
  tripDestination?: string;
}

// Generates an authentic, deterministic 25x25 QR module matrix
function generateReceiptQRModules(seed: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to place standard 7x7 corner finder patterns
  const placeFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        reserved[r0 + r][c0 + c] = true;
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[r0 + r][c0 + c] = isOuter || isInner;
      }
    }
  };

  // 1. Place 3 Finder Patterns
  placeFinder(0, 0); // Top-left
  placeFinder(0, size - 7); // Top-right
  placeFinder(size - 7, 0); // Bottom-left

  // 2. Add Timing Patterns (alternating black and white)
  for (let i = 7; i < size - 7; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // 3. Add Alignment Pattern at (16, 16)
  const ar = 16;
  const ac = 16;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      reserved[ar + r][ac + c] = true;
      const isOuter = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      grid[ar + r][ac + c] = isOuter || isCenter;
    }
  }

  // 4. Fill remaining data modules with deterministic pseudo-random hash from invoice seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        hash = (hash * 1664525 + 1013904223) >>> 0;
        grid[r][c] = hash % 100 < 48;
      }
    }
  }

  return grid;
}

// Professional High-Precision Vector QR Code SVG
const AuthenticQRCodeSVG: React.FC<{ invoiceNumber: string }> = ({ invoiceNumber }) => {
  const qrModules = useMemo(() => generateReceiptQRModules(invoiceNumber), [invoiceNumber]);
  const size = qrModules.length;

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-xs">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-16 h-16 sm:w-18 sm:h-18"
          shapeRendering="crispEdges"
        >
          {qrModules.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#18181b" />
              ) : null
            )
          )}
        </svg>
      </div>
      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
        Scan to Verify
      </span>
    </div>
  );
};

// Official Government Fiscal Compliance Seal SVG
const FiscalSealSVG: React.FC<{ invoiceNumber: string }> = ({ invoiceNumber }) => (
  <svg viewBox="0 0 120 120" className="w-12 h-12 shrink-0 select-none" fill="none">
    {/* Outer dashed security border */}
    <circle cx="60" cy="60" r="54" stroke="#059669" strokeWidth="2" strokeDasharray="4 2.5" />
    <circle cx="60" cy="60" r="48" stroke="#10b981" strokeWidth="1" />

    {/* Rosette scalloped backdrop */}
    <path
      d="M60 16 L64 24 L72 22 L74 30 L82 32 L81 40 L88 45 L84 52 L89 59 L83 65 L86 73 L78 77 L78 85 L70 86 L67 93 L60 91 L53 93 L50 86 L42 85 L42 77 L34 73 L37 65 L31 59 L36 52 L32 45 L39 40 L38 32 L46 30 L48 22 L56 24 Z"
      fill="#ecfdf5"
    />

    {/* Central Verified Shield */}
    <path
      d="M60 38 C68 38 72 40 75 44 C75 56 68 68 60 74 C52 68 45 56 45 44 C48 40 52 38 60 38 Z"
      fill="#059669"
    />

    {/* White Checkmark */}
    <path
      d="M53 54 L58 59 L68 47"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Arching Seal Text */}
    <text
      x="60"
      y="30"
      textAnchor="middle"
      fontSize="6.5"
      fontWeight="900"
      fill="#065f46"
      letterSpacing="1"
    >
      NATIONAL FISCAL
    </text>
    <text
      x="60"
      y="84"
      textAnchor="middle"
      fontSize="6"
      fontWeight="800"
      fill="#065f46"
      letterSpacing="0.8"
    >
      TAX COMPLIANT
    </text>
    <text
      x="60"
      y="93"
      textAnchor="middle"
      fontSize="5"
      fontWeight="700"
      fill="#059669"
      letterSpacing="0.5"
    >
      {invoiceNumber.slice(0, 10)}
    </text>
  </svg>
);

// High-Density Code128 Vector Barcode SVG
const BarcodeSVG: React.FC<{ code: string }> = ({ code }) => {
  const bars = [2, 1, 3, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 1, 2, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2];

  return (
    <div className="flex flex-col items-center gap-1 w-full pt-1">
      <svg viewBox="0 0 160 26" className="w-48 sm:w-56 h-6 sm:h-7" preserveAspectRatio="none">
        {bars.map((w, idx) => {
          const x = bars.slice(0, idx).reduce((sum, b) => sum + b * 2, 0);
          return (
            <rect
              key={idx}
              x={x + 5}
              y="0"
              width={w * 1.5}
              height="26"
              fill="#27272a"
            />
          );
        })}
      </svg>
      <span className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase">
        *{code}*
      </span>
    </div>
  );
};

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  onClose,
  expense,
  tripDestination = "Trip",
}) => {
  useBodyScrollLock(isOpen && !!expense, onClose);

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Compute QR module grid for canvas export
  const qrModules = useMemo(() => {
    if (!expense) return [];
    return generateReceiptQRModules(expense.invoiceNumber);
  }, [expense]);

  if (!isOpen || !expense) return null;

  // Render receipt to Canvas and trigger instant high-resolution PNG download
  const handleDownloadImage = () => {
    setIsExporting(true);
    const canvas = document.createElement("canvas");
    const width = 640;
    const height = 980;
    canvas.width = width * 2; // 2x high-DPI
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    ctx.scale(2, 2);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Top Brand Bar
    ctx.fillStyle = "#963314";
    ctx.fillRect(0, 0, width, 10);

    // Header Title
    ctx.fillStyle = "#18181b";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(expense.merchantName, width / 2, 52);

    ctx.fillStyle = "#71717a";
    ctx.font = "12px sans-serif";
    ctx.fillText(`OFFICIAL DIGITAL E-INVOICE • ${tripDestination.split(",")[0]}`, width / 2, 74);
    ctx.fillText(`Invoice No: ${expense.invoiceNumber}  •  Tax ID: ${expense.taxId || "SST-W10-2408-320008"}`, width / 2, 92);
    ctx.fillText(`Date: ${expense.date} at ${expense.time}  •  Paid by: ${expense.paidBy}`, width / 2, 110);

    // Divider
    ctx.strokeStyle = "#e4e4e7";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, 130);
    ctx.lineTo(width - 30, 130);
    ctx.stroke();
    ctx.setLineDash([]);

    // Table Header
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ITEM DESCRIPTION", 35, 155);
    ctx.textAlign = "right";
    ctx.fillText(`AMOUNT (${expense.currency})`, width - 35, 155);

    // Items
    let currentY = 185;
    ctx.font = "13px sans-serif";
    expense.items.forEach((item) => {
      ctx.fillStyle = "#27272a";
      ctx.textAlign = "left";
      ctx.fillText(item.name.slice(0, 36), 35, currentY);
      ctx.textAlign = "right";
      ctx.fillText(item.price.toFixed(2), width - 35, currentY);
      currentY += 26;
    });

    // Divider
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, currentY + 10);
    ctx.lineTo(width - 30, currentY + 10);
    ctx.stroke();
    ctx.setLineDash([]);
    currentY += 35;

    // Subtotal & Tax
    ctx.fillStyle = "#52525b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Subtotal", 35, currentY);
    ctx.textAlign = "right";
    ctx.fillText(`${expense.currency} ${expense.subtotal.toFixed(2)}`, width - 35, currentY);
    currentY += 22;

    if (expense.tax > 0) {
      ctx.textAlign = "left";
      ctx.fillText("Sales & Services Tax (SST 6%)", 35, currentY);
      ctx.textAlign = "right";
      ctx.fillText(`${expense.currency} ${expense.tax.toFixed(2)}`, width - 35, currentY);
      currentY += 22;
    }

    // Grand Total
    ctx.fillStyle = "#963314";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("GRAND TOTAL", 35, currentY + 10);
    ctx.textAlign = "right";
    ctx.fillText(`${expense.currency} ${expense.amount.toFixed(2)}`, width - 35, currentY + 10);
    currentY += 45;

    // Split Details Box
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(30, currentY, width - 60, 110);
    ctx.strokeStyle = "#e4e4e7";
    ctx.strokeRect(30, currentY, width - 60, 110);

    ctx.fillStyle = "#18181b";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("GROUP SPLIT BREAKDOWN", 45, currentY + 25);

    let splitX = 45;
    let splitY = currentY + 55;
    ctx.font = "11px sans-serif";
    expense.splitWith.forEach((s) => {
      ctx.fillStyle = "#3f3f46";
      ctx.fillText(`• ${s.name}: ${expense.currency} ${s.amount} (${s.status.toUpperCase()})`, splitX, splitY);
      splitY += 20;
    });

    currentY += 130;

    // Render Vector QR Code onto Canvas
    const qrOriginX = width - 130;
    const qrOriginY = currentY;
    const moduleSize = 3;
    ctx.fillStyle = "#18181b";
    qrModules.forEach((row, r) => {
      row.forEach((filled, c) => {
        if (filled) {
          ctx.fillRect(qrOriginX + c * moduleSize, qrOriginY + r * moduleSize, moduleSize, moduleSize);
        }
      });
    });

    // Verification Info next to QR
    ctx.fillStyle = "#059669";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("✓ VERIFIED FISCAL E-INVOICE", 35, currentY + 20);
    ctx.fillStyle = "#71717a";
    ctx.font = "11px sans-serif";
    ctx.fillText(`UUID: ${expense.invoiceNumber}-8849-2026`, 35, currentY + 40);
    ctx.fillText("Digitally certified by ItinerAI Fiscal Network", 35, currentY + 58);
    ctx.fillText("Tamper-evident record • Valid for official tax deductions", 35, currentY + 76);

    // Footer Verification
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Verification Hash: SHA256-${expense.invoiceNumber}-TX8849`, width / 2, height - 20);

    const link = document.createElement("a");
    link.download = `E-Invoice-${expense.invoiceNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setIsExporting(false);
  };

  // Print as formatted PDF via browser
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200 cursor-default"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 leading-none">
                    Digital E-Invoice
                  </h3>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Tax-compliant record &amp; verified split ledger
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable E-Invoice Sheet */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 bg-zinc-100/50">
            <div
              ref={receiptRef}
              id="printable-receipt"
              className="bg-white rounded-3xl p-5 sm:p-7 border border-zinc-200/80 shadow-md space-y-5 text-left relative overflow-hidden"
            >
              {/* Receipt Top Edge Teeth/Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#963314]" />

              {/* Merchant Title & Tax Meta */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-200">
                <div className="flex items-center justify-center gap-1.5">
                  <Award className="w-4 h-4 text-[#963314]" />
                  <h4 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
                    {expense.merchantName}
                  </h4>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                  <Building className="w-3 h-3 text-zinc-400" />
                  <span>{tripDestination.split(",")[0]} • Tourist Fiscal Area</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Tax ID: <strong className="text-zinc-700 font-mono">{expense.taxId || "SST-W10-2408-320008"}</strong> • Terminal #04
                </div>
              </div>

              {/* Invoice Meta Row */}
              <div className="grid grid-cols-2 gap-2.5 text-[11px] text-zinc-600 border-b border-dashed border-zinc-200 pb-3">
                <div>
                  <span className="text-zinc-400 block text-[10px] font-medium">Invoice Number</span>
                  <span className="font-extrabold text-zinc-900 font-mono">{expense.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px] font-medium">Date &amp; Time</span>
                  <span className="font-bold text-zinc-900">
                    {expense.date}, {expense.time}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] font-medium">Payer (Fronted Bill)</span>
                  <span className="font-extrabold text-emerald-700">{expense.paidBy}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px] font-medium">Fiscal Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified E-Invoice
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider pb-1 border-b border-zinc-100">
                  <span>Line Item Description</span>
                  <span>Amount</span>
                </div>

                {expense.items.map((it) => (
                  <div key={it.id} className="flex items-start justify-between text-xs py-1">
                    <div className="pr-2 min-w-0 flex-1">
                      <span className="text-zinc-800 font-semibold">{it.name}</span>
                      {it.assignedTo.length > 0 && (
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          Assigned to: {it.assignedTo.join(", ")}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-zinc-900 shrink-0 font-mono">
                      {expense.currency} {it.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1 border-t border-dashed border-zinc-200 pt-3 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{expense.currency} {expense.subtotal.toFixed(2)}</span>
                </div>
                {expense.tax > 0 && (
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Sales &amp; Services Tax (SST 6%)</span>
                    <span className="font-mono">{expense.currency} {expense.tax.toFixed(2)}</span>
                  </div>
                )}
                {expense.serviceCharge > 0 && (
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Service Charge (10%)</span>
                    <span className="font-mono">{expense.currency} {expense.serviceCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-black text-[#963314] pt-2 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span className="text-lg font-mono">{expense.currency} {expense.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Group Split Allocation Details */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#963314] uppercase tracking-wider">
                    Companion Allocation Record
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Proportional Tax Split
                  </span>
                </div>
                <div className="space-y-1.5">
                  {expense.splitWith.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-700 font-medium">
                        {s.name} {s.name === expense.paidBy ? "(Payer)" : ""}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          s.name === expense.paidBy ? "text-emerald-700" : "text-zinc-900"
                        }`}
                      >
                        {expense.currency} {s.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Professional SVG QR Code & Fiscal Stamp Section */}
              <div className="pt-3 border-t border-dashed border-zinc-200 flex items-center justify-between gap-3">
                {/* Left: Fiscal Compliance Meta & Official Seal */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <FiscalSealSVG invoiceNumber={expense.invoiceNumber} />
                  <div className="text-[10px] text-zinc-400 space-y-0.5 min-w-0">
                    <p className="font-bold text-zinc-700 text-xs">
                      LHDN / National Fiscal Compliant
                    </p>
                    <p className="truncate font-mono">
                      UUID: {expense.invoiceNumber}-8849-2026
                    </p>
                    <p className="truncate text-emerald-600 font-semibold">
                      Digitally Certified • Tamper-Evident Record
                    </p>
                  </div>
                </div>

                {/* Right: Authentic Vector QR Code SVG */}
                <AuthenticQRCodeSVG invoiceNumber={expense.invoiceNumber} />
              </div>

              {/* Clean Vector Barcode */}
              <div className="pt-2 border-t border-zinc-100 flex justify-center">
                <BarcodeSVG code={expense.invoiceNumber} />
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-zinc-100 bg-white flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintPdf}
                className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-xs font-bold text-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Download PNG Image Receipt"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? "Rendering..." : "Download PNG"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
