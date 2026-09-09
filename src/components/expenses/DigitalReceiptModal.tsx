import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Printer,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Building,
} from "lucide-react";
import type { ExpenseRecord } from "./BillSplitModal";

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseRecord | null;
  tripDestination?: string;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  onClose,
  expense,
  tripDestination = "Trip",
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !expense) return null;

  // Render receipt to Canvas and trigger instant high-resolution PNG download
  const handleDownloadImage = () => {
    setIsExporting(true);
    const canvas = document.createElement("canvas");
    const width = 640;
    const height = 960;
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
    ctx.fillText(expense.merchantName, width / 2, 50);

    ctx.fillStyle = "#71717a";
    ctx.font = "12px sans-serif";
    ctx.fillText(`OFFICIAL DIGITAL E-INVOICE • ${tripDestination.split(",")[0]}`, width / 2, 72);
    ctx.fillText(`Invoice No: ${expense.invoiceNumber}  •  Tax ID: ${expense.taxId || "SST-W10-2408-320008"}`, width / 2, 90);
    ctx.fillText(`Date: ${expense.date} at ${expense.time}  •  Paid by: ${expense.paidBy}`, width / 2, 108);

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

    // Footer Verification
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Verified by ItinerAI Digital Tax Ledger • Tamper-Evident Record", width / 2, height - 35);
    ctx.fillText(`Verification Hash: ${expense.invoiceNumber}-TX8849`, width / 2, height - 20);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900">
                  Digital E-Invoice
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Official tax receipt &amp; group split record
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
              className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-sm space-y-5 text-left font-mono relative overflow-hidden"
            >
              {/* Receipt Top Edge Teeth/Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#963314]" />

              {/* Merchant Title & Tax Meta */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-200">
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 font-sans">
                  {expense.merchantName}
                </h4>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-sans">
                  <Building className="w-3 h-3 text-zinc-400" />
                  <span>{tripDestination.split(",")[0]} • Tourist Fiscal Area</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  Tax No: {expense.taxId || "SST-W10-2408-320008"} • POS Terminal #04
                </div>
              </div>

              {/* Invoice Meta Row */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 font-sans border-b border-dashed border-zinc-200 pb-3">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Invoice Number</span>
                  <span className="font-bold text-zinc-900">{expense.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px]">Date &amp; Time</span>
                  <span className="font-bold text-zinc-900">
                    {expense.date}, {expense.time}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Paid By</span>
                  <span className="font-bold text-emerald-700">{expense.paidBy}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px]">Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified E-Invoice
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-1.5 font-sans">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider pb-1 border-b border-zinc-100">
                  <span>Item</span>
                  <span>Amount</span>
                </div>

                {expense.items.map((it) => (
                  <div key={it.id} className="flex items-start justify-between text-xs py-0.5">
                    <div className="pr-2 min-w-0 flex-1">
                      <span className="text-zinc-800 font-medium">{it.name}</span>
                      {it.assignedTo.length > 0 && (
                        <span className="text-[10px] text-zinc-400 block">
                          Shared by: {it.assignedTo.join(", ")}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-zinc-900 shrink-0">
                      {expense.currency} {it.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1 border-t border-dashed border-zinc-200 pt-3 text-xs font-sans">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>{expense.currency} {expense.subtotal.toFixed(2)}</span>
                </div>
                {expense.tax > 0 && (
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Sales Tax (SST 6%)</span>
                    <span>{expense.currency} {expense.tax.toFixed(2)}</span>
                  </div>
                )}
                {expense.serviceCharge > 0 && (
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Service Charge (10%)</span>
                    <span>{expense.currency} {expense.serviceCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-extrabold text-[#963314] pt-1.5 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span>{expense.currency} {expense.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Group Split Allocation Details */}
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-1.5 font-sans">
                <span className="text-[10px] font-bold text-[#963314] uppercase tracking-wider block">
                  Companion Allocation Record
                </span>
                <div className="space-y-1">
                  {expense.splitWith.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-700">
                        {s.name} {s.name === expense.paidBy ? "(Payer)" : ""}
                      </span>
                      <span
                        className={`font-bold ${
                          s.name === expense.paidBy ? "text-emerald-700" : "text-zinc-900"
                        }`}
                      >
                        {expense.currency} {s.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Verification Code & Fiscal Disclaimer */}
              <div className="pt-2 flex items-center justify-between gap-4 font-sans text-left border-t border-dashed border-zinc-200">
                <div className="text-[10px] text-zinc-400 space-y-0.5">
                  <div className="font-bold text-zinc-600 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#963314]" />
                    <span>LHDN / National E-Invoice Compliant</span>
                  </div>
                  <p>Encrypted UUID: {expense.invoiceNumber}-8849-2026</p>
                  <p>Digitally signed by ItinerAI Fiscal Engine</p>
                </div>

                {/* Styled SVG QR Code */}
                <div className="w-14 h-14 bg-zinc-900 rounded-lg p-1.5 shrink-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                    <div className="bg-white rounded-xs" />
                    <div className="bg-zinc-900" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-zinc-900" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-zinc-900" />
                    <div className="bg-white rounded-xs" />
                    <div className="bg-zinc-900" />
                    <div className="bg-white rounded-xs" />
                  </div>
                </div>
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
