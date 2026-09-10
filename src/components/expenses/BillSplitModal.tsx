import React, { useState, useEffect, useMemo } from "react";
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
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

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
  useBodyScrollLock(isOpen, onClose);

  // Safe fallback companion list if none passed
  const members: CompanionMember[] = useMemo(() => {
    return companions.length > 0
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
  }, [companions]);

  const [paidBy, setPaidBy] = useState<string>(() => members[0]?.name || "You");
  const [items, setItems] = useState<ScannedItem[]>([]);

  // Sync state whenever receiptData changes or modal opens
  useEffect(() => {
    if (receiptData) {
      setPaidBy(members[0]?.name || "You");
      setItems(
        receiptData.items.map((item) => ({
          ...item,
          assignedTo: members.map((m) => m.name),
        }))
      );
    }
  }, [receiptData, members]);

  if (!isOpen || !receiptData) return null;

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
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200 cursor-default"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {members.map((m) => {
                  const isPayer = paidBy === m.name;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaidBy(m.name)}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 text-left cursor-pointer ${
                        isPayer
                          ? "bg-orange-50/90 border-[#963314] ring-2 ring-[#963314]/20 shadow-xs"
                          : "bg-white border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      {m.avatar && (
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 shadow-2xs"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-zinc-900 block wrap-break-word leading-snug">
                          {m.name}
                        </span>
                        <span className={`text-[10px] font-bold block mt-0.5 ${isPayer ? "text-[#963314]" : "text-zinc-400"}`}>
                          {isPayer ? "✓ Covered total bill" : "Tap to set payer"}
                        </span>
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

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/40 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#963314]">
                          {receiptData.currency} {item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 bg-zinc-200/60 p-0.5 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleSelectAllFor(item.id)}
                            className="text-[10px] font-semibold text-zinc-600 hover:text-zinc-900 px-2 py-0.5 rounded hover:bg-white transition-all cursor-pointer"
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setItems((prev) =>
                                prev.map((it) => (it.id === item.id ? { ...it, assignedTo: [] } : it))
                              );
                            }}
                            className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 px-1.5 py-0.5 rounded hover:bg-white transition-all cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Member selection chips */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {members.map((m) => {
                        const isAssigned = item.assignedTo.includes(m.name);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleToggleMember(item.id, m.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                              isAssigned
                                ? "bg-[#963314] text-white shadow-xs"
                                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            {m.avatar && (
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-4 h-4 rounded-full object-cover shrink-0"
                              />
                            )}
                            <span>{m.name}</span>
                            {isAssigned && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Breakdown of Who Owes What */}
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 border-b border-orange-200/60 pb-2.5">
                <span className="flex items-center gap-1.5 text-[#963314]">
                  <Sparkles className="w-4 h-4" />
                  <span>Calculated Split Summary</span>
                </span>
                <span className="text-zinc-700">Total Bill: <strong className="text-zinc-900">{receiptData.currency} {receiptData.total}</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {members.map((m) => {
                  const share = Math.round(memberTotals[m.name]?.amount || 0);
                  const isPayer = m.name === paidBy;
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-white border border-orange-200/70 flex flex-col justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {m.avatar && (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-100"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-zinc-900 block wrap-break-word text-xs leading-tight">
                            {m.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {isPayer ? "Paid upfront" : `Owes ${paidBy.split(" ")[0]}`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-zinc-500">
                          {isPayer ? "Net Share" : "Share"}
                        </span>
                        <span
                          className={`font-extrabold text-sm ${
                            isPayer ? "text-emerald-700" : "text-[#963314]"
                          }`}
                        >
                          {receiptData.currency} {share}
                        </span>
                      </div>
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
