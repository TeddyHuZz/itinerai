import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Users,
  CreditCard,
  Receipt,
  FileCheck,
  Sparkles,
} from "lucide-react";
import type { ScannedReceiptData, ScannedItem } from "./ReceiptScannerModal";

export interface ExpenseRecord {
  id: string;
  title: string;
  merchantName: string;
  category: "Food" | "Transport" | "Activity" | "Shopping" | "General";
  amount: number;
  currency: string;
  date: string;
  time: string;
  paidBy: string;
  splitWith: {
    name: string;
    avatar?: string;
    amount: number;
    status: "settled" | "pending";
    items: string[];
  }[];
  items: ScannedItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  receiptImage?: string;
  invoiceNumber: string;
  taxId?: string;
}

interface CompanionMember {
  id: string;
  name: string;
  avatar?: string;
}

interface BillSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ScannedReceiptData | null;
  companions: CompanionMember[];
  onConfirmExpense: (expense: ExpenseRecord) => void;
}

export const BillSplitModal: React.FC<BillSplitModalProps> = ({
  isOpen,
  onClose,
  receiptData,
  companions,
  onConfirmExpense,
}) => {
  if (!isOpen || !receiptData) return null;

  // Safe fallback companion list if none passed
  const members: CompanionMember[] =
    companions.length > 0
      ? companions
      : [
          {
            id: "m-alice",
            name: "Alice",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          },
          {
            id: "m-alex",
            name: "Alex (You)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          },
          {
            id: "m-david",
            name: "David",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          },
          {
            id: "m-elena",
            name: "Elena",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          },
        ];

  const [paidBy, setPaidBy] = useState<string>("Alice");
  const [items, setItems] = useState<ScannedItem[]>(() => {
    // By default, assign all items to all members equally
    return receiptData.items.map((item) => ({
      ...item,
      assignedTo: members.map((m) => m.name),
    }));
  });

  // Toggle member assignment for a specific item
  const handleToggleMember = (itemId: string, memberName: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.assignedTo.includes(memberName);
        const updated = exists
          ? item.assignedTo.filter((n) => n !== memberName)
          : [...item.assignedTo, memberName];
        return {
          ...item,
          assignedTo: updated.length === 0 ? [memberName] : updated,
        };
      })
    );
  };

  // Assign item to all members
  const handleSelectAllFor = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          assignedTo: members.map((m) => m.name),
        };
      })
    );
  };

  // Calculate each member's owed share
  const memberTotals: Record<string, { amount: number; items: string[] }> = {};
  members.forEach((m) => {
    memberTotals[m.name] = { amount: 0, items: [] };
  });

  const subtotal = items.reduce((s, it) => s + it.price, 0);

  items.forEach((item) => {
    const splitCount = item.assignedTo.length || 1;
    const perPerson = item.price / splitCount;
    item.assignedTo.forEach((name) => {
      if (!memberTotals[name]) memberTotals[name] = { amount: 0, items: [] };
      memberTotals[name].amount += perPerson;
      memberTotals[name].items.push(item.name);
    });
  });

  // Add tax & service charge proportionally
  const taxAndFees = (receiptData.tax || 0) + (receiptData.serviceCharge || 0);
  if (subtotal > 0 && taxAndFees > 0) {
    Object.keys(memberTotals).forEach((name) => {
      const proportion = memberTotals[name].amount / subtotal;
      memberTotals[name].amount += proportion * taxAndFees;
    });
  }

  // Create finalized expense record
  const handleConfirm = () => {
    const splitWith = members.map((m) => {
      const share = memberTotals[m.name]?.amount || 0;
      return {
        name: m.name,
        avatar: m.avatar,
        amount: Math.round(share),
        status: m.name === paidBy ? ("settled" as const) : ("pending" as const),
        items: memberTotals[m.name]?.items || [],
      };
    });

    const expense: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      title: receiptData.merchantName,
      merchantName: receiptData.merchantName,
      category: receiptData.category || "Food",
      amount: receiptData.total,
      currency: receiptData.currency || "RM",
      date: receiptData.date,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      paidBy,
      splitWith,
      items,
      subtotal,
      tax: receiptData.tax,
      serviceCharge: receiptData.serviceCharge,
      receiptImage: receiptData.receiptImage,
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      taxId: "SST-W10-2408-320008",
    };

    onConfirmExpense(expense);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#963314]/10 text-[#963314] flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900">
                  Itemized Bill Splitting
                </h3>
                <p className="text-[11px] text-zinc-500">
                  {receiptData.merchantName} • {receiptData.currency} {receiptData.total}
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

          {/* Modal Content */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
            {/* Step 1: Who Paid? */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#963314]" />
                <span>Who Paid the Bill?</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {members.map((m) => {
                  const isPayer = paidBy === m.name;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaidBy(m.name)}
                      className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-left cursor-pointer ${
                        isPayer
                          ? "bg-orange-50/90 border-[#963314] ring-2 ring-[#963314]/10 shadow-xs"
                          : "bg-white border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      {m.avatar && (
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-200"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-zinc-900 block truncate">
                          {m.name}
                        </span>
                        {isPayer && (
                          <span className="text-[10px] font-bold text-[#963314]">Payer</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Who Ordered What? */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#963314]" />
                  <span>Who Shared Which Item?</span>
                </label>
                <span className="text-[11px] text-zinc-400">Tap companions to assign</span>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#963314]">
                          {receiptData.currency} {item.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectAllFor(item.id)}
                          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 bg-zinc-200/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          All
                        </button>
                      </div>
                    </div>

                    {/* Member selection chips */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {members.map((m) => {
                        const isAssigned = item.assignedTo.includes(m.name);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleToggleMember(item.id, m.name)}
                            className={`px-2 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isAssigned
                                ? "bg-[#963314] text-white shadow-2xs"
                                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            {m.avatar && (
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-3.5 h-3.5 rounded-full object-cover"
                              />
                            )}
                            <span>{m.name.split(" ")[0]}</span>
                            {isAssigned && <Check className="w-2.5 h-2.5 stroke-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Breakdown of Who Owes What */}
            <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 border-b border-orange-200/60 pb-2">
                <span className="flex items-center gap-1.5 text-[#963314]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Calculated Split Summary</span>
                </span>
                <span>Total: {receiptData.currency} {receiptData.total}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {members.map((m) => {
                  const share = Math.round(memberTotals[m.name]?.amount || 0);
                  const isPayer = m.name === paidBy;
                  return (
                    <div
                      key={m.id}
                      className="p-2 rounded-xl bg-white border border-orange-200/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {m.avatar && (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                        )}
                        <span className="font-semibold text-zinc-800 truncate">{m.name.split(" ")[0]}</span>
                      </div>
                      <span
                        className={`font-bold shrink-0 ${
                          isPayer ? "text-emerald-700" : "text-[#963314]"
                        }`}
                      >
                        {receiptData.currency} {share}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-100 bg-white flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Save &amp; Generate E-Invoice</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
