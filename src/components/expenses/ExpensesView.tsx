import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Car,
  Ticket,
  Receipt,
  Scan,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  Search,
  X,
  Plus,
  FileText,
  CreditCard,
  PieChart,
  ArrowUpRight,
} from "lucide-react";
import { ReceiptScannerModal, type ScannedReceiptData } from "./ReceiptScannerModal";
import { BillSplitModal, type ExpenseRecord } from "./BillSplitModal";
import { DigitalReceiptModal } from "./DigitalReceiptModal";
import type { TripItem } from "../itinerary/ItineraryView";

interface ExpensesViewProps {
  trips: TripItem[];
  activeTripId?: string;
  onSelectTrip?: (trip: TripItem) => void;
  onOpenItinerary?: () => void;
}

// Comprehensive hard-coded trip expense datasets for each escape
const TRIP_EXPENSES_MAP: Record<string, ExpenseRecord[]> = {
  // 1. BALI, INDONESIA
  "trip-bali": [
    {
      id: "bali-exp-1",
      title: "Jimbaran Seafood Sunset",
      merchantName: "Jimbaran Bay Ocean Grill",
      category: "Food",
      amount: 420,
      currency: "RM",
      date: "Today",
      time: "7:45 PM",
      paidBy: "Sarah Chen",
      splitWith: [
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "settled",
          items: ["Grilled Snapper", "Coconut Drinks"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "pending",
          items: ["Jumbo Tiger Prawns", "Sambal Squid"],
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "settled",
          items: ["Grilled Snapper", "Sambal Squid"],
        },
        {
          name: "Alice Tan",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "pending",
          items: ["Jumbo Tiger Prawns", "Coconut Drinks"],
        },
      ],
      items: [
        { id: "b1-1", name: "Whole Grilled Red Snapper (1.2kg)", price: 160, assignedTo: ["Sarah Chen", "David Kim"] },
        { id: "b1-2", name: "Butter Garlic Tiger Prawns", price: 140, assignedTo: ["Alex (You)", "Alice Tan"] },
        { id: "b1-3", name: "Spicy Balinese Sambal Calamari", price: 70, assignedTo: ["Alex (You)", "David Kim"] },
        { id: "b1-4", name: "Fresh Young Kopyor Coconuts x4", price: 50, assignedTo: ["Sarah Chen", "Alice Tan"] },
      ],
      subtotal: 420,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-BL-849201",
      taxId: "TAX-ID-BALI-9921",
    },
    {
      id: "bali-exp-2",
      title: "Private Van to Ubud Villa",
      merchantName: "Bluebird Executive Transport",
      category: "Transport",
      amount: 110,
      currency: "RM",
      date: "Yesterday",
      time: "11:30 AM",
      paidBy: "David Kim",
      splitWith: [
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 27.5,
          status: "settled",
          items: ["Private Van Transfer"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 27.5,
          status: "settled",
          items: ["Private Van Transfer"],
        },
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 27.5,
          status: "settled",
          items: ["Private Van Transfer"],
        },
        {
          name: "Alice Tan",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 27.5,
          status: "pending",
          items: ["Private Van Transfer"],
        },
      ],
      items: [
        { id: "b2-1", name: "Denpasar Airport to Ubud Villa Van", price: 95, assignedTo: ["David Kim", "Alex (You)", "Sarah Chen", "Alice Tan"] },
        { id: "b2-2", name: "Mandara Toll Expressway Pass", price: 15, assignedTo: ["David Kim", "Alex (You)", "Sarah Chen", "Alice Tan"] },
      ],
      subtotal: 110,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-BL-394810",
      taxId: "TAX-ID-BALI-4820",
    },
    {
      id: "bali-exp-3",
      title: "Tirta Empul & Rice Terraces",
      merchantName: "Tirta Empul Cultural Trust",
      category: "Activity",
      amount: 160,
      currency: "RM",
      date: "2 Days Ago",
      time: "1:15 PM",
      paidBy: "Alex (You)",
      splitWith: [
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Temple Entry"],
        },
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Temple Entry"],
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Temple Entry"],
        },
        {
          name: "Alice Tan",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Temple Entry"],
        },
      ],
      items: [
        { id: "b3-1", name: "Holy Spring Purification Ticket x4", price: 120, assignedTo: ["Alex (You)", "Sarah Chen", "David Kim", "Alice Tan"] },
        { id: "b3-2", name: "Traditional Sarong & Heritage Guide", price: 40, assignedTo: ["Alex (You)", "Sarah Chen", "David Kim", "Alice Tan"] },
      ],
      subtotal: 160,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-BL-102948",
      taxId: "GOV-BALI-HERITAGE",
    },
    {
      id: "bali-exp-4",
      title: "Seminyak Beach Club Lounge",
      merchantName: "Ku De Ta Sunset Lounge",
      category: "Food",
      amount: 280,
      currency: "RM",
      date: "3 Days Ago",
      time: "6:00 PM",
      paidBy: "Alice Tan",
      splitWith: [
        {
          name: "Alice Tan",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 70,
          status: "settled",
          items: ["Signature Cocktails", "Sliders"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 70,
          status: "pending",
          items: ["Signature Cocktails", "Truffle Fries"],
        },
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 70,
          status: "settled",
          items: ["Signature Cocktails", "Truffle Fries"],
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 70,
          status: "pending",
          items: ["Signature Cocktails", "Sliders"],
        },
      ],
      items: [
        { id: "b4-1", name: "Sunset Passionfruit Cocktails x4", price: 180, assignedTo: ["Alice Tan", "Alex (You)", "Sarah Chen", "David Kim"] },
        { id: "b4-2", name: "Truffle Parmesan Fries & Beef Sliders", price: 100, assignedTo: ["Alice Tan", "Alex (You)", "Sarah Chen", "David Kim"] },
      ],
      subtotal: 280,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-BL-503921",
      taxId: "TAX-ID-BALI-1102",
    },
  ],

  // 2. AMALFI COAST, ITALY
  "trip-amalfi": [
    {
      id: "amalfi-exp-1",
      title: "Cliffside Trattoria Lunch",
      merchantName: "Trattoria da Adolfo Positano",
      category: "Food",
      amount: 640,
      currency: "RM",
      date: "Today",
      time: "1:30 PM",
      paidBy: "Elena Rossi",
      splitWith: [
        {
          name: "Elena Rossi",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "settled",
          items: ["Vongole Pasta", "Insalata Caprese"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "pending",
          items: ["Spigola Grilled Sea Bass", "Limoncello"],
        },
        {
          name: "Marco Bellini",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "settled",
          items: ["Vongole Pasta", "Spigola Sea Bass"],
        },
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "pending",
          items: ["Insalata Caprese", "Limoncello"],
        },
      ],
      items: [
        { id: "a1-1", name: "Spaghetti alle Vongole Veraci x2", price: 220, assignedTo: ["Elena Rossi", "Marco Bellini"] },
        { id: "a1-2", name: "Fresh Grilled Spigola Mediterranean Catch", price: 240, assignedTo: ["Alex (You)", "Marco Bellini"] },
        { id: "a1-3", name: "Insalata Caprese di Bufala", price: 80, assignedTo: ["Elena Rossi", "Sarah Chen"] },
        { id: "a1-4", name: "Amalfi Limoncello Carafe & Dolci", price: 100, assignedTo: ["Alex (You)", "Sarah Chen"] },
      ],
      subtotal: 640,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-IT-938210",
      taxId: "IT-VAT-092837482",
    },
    {
      id: "amalfi-exp-2",
      title: "Capri Blue Grotto Boat Charter",
      merchantName: "Capri Horizon Gozzo Charter",
      category: "Activity",
      amount: 850,
      currency: "RM",
      date: "Yesterday",
      time: "10:00 AM",
      paidBy: "Marco Bellini",
      splitWith: [
        {
          name: "Marco Bellini",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 212.5,
          status: "settled",
          items: ["Gozzo Boat Charter"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 212.5,
          status: "pending",
          items: ["Gozzo Boat Charter"],
        },
        {
          name: "Elena Rossi",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 212.5,
          status: "settled",
          items: ["Gozzo Boat Charter"],
        },
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 212.5,
          status: "pending",
          items: ["Gozzo Boat Charter"],
        },
      ],
      items: [
        { id: "a2-1", name: "Half-Day Private Wooden Gozzo Boat", price: 650, assignedTo: ["Marco Bellini", "Alex (You)", "Elena Rossi", "Sarah Chen"] },
        { id: "a2-2", name: "Grotta Azzurra Rowboat Admission x4", price: 150, assignedTo: ["Marco Bellini", "Alex (You)", "Elena Rossi", "Sarah Chen"] },
        { id: "a2-3", name: "Capri Harbor Fuel & Marina Pass", price: 50, assignedTo: ["Marco Bellini", "Alex (You)", "Elena Rossi", "Sarah Chen"] },
      ],
      subtotal: 850,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-IT-758392",
      taxId: "IT-VAT-583920194",
    },
    {
      id: "amalfi-exp-3",
      title: "Positano to Amalfi Hydrofoil",
      merchantName: "Positano Jet Hydrofoil Lines",
      category: "Transport",
      amount: 180,
      currency: "RM",
      date: "2 Days Ago",
      time: "9:15 AM",
      paidBy: "Alex (You)",
      splitWith: [
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 45,
          status: "settled",
          items: ["Hydrofoil Ticket"],
        },
        {
          name: "Elena Rossi",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 45,
          status: "settled",
          items: ["Hydrofoil Ticket"],
        },
        {
          name: "Marco Bellini",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 45,
          status: "settled",
          items: ["Hydrofoil Ticket"],
        },
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 45,
          status: "settled",
          items: ["Hydrofoil Ticket"],
        },
      ],
      items: [
        { id: "a3-1", name: "High-Speed Hydrofoil Pass x4", price: 180, assignedTo: ["Alex (You)", "Elena Rossi", "Marco Bellini", "Sarah Chen"] },
      ],
      subtotal: 180,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-IT-482910",
      taxId: "IT-VAT-847291028",
    },
    {
      id: "amalfi-exp-4",
      title: "Villa Cimbrone Gardens Pass",
      merchantName: "Villa Cimbrone Botanical Trust",
      category: "Activity",
      amount: 120,
      currency: "RM",
      date: "3 Days Ago",
      time: "3:45 PM",
      paidBy: "Sarah Chen",
      splitWith: [
        {
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 30,
          status: "settled",
          items: ["Garden Admission"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 30,
          status: "settled",
          items: ["Garden Admission"],
        },
        {
          name: "Elena Rossi",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 30,
          status: "settled",
          items: ["Garden Admission"],
        },
        {
          name: "Marco Bellini",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 30,
          status: "settled",
          items: ["Garden Admission"],
        },
      ],
      items: [
        { id: "a4-1", name: "Infinity Terrace & Garden Entry x4", price: 120, assignedTo: ["Sarah Chen", "Alex (You)", "Elena Rossi", "Marco Bellini"] },
      ],
      subtotal: 120,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-IT-182940",
      taxId: "IT-VAT-192847392",
    },
  ],

  // 3. KYOTO, JAPAN
  "trip-kyoto": [
    {
      id: "kyoto-exp-1",
      title: "Gion Kaiseki Traditional Omakase",
      merchantName: "Gion Matasaburo Kyoto",
      category: "Food",
      amount: 980,
      currency: "RM",
      date: "Today",
      time: "8:00 PM",
      paidBy: "Kenji Sato",
      splitWith: [
        {
          name: "Kenji Sato",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 245,
          status: "settled",
          items: ["Wagyu Sukiyaki", "Matcha Course"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 245,
          status: "pending",
          items: ["A5 Miyazaki Wagyu", "Sashimi Platter"],
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 245,
          status: "pending",
          items: ["A5 Miyazaki Wagyu", "Sashimi Platter"],
        },
        {
          name: "Hana Takahashi",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 245,
          status: "settled",
          items: ["Wagyu Sukiyaki", "Matcha Course"],
        },
      ],
      items: [
        { id: "k1-1", name: "Premium Seasonal Sashimi Moriawase", price: 380, assignedTo: ["Alex (You)", "David Kim"] },
        { id: "k1-2", name: "A5 Miyazaki Wagyu Hotpot Course x2", price: 420, assignedTo: ["Kenji Sato", "Hana Takahashi"] },
        { id: "k1-3", name: "Kyoto Uji Green Tea Parfait & Sake", price: 180, assignedTo: ["Alex (You)", "Kenji Sato", "Hana Takahashi", "David Kim"] },
      ],
      subtotal: 980,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-JP-849201",
      taxId: "JP-CORP-94820192",
    },
    {
      id: "kyoto-exp-2",
      title: "Sagano Romantic Scenic Train",
      merchantName: "Sagano Scenic Railway",
      category: "Transport",
      amount: 240,
      currency: "RM",
      date: "Yesterday",
      time: "10:30 AM",
      paidBy: "David Kim",
      splitWith: [
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 60,
          status: "settled",
          items: ["Train Pass"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 60,
          status: "settled",
          items: ["Train Pass"],
        },
        {
          name: "Kenji Sato",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 60,
          status: "settled",
          items: ["Train Pass"],
        },
        {
          name: "Hana Takahashi",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 60,
          status: "settled",
          items: ["Train Pass"],
        },
      ],
      items: [
        { id: "k2-1", name: "Arashiyama Torokko Open-Car Passes x4", price: 240, assignedTo: ["David Kim", "Alex (You)", "Kenji Sato", "Hana Takahashi"] },
      ],
      subtotal: 240,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-JP-392019",
      taxId: "JP-CORP-39201928",
    },
    {
      id: "kyoto-exp-3",
      title: "Kimono Rental & Tea Ceremony",
      merchantName: "Yumeyakata Kyoto Experience",
      category: "Activity",
      amount: 420,
      currency: "RM",
      date: "2 Days Ago",
      time: "2:15 PM",
      paidBy: "Alex (You)",
      splitWith: [
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "settled",
          items: ["Kimono Rental"],
        },
        {
          name: "Hana Takahashi",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "settled",
          items: ["Kimono Rental"],
        },
        {
          name: "Kenji Sato",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "settled",
          items: ["Kimono Rental"],
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 105,
          status: "settled",
          items: ["Kimono Rental"],
        },
      ],
      items: [
        { id: "k3-1", name: "Traditional Silk Kimono Rental x4", price: 330, assignedTo: ["Alex (You)", "Hana Takahashi", "Kenji Sato", "David Kim"] },
        { id: "k3-2", name: "Private Urasenke Tea Master Ceremony", price: 90, assignedTo: ["Alex (You)", "Hana Takahashi", "Kenji Sato", "David Kim"] },
      ],
      subtotal: 420,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-JP-592810",
      taxId: "JP-CORP-59281029",
    },
    {
      id: "kyoto-exp-4",
      title: "Nishiki Market Street Food Crawl",
      merchantName: "Nishiki Market Merchants Co-op",
      category: "Food",
      amount: 190,
      currency: "RM",
      date: "3 Days Ago",
      time: "12:45 PM",
      paidBy: "Hana Takahashi",
      splitWith: [
        {
          name: "Hana Takahashi",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          amount: 47.5,
          status: "settled",
          items: ["Takoyaki", "Strawberry Mochi"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 47.5,
          status: "pending",
          items: ["Grilled Unagi", "Takoyaki"],
        },
        {
          name: "Kenji Sato",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          amount: 47.5,
          status: "settled",
          items: ["Grilled Unagi", "Strawberry Mochi"],
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 47.5,
          status: "settled",
          items: ["Takoyaki", "Grilled Unagi"],
        },
      ],
      items: [
        { id: "k4-1", name: "Glazed Jumbo Takoyaki Skewers x4", price: 60, assignedTo: ["Hana Takahashi", "Alex (You)", "David Kim"] },
        { id: "k4-2", name: "Charcoal Grilled Unagi Eel Skewers", price: 80, assignedTo: ["Alex (You)", "Kenji Sato", "David Kim"] },
        { id: "k4-3", name: "Fresh Strawberry Daifuku Mochi x4", price: 50, assignedTo: ["Hana Takahashi", "Kenji Sato"] },
      ],
      subtotal: 190,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-JP-192830",
      taxId: "JP-CORP-19283029",
    },
  ],

  // 4. ZERMATT, SWISS ALPS
  "trip-swiss": [
    {
      id: "swiss-exp-1",
      title: "Matterhorn Glacier Peak Pass",
      merchantName: "Zermatt Bergbahnen AG",
      category: "Activity",
      amount: 1150,
      currency: "RM",
      date: "Today",
      time: "9:00 AM",
      paidBy: "Lucas Meier",
      splitWith: [
        {
          name: "Lucas Meier",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 575,
          status: "settled",
          items: ["Glacier Peak Cableway"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 575,
          status: "pending",
          items: ["Glacier Peak Cableway"],
        },
      ],
      items: [
        { id: "s1-1", name: "Klein Matterhorn 3883m Cableway Pass x2", price: 920, assignedTo: ["Lucas Meier", "Alex (You)"] },
        { id: "s1-2", name: "Glacier Palace Ice Carvings Entry x2", price: 230, assignedTo: ["Lucas Meier", "Alex (You)"] },
      ],
      subtotal: 1150,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-CH-948201",
      taxId: "CHE-109.827.492-MWST",
    },
    {
      id: "swiss-exp-2",
      title: "Truffle Cheese Fondue Stübli",
      merchantName: "Walliserkanne Fondue Zermatt",
      category: "Food",
      amount: 480,
      currency: "RM",
      date: "Yesterday",
      time: "7:30 PM",
      paidBy: "Sophie Bernard",
      splitWith: [
        {
          name: "Sophie Bernard",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "settled",
          items: ["Truffle Fondue", "Fendant Wine"],
        },
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "pending",
          items: ["Truffle Fondue", "Valais Dried Meat"],
        },
        {
          name: "Lucas Meier",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 160,
          status: "settled",
          items: ["Valais Dried Meat", "Fendant Wine"],
        },
      ],
      items: [
        { id: "s2-1", name: "Moitié-Moitié Gruyère Truffle Fondue", price: 290, assignedTo: ["Sophie Bernard", "Alex (You)"] },
        { id: "s2-2", name: "Valais Air-Dried Alpine Beef Platter", price: 120, assignedTo: ["Alex (You)", "Lucas Meier"] },
        { id: "s2-3", name: "Fendant du Valais White Wine Carafe", price: 70, assignedTo: ["Sophie Bernard", "Lucas Meier"] },
      ],
      subtotal: 480,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-CH-482910",
      taxId: "CHE-482.910.384-MWST",
    },
    {
      id: "swiss-exp-3",
      title: "Zermatt Electro Taxi & Ski Shuttle",
      merchantName: "Elektrotaxi Zermatt Genossenschaft",
      category: "Transport",
      amount: 120,
      currency: "RM",
      date: "2 Days Ago",
      time: "8:15 AM",
      paidBy: "Alex (You)",
      splitWith: [
        {
          name: "Alex (You)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Electric Shuttle"],
        },
        {
          name: "Lucas Meier",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Electric Shuttle"],
        },
        {
          name: "Sophie Bernard",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          amount: 40,
          status: "settled",
          items: ["Electric Shuttle"],
        },
      ],
      items: [
        { id: "s3-1", name: "Zermatt Station to Sunnegga Electric Taxi", price: 80, assignedTo: ["Alex (You)", "Lucas Meier", "Sophie Bernard"] },
        { id: "s3-2", name: "Ski Boots & Heavy Gear Luggage Service", price: 40, assignedTo: ["Alex (You)", "Lucas Meier", "Sophie Bernard"] },
      ],
      subtotal: 120,
      tax: 0,
      serviceCharge: 0,
      invoiceNumber: "INV-CH-192840",
      taxId: "CHE-192.840.291-MWST",
    },
  ],
};

// Helper to resolve initial trip expenses for any trip ID or destination name
const getInitialExpensesForTrip = (tripId: string, destination: string): ExpenseRecord[] => {
  if (TRIP_EXPENSES_MAP[tripId]) return TRIP_EXPENSES_MAP[tripId];
  const lower = destination.toLowerCase();
  if (lower.includes("amalfi") || lower.includes("italy")) return TRIP_EXPENSES_MAP["trip-amalfi"];
  if (lower.includes("kyoto") || lower.includes("japan")) return TRIP_EXPENSES_MAP["trip-kyoto"];
  if (lower.includes("swiss") || lower.includes("zermatt") || lower.includes("alps")) return TRIP_EXPENSES_MAP["trip-swiss"];
  return TRIP_EXPENSES_MAP["trip-bali"];
};

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onOpenItinerary,
}) => {
  const currentTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const currentTripId = currentTrip?.id || "trip-bali";

  // Expenses state keyed by trip ID so each trip preserves its own data and updates
  const [tripExpenses, setTripExpenses] = useState<Record<string, ExpenseRecord[]>>(TRIP_EXPENSES_MAP);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [settledNotice, setSettledNotice] = useState<string | null>(null);

  // Custom Trip Popover Dropdown
  const [isTripMenuOpen, setIsTripMenuOpen] = useState(false);
  const tripDropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedReceiptData | null>(null);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [selectedExpenseForReceipt, setSelectedExpenseForReceipt] = useState<ExpenseRecord | null>(null);

  // Close trip dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tripDropdownRef.current && !tripDropdownRef.current.contains(e.target as Node)) {
        setIsTripMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active trip's expenses list
  const expenses = useMemo(() => {
    return tripExpenses[currentTripId] || getInitialExpensesForTrip(currentTripId, currentTrip?.destination || "");
  }, [tripExpenses, currentTripId, currentTrip?.destination]);

  // Calculate total spent for active trip
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Find the primary creditor that Alex owes the most to on this specific trip
  const primaryCreditor = useMemo(() => {
    const debtsByPayer: Record<string, number> = {};
    expenses.forEach((exp) => {
      if (!exp.paidBy.includes("Alex")) {
        const alexSplit = exp.splitWith.find((s) => s.name.includes("Alex") && s.status === "pending");
        if (alexSplit && alexSplit.amount > 0) {
          debtsByPayer[exp.paidBy] = (debtsByPayer[exp.paidBy] || 0) + alexSplit.amount;
        }
      }
    });

    const sorted = Object.entries(debtsByPayer).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0 && sorted[0][1] > 0) {
      return { name: sorted[0][0], amount: sorted[0][1] };
    }
    return null;
  }, [expenses]);

  // Total pending debt that Alex owes across all companions on this trip
  const totalYouOwe = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      if (!exp.paidBy.includes("Alex")) {
        const alexSplit = exp.splitWith.find((s) => s.name.includes("Alex") && s.status === "pending");
        if (alexSplit) return acc + alexSplit.amount;
      }
      return acc;
    }, 0);
  }, [expenses]);

  // Calculate Group Balances (Net ledger specifically for this trip's travelers)
  const groupBalances = useMemo(() => {
    const membersMap: Record<
      string,
      {
        name: string;
        avatar: string;
        totalPaid: number;
        totalConsumed: number;
        netBalance: number;
        pendingOwedByAlex: number;
      }
    > = {};

    // 1. Initialize from currentTrip.members
    (currentTrip?.members || []).forEach((m) => {
      const isAlex = m.name.toLowerCase().includes("alex");
      const displayName = isAlex ? "Alex (You)" : m.name;
      membersMap[displayName] = {
        name: displayName,
        avatar: m.avatar,
        totalPaid: 0,
        totalConsumed: 0,
        netBalance: 0,
        pendingOwedByAlex: 0,
      };
    });

    // 2. Ensure Alex (You) is present
    if (!membersMap["Alex (You)"]) {
      membersMap["Alex (You)"] = {
        name: "Alex (You)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        totalPaid: 0,
        totalConsumed: 0,
        netBalance: 0,
        pendingOwedByAlex: 0,
      };
    }

    // 3. Register any extra members from the expenses (e.g. Alice Tan)
    expenses.forEach((exp) => {
      if (!membersMap[exp.paidBy]) {
        const splitMatch = exp.splitWith.find((s) => s.name === exp.paidBy);
        membersMap[exp.paidBy] = {
          name: exp.paidBy,
          avatar: splitMatch?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          totalPaid: 0,
          totalConsumed: 0,
          netBalance: 0,
          pendingOwedByAlex: 0,
        };
      }
      exp.splitWith.forEach((s) => {
        if (!membersMap[s.name]) {
          membersMap[s.name] = {
            name: s.name,
            avatar: s.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            totalPaid: 0,
            totalConsumed: 0,
            netBalance: 0,
            pendingOwedByAlex: 0,
          };
        }
      });
    });

    // 4. Calculate total paid and total consumed per member
    expenses.forEach((exp) => {
      if (membersMap[exp.paidBy]) {
        membersMap[exp.paidBy].totalPaid += exp.amount;
      }

      exp.splitWith.forEach((s) => {
        if (membersMap[s.name]) {
          membersMap[s.name].totalConsumed += s.amount;
          if (!exp.paidBy.includes("Alex") && s.name.includes("Alex") && s.status === "pending") {
            if (membersMap[exp.paidBy]) {
              membersMap[exp.paidBy].pendingOwedByAlex += s.amount;
            }
          }
        }
      });
    });

    return Object.values(membersMap).map((m) => ({
      ...m,
      netBalance: Math.round((m.totalPaid - m.totalConsumed) * 100) / 100,
    }));
  }, [currentTrip, expenses]);

  // Spending by Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {
      Food: 0,
      Transport: 0,
      Activity: 0,
      Other: 0,
    };

    expenses.forEach((exp) => {
      const c = exp.category;
      if (cats[c] !== undefined) {
        cats[c] += exp.amount;
      } else {
        cats["Other"] += exp.amount;
      }
    });

    return [
      { name: "Food", amount: cats["Food"], color: "bg-[#f15a24]" },
      { name: "Activity", amount: cats["Activity"], color: "bg-emerald-500" },
      { name: "Transport", amount: cats["Transport"], color: "bg-sky-500" },
      ...(cats["Other"] > 0
        ? [{ name: "Other", amount: cats["Other"], color: "bg-purple-500" }]
        : []),
    ].filter((item) => item.amount > 0);
  }, [expenses]);

  // Settle specific debt on an expense card
  const handleSettleDebt = (expenseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = expenses.map((exp) => {
      if (exp.id !== expenseId) return exp;
      return {
        ...exp,
        splitWith: exp.splitWith.map((s) =>
          s.name.includes("Alex") ? { ...s, status: "settled" as const } : s
        ),
      };
    });

    setTripExpenses((prev) => ({
      ...prev,
      [currentTripId]: updated,
    }));

    const foundExp = expenses.find((exp) => exp.id === expenseId);
    setSettledNotice(`Marked debt as settled with ${foundExp?.paidBy || "companion"}!`);
    setTimeout(() => setSettledNotice(null), 3000);
  };

  // Settle all outstanding debts with primary creditor
  const handleSettleAllWithPrimary = () => {
    if (!primaryCreditor) return;
    const creditorName = primaryCreditor.name;

    const updated = expenses.map((exp) => {
      if (exp.paidBy !== creditorName) return exp;
      return {
        ...exp,
        splitWith: exp.splitWith.map((s) =>
          s.name.includes("Alex") ? { ...s, status: "settled" as const } : s
        ),
      };
    });

    setTripExpenses((prev) => ({
      ...prev,
      [currentTripId]: updated,
    }));

    setSettledNotice(`All pending balances with ${creditorName} settled!`);
    setTimeout(() => setSettledNotice(null), 3000);
  };

  // Called when scanner finishes OCR
  const handleScanComplete = (data: ScannedReceiptData) => {
    setScannedData(data);
    setIsSplitModalOpen(true);
  };

  // Called when user finishes splitting bill
  const handleConfirmSplitExpense = (newExpense: ExpenseRecord) => {
    const updated = [newExpense, ...expenses];
    setTripExpenses((prev) => ({
      ...prev,
      [currentTripId]: updated,
    }));
    setSelectedExpenseForReceipt(newExpense);
    setSettledNotice(`Added "${newExpense.title}" (RM ${newExpense.amount}) to ${currentTrip?.destination}!`);
    setTimeout(() => setSettledNotice(null), 3500);
  };

  // Filtered & Searched expense items
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchCat = filterCategory === "all" || exp.category.toLowerCase() === filterCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.items.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [expenses, filterCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-[#fafaf9] min-h-[calc(100vh-65px)] pb-24 md:pb-12 text-zinc-900">
      {/* Toast Notice */}
      <AnimatePresence>
        {settledNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2.5 border border-zinc-700 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{settledNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex-1 flex flex-col space-y-6">
        {/* ======================================================================= */}
        {/* 1. TOP HEADER & TRIP SWITCHER BAR                                        */}
        {/* ======================================================================= */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-zinc-200/80">
          {/* Trip Selector with Custom Dropdown Popover */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <div className="relative min-w-0" ref={tripDropdownRef}>
              <button
                type="button"
                onClick={() => setIsTripMenuOpen((v) => !v)}
                className="flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all cursor-pointer text-left group max-w-full"
              >
                <img
                  src={currentTrip?.image}
                  alt={currentTrip?.destination}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl object-cover ring-1 ring-zinc-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">
                      Budget
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-[#963314] whitespace-nowrap">
                      {currentTrip?.dates}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <h1 className="text-xs sm:text-base font-extrabold text-zinc-900 leading-none truncate max-w-24 sm:max-w-none">
                      {currentTrip?.destination}
                    </h1>
                    <ChevronDown
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-zinc-700 transition-transform shrink-0 ${
                        isTripMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Custom Popover Menu */}
              <AnimatePresence>
                {isTripMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white border border-zinc-200/90 shadow-xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Switch Trip Budget
                    </div>
                    <div className="space-y-1">
                      {trips.map((trip) => (
                        <button
                          key={trip.id}
                          type="button"
                          onClick={() => {
                            if (onSelectTrip) onSelectTrip(trip);
                            setIsTripMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left cursor-pointer ${
                            trip.id === currentTrip?.id
                              ? "bg-orange-50/80 text-[#963314] font-bold"
                              : "hover:bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          <img
                            src={trip.image}
                            alt={trip.destination}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold truncate">{trip.destination}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{trip.dates}</p>
                          </div>
                          {trip.id === currentTrip?.id && (
                            <span className="w-2 h-2 rounded-full bg-[#963314] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Itinerary Bridge */}
            {onOpenItinerary && (
              <button
                type="button"
                onClick={onOpenItinerary}
                className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200/80 hover:bg-zinc-100/70 text-xs font-bold text-zinc-600 transition-all cursor-pointer shadow-2xs"
                title="Open trip timeline and itinerary"
              >
                <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                <span>Itinerary</span>
              </button>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#963314] hover:bg-[#7d2b10] text-white text-xs sm:text-sm font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Scan or Add Receipt</span>
              <span className="sm:hidden">Scan Receipt</span>
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. DUAL-COLUMN DESKTOP DASHBOARD LAYOUT                                 */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =================================================================== */}
          {/* LEFT COLUMN: Summary Banner, Filter & Expense Feed (~62% width)      */}
          {/* =================================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Top Metric Cards (Total Spent & You Owe) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="text-xs sm:text-sm font-semibold truncate">Total Spent</span>
                  <Receipt className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-[#963314] tracking-tight whitespace-nowrap">
                    RM {totalSpent.toLocaleString()}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5 truncate">
                    Across {expenses.length} shared receipts
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-5 rounded-3xl border shadow-2xs transition-colors flex flex-col justify-between ${
                  totalYouOwe > 0
                    ? "bg-orange-50/50 border-orange-200/80 text-[#963314]"
                    : "bg-white border-zinc-200/80 text-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-1">
                  <span className="text-xs sm:text-sm font-semibold truncate">
                    {primaryCreditor ? `You owe ${primaryCreditor.name.split(" ")[0]}` : "Your Balance"}
                  </span>
                  {primaryCreditor && primaryCreditor.amount > 0 ? (
                    <button
                      type="button"
                      onClick={handleSettleAllWithPrimary}
                      className="text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#963314] text-white hover:bg-[#7d2b10] transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      Settle
                    </button>
                  ) : (
                    <CreditCard className={`w-4 h-4 shrink-0 ${totalYouOwe > 0 ? "text-[#963314]" : "text-emerald-500"}`} />
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight whitespace-nowrap">
                    RM {totalYouOwe}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium mt-0.5 truncate">
                    {totalYouOwe > 0
                      ? primaryCreditor
                        ? `RM ${primaryCreditor.amount} pending to ${primaryCreditor.name.split(" ")[0]}`
                        : "Pending reimbursement"
                      : "All settled up!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search merchant, item (e.g. Seafood, Hydrofoil, Wagyu)..."
                    className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#963314]/20 focus:border-[#963314] shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                  {[
                    { id: "all", label: "All Bills" },
                    { id: "food", label: "Food", icon: Utensils },
                    { id: "transport", label: "Transport", icon: Car },
                    { id: "activity", label: "Activities", icon: Ticket },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFilterCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full transition-all cursor-pointer capitalize shrink-0 flex items-center gap-1.5 ${
                          filterCategory === cat.id
                            ? "bg-zinc-900 text-white shadow-xs"
                            : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        {Icon && <Icon className="w-3 h-3" />}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Expenses Feed Card List */}
            <div className="space-y-3.5">
              {filteredExpenses.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-dashed border-zinc-200 text-center space-y-3">
                  <Receipt className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-sm font-bold text-zinc-700">No matching expenses found</p>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Try searching for a different dish name or switch category filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCategory("all");
                      setSearchQuery("");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredExpenses.map((exp) => {
                  const isFood = exp.category.toLowerCase() === "food";
                  const isTransport = exp.category.toLowerCase() === "transport";
                  const alexSplit = exp.splitWith.find((s) => s.name.includes("Alex"));
                  const isOwed =
                    !exp.paidBy.includes("Alex") &&
                    Boolean(alexSplit && alexSplit.status === "pending" && alexSplit.amount > 0);

                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedExpenseForReceipt(exp)}
                      className={`relative bg-white rounded-3xl p-4 sm:p-5 border cursor-pointer shadow-2xs hover:shadow-md hover:border-zinc-300 transition-colors duration-150 overflow-hidden ${
                        isOwed ? "border-orange-200/90" : "border-zinc-200/80"
                      }`}
                    >
                      {/* Soft Peach Accent for pending reimbursement */}
                      {isOwed && (
                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#f15a24]/10 rounded-bl-full pointer-events-none" />
                      )}

                      <div className="flex items-start justify-between gap-3 relative z-10">
                        {/* Left: Category Icon & Title */}
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                              isFood
                                ? "bg-[#f15a24] text-white"
                                : isTransport
                                ? "bg-sky-500 text-white"
                                : "bg-emerald-500 text-white"
                            }`}
                          >
                            {isFood ? (
                              <Utensils className="w-5 h-5" />
                            ) : isTransport ? (
                              <Car className="w-5 h-5" />
                            ) : (
                              <Ticket className="w-5 h-5" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 leading-tight">
                                {exp.title}
                              </h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                                {exp.merchantName}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400 font-medium">
                              {exp.date} • {exp.time}
                            </p>

                            {/* Line Items Preview Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {exp.items.slice(0, 3).map((it, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-semibold text-zinc-600 bg-zinc-50 border border-zinc-200/60 px-2 py-0.5 rounded-md truncate max-w-36"
                                >
                                  {it.name}
                                </span>
                              ))}
                              {exp.items.length > 3 && (
                                <span className="text-[10px] font-bold text-zinc-400">
                                  +{exp.items.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount */}
                        <div className="text-right shrink-0">
                          <span className="text-base sm:text-xl font-black text-zinc-900 block tracking-tight">
                            {exp.currency} {exp.amount}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-medium">
                            Total bill
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Split Members + Settle / E-Invoice Actions */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
                        {/* Split avatars & Payer */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-2 overflow-hidden">
                            {exp.splitWith.slice(0, 4).map((m, idx) => (
                              <img
                                key={idx}
                                src={m.avatar}
                                alt={m.name}
                                title={`${m.name} (${m.status === "settled" ? "Settled" : "Pending"})`}
                                className="inline-block w-6 h-6 rounded-full ring-2 ring-white object-cover"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-500">
                            Paid by <strong className="text-zinc-900 font-bold">{exp.paidBy}</strong>
                          </span>
                        </div>

                        {/* Actions: View E-Invoice & Settle Button */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExpenseForReceipt(exp);
                            }}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-1 cursor-pointer"
                            title="View official digital receipt & E-Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-zinc-400" />
                            <span>E-Invoice</span>
                          </button>

                          {isOwed && alexSplit ? (
                            <button
                              type="button"
                              onClick={(e) => handleSettleDebt(exp.id, e)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                            >
                              <span>Settle RM {alexSplit.amount}</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Settled</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* =================================================================== */}
          {/* RIGHT COLUMN: Group Balances Ledger & Budget Analytics (~38% width) */}
          {/* =================================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Widget 1: Who Owes Whom Ledger */}
            <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-900">Group Balances</h3>
                  <p className="text-xs text-zinc-400">Net split positions for {currentTrip?.destination}</p>
                </div>
                <span className="p-1.5 rounded-xl bg-orange-50 text-[#963314]">
                  <CreditCard className="w-4 h-4" />
                </span>
              </div>

              {/* Members Balance List */}
              <div className="divide-y divide-zinc-100 text-xs">
                {groupBalances.map((m) => {
                  const isPositive = m.netBalance > 0;
                  const isNegative = m.netBalance < 0;
                  const isAlex = m.name.includes("Alex");

                  return (
                    <div key={m.name} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                        />
                        <div>
                          <p className="font-bold text-zinc-900">{m.name}</p>
                          <p className="text-[11px] text-zinc-400">
                            Paid RM {m.totalPaid} • Share RM {m.totalConsumed}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {isPositive && (
                          <span className="font-extrabold text-emerald-600 block">
                            +RM {m.netBalance}
                          </span>
                        )}
                        {isNegative && (
                          <span className="font-extrabold text-[#963314] block">
                            -RM {Math.abs(m.netBalance)}
                          </span>
                        )}
                        {!isPositive && !isNegative && (
                          <span className="font-bold text-zinc-400 block">Settled</span>
                        )}
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {isPositive ? "Gets back" : isNegative ? (isAlex ? "You owe" : "Owes") : "Balanced"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Settle All Action Bar */}
              {primaryCreditor && primaryCreditor.amount > 0 && (
                <div className="pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleSettleAllWithPrimary}
                    className="w-full py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#963314] text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Settle Debts with {primaryCreditor.name.split(" ")[0]} (RM {primaryCreditor.amount})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Widget 2: Spending by Category */}
            <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-900">Spending Breakdown</h3>
                  <p className="text-xs text-zinc-400">Total RM {totalSpent.toLocaleString()}</p>
                </div>
                <span className="p-1.5 rounded-xl bg-orange-50 text-[#963314]">
                  <PieChart className="w-4 h-4" />
                </span>
              </div>

              {/* Segmented Horizontal Progress Bar */}
              <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                {categoryBreakdown.map((cat, idx) => {
                  const pct = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${pct}%` }}
                      className={`${cat.color} h-full transition-all duration-500`}
                      title={`${cat.name}: RM ${cat.amount} (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>

              {/* Category Legend Rows */}
              <div className="space-y-2 text-xs">
                {categoryBreakdown.map((cat, idx) => {
                  const pct = totalSpent > 0 ? Math.round((cat.amount / totalSpent) * 100) : 0;
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                        <span className="font-semibold text-zinc-700">{cat.name}</span>
                      </div>
                      <div className="text-right font-bold text-zinc-900">
                        <span>RM {cat.amount}</span>
                        <span className="text-zinc-400 font-medium ml-1.5">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button (FAB) for Mobile Screens */}
        <div className="fixed bottom-20 md:bottom-8 right-6 md:right-10 z-40 lg:hidden">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsScannerOpen(true)}
            className="w-14 h-14 rounded-full bg-[#963314] hover:bg-[#7d2b10] text-white shadow-xl flex items-center justify-center cursor-pointer border-2 border-white transition-colors group"
            title="Scan Receipt with Camera or Upload"
          >
            <div className="relative flex items-center justify-center">
              <Scan className="w-7 h-7" />
              <Receipt className="w-3.5 h-3.5 absolute" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* MODAL 1: Receipt Scanner (Live Camera, Gallery, PDF & Presets) */}
      <ReceiptScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
        tripDestination={currentTrip?.destination}
      />

      {/* MODAL 2: Bill Splitter (Who paid & item assignments) */}
      <BillSplitModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        receiptData={scannedData}
        companions={currentTrip?.members || []}
        onConfirmExpense={handleConfirmSplitExpense}
      />

      {/* MODAL 3: Digital Receipt & E-Invoice Viewer (PDF / PNG Export) */}
      <DigitalReceiptModal
        isOpen={Boolean(selectedExpenseForReceipt)}
        onClose={() => setSelectedExpenseForReceipt(null)}
        expense={selectedExpenseForReceipt}
        tripDestination={currentTrip?.destination}
      />
    </div>
  );
};
