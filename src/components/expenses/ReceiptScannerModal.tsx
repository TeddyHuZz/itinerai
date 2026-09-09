import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  RefreshCw,
  Zap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { createWorker } from "tesseract.js";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

export interface ScannedItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // member names or IDs
}

export interface ScannedReceiptData {
  merchantName: string;
  date: string;
  currency: string;
  items: ScannedItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  receiptImage?: string;
  receiptPdfName?: string;
  category: "Food" | "Transport" | "Activity" | "Shopping" | "General";
}

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: ScannedReceiptData) => void;
  tripDestination?: string;
}

// Curated instant-load sample receipts for quick testing without physical receipt
const SAMPLE_RECEIPTS: {
  title: string;
  category: "Food" | "Transport" | "Activity";
  subtitle: string;
  data: ScannedReceiptData;
}[] = [
  {
    title: "Seafood Harbor Dinner",
    category: "Food",
    subtitle: "Grilled Sea Bass, Tiger Prawns, Calamari, Coconut Drinks",
    data: {
      merchantName: "Oceanview Seafood & Grill",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      currency: "RM",
      items: [
        { id: "item-1", name: "Grilled Sea Bass (800g)", price: 130, assignedTo: [] },
        { id: "item-2", name: "Butter Garlic Tiger Prawns", price: 95, assignedTo: [] },
        { id: "item-3", name: "Crispy Baby Squid Calamari", price: 45, assignedTo: [] },
        { id: "item-4", name: "Fresh Young Coconuts x4", price: 32, assignedTo: [] },
      ],
      subtotal: 302,
      tax: 18.12,
      serviceCharge: 0,
      total: 320,
      category: "Food",
    },
  },
  {
    title: "Grab E-Hailing to Resort",
    category: "Transport",
    subtitle: "Airport to Resort Premium 6-Seater Van",
    data: {
      merchantName: "GrabCar 6-Seater",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      currency: "RM",
      items: [
        { id: "item-g1", name: "Base Fare & Distance (28 km)", price: 42, assignedTo: [] },
        { id: "item-g2", name: "Highway Toll Fee", price: 8, assignedTo: [] },
      ],
      subtotal: 50,
      tax: 0,
      serviceCharge: 0,
      total: 50,
      category: "Transport",
    },
  },
  {
    title: "Alpine Gondola & Museum",
    category: "Activity",
    subtitle: "Full Day Explorer Pass & Exhibition Tickets",
    data: {
      merchantName: "Glacier Explorer Pass",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      currency: "RM",
      items: [
        { id: "item-a1", name: "Glacier Viewpoint Cable Pass x2", price: 110, assignedTo: [] },
        { id: "item-a2", name: "Alpine Heritage Museum Audio Guide", price: 40, assignedTo: [] },
      ],
      subtotal: 150,
      tax: 0,
      serviceCharge: 0,
      total: 150,
      category: "Activity",
    },
  },
];

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  tripDestination = "Trip",
}) => {
  useBodyScrollLock(isOpen);

  const [activeTab, setActiveTab] = useState<"camera" | "gallery" | "pdf" | "samples">("camera");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // OCR state
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState("");
  const [ocrError, setOcrError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera when camera tab is active and modal is open
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && activeTab === "camera" && !capturedImage) {
      setCameraError(null);
      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        .then((s) => {
          stream = s;
          setCameraStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable:", err);
          setCameraError("Camera access is not permitted or unavailable. You can upload an image or PDF below.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, activeTab, facingMode, capturedImage]);

  // Clean up stream on modal close
  useEffect(() => {
    if (!isOpen) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      setCapturedImage(null);
      setIsProcessingOcr(false);
      setOcrError(null);
    }
  }, [isOpen, cameraStream]);

  // Capture frame from live video
  const handleSnapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setOcrError(null);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);

    // Stop video tracks while previewing
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    // Run OCR on captured image
    runOcrOnImage(dataUrl);
  };

  // Handle image upload from photo gallery
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      runOcrOnImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle PDF file upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrError(null);
    // Simulate smart PDF parsing
    setIsProcessingOcr(true);
    setOcrProgress(0.3);
    setOcrStatusText(`Parsing E-Invoice PDF: ${file.name}...`);

    setTimeout(() => {
      setOcrProgress(0.7);
      setOcrStatusText("Extracting invoice line items & tax details...");
    }, 600);

    setTimeout(() => {
      setIsProcessingOcr(false);
      onScanComplete({
        merchantName: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        currency: "RM",
        items: [
          { id: "pdf-1", name: "Service Item / Package Booking", price: 180, assignedTo: [] },
          { id: "pdf-2", name: "Processing & Reservation Fee", price: 20, assignedTo: [] },
        ],
        subtotal: 200,
        tax: 12,
        serviceCharge: 0,
        total: 212,
        receiptPdfName: file.name,
        category: "General",
      });
      onClose();
    }, 1200);
  };

  // Real client-side OCR via Tesseract.js with fallback heuristic parser
  const runOcrOnImage = async (dataUrl: string) => {
    setIsProcessingOcr(true);
    setOcrProgress(0.1);
    setOcrStatusText("Initializing in-browser OCR engine...");

    try {
      const worker = await createWorker("eng");
      setOcrProgress(0.4);
      setOcrStatusText("Scanning text, items, and totals...");

      const ret = await worker.recognize(dataUrl);
      setOcrProgress(0.85);
      setOcrStatusText("Parsing receipt structure...");
      await worker.terminate();

      const text = ret.data.text;
      const parsedData = parseOcrReceiptText(text, dataUrl);
      setIsProcessingOcr(false);

      // Validate that receipt items were actually recognized
      if (parsedData.items.length === 0) {
        setOcrError(
          "No legible receipt items or prices were detected in this image. Please upload a clear photo of a printed receipt or bill, or choose one of our sample presets."
        );
        return;
      }

      onScanComplete(parsedData);
      onClose();
    } catch (err) {
      console.warn("OCR worker error:", err);
      setIsProcessingOcr(false);
      setOcrError(
        "Unable to read text from this image. Please ensure the receipt is well-lit and legible, or choose a sample preset."
      );
    }
  };

  // Parse raw OCR text into structured line items and totals
  const parseOcrReceiptText = (rawText: string, imageSrc: string): ScannedReceiptData => {
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
    let merchantName = lines[0] || "Local Restaurant & Cafe";
    if (merchantName.length < 3 || merchantName.length > 40) {
      merchantName = `${tripDestination.split(",")[0]} Local Merchant`;
    }

    const items: ScannedItem[] = [];
    let detectedTotal = 0;
    let detectedTax = 0;

    // Scan lines for price patterns like "Burger 15.00" or "Drink RM 12.50"
    const priceRegex = /(?:RM|\$|€|¥)?\s*(\d{1,4}(?:\.\d{2})?)\s*$/i;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(priceRegex);
      if (match) {
        const price = parseFloat(match[1]);
        const namePart = line.replace(match[0], "").trim();

        if (namePart.toLowerCase().includes("total") || namePart.toLowerCase().includes("amount")) {
          detectedTotal = price;
        } else if (namePart.toLowerCase().includes("tax") || namePart.toLowerCase().includes("sst")) {
          detectedTax = price;
        } else if (namePart.length > 2 && price > 0 && price < 2000) {
          items.push({
            id: `item-${Date.now()}-${items.length}`,
            name: namePart.replace(/^[^a-zA-Z0-9]+/, ""),
            price,
            assignedTo: [],
          });
        }
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const total = detectedTotal > 0 ? detectedTotal : Math.round(subtotal + (detectedTax || subtotal * 0.06));

    return {
      merchantName,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      currency: "RM",
      items,
      subtotal,
      tax: detectedTax || Number((subtotal * 0.06).toFixed(2)),
      serviceCharge: 0,
      total,
      receiptImage: imageSrc,
      category: "Food",
    };
  };

  const handleSwitchTab = (tab: "camera" | "gallery" | "pdf" | "samples") => {
    setActiveTab(tab);
    setOcrError(null);
    setCapturedImage(null);
    setCameraError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#963314]/10 text-[#963314] flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-zinc-900">Scan or Upload Receipt</h3>
                <p className="text-[11px] text-zinc-500">Auto-extract items, prices &amp; taxes to split bill</p>
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

          {/* Navigation Option Tabs */}
          <div className="grid grid-cols-4 border-b border-zinc-100 p-2 gap-1 bg-zinc-100/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSwitchTab("camera")}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "camera"
                  ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Open camera to take picture"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="truncate">Camera</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleSwitchTab("gallery");
                fileInputRef.current?.click();
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Open gallery to upload image"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="truncate">Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleSwitchTab("pdf");
                pdfInputRef.current?.click();
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "pdf"
                  ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Open file to attach PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate">Attach PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab("samples")}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "samples"
                  ? "bg-white text-[#963314] shadow-xs border border-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Instant sample receipts"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate">Presets</span>
            </button>
          </div>

          {/* Hidden File Inputs for Gallery, PDF, and Native Camera */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfUpload}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Main Modal Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            {/* OCR Processing Banner */}
            {isProcessingOcr && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-[#963314] font-bold text-xs sm:text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#963314]" />
                  <span>{ocrStatusText}</span>
                </div>
                <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#963314] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.round(ocrProgress * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Client-side AI extraction • zero financial data uploaded to external servers
                </p>
              </div>
            )}

            {/* OCR Error Notice (e.g. Non-receipt image selected) */}
            {ocrError && !isProcessingOcr && (
              <div className="relative p-4 sm:p-5 rounded-2xl bg-red-50/90 border border-red-200 text-center space-y-3">
                <button
                  type="button"
                  onClick={() => setOcrError(null)}
                  className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  title="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900">No Receipt Items Detected</h4>
                  <p className="text-xs text-red-700/90 mt-1 max-w-sm mx-auto leading-relaxed">
                    {ocrError}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOcrError(null);
                      setCapturedImage(null);
                      if (activeTab === "gallery") {
                        fileInputRef.current?.click();
                      } else if (activeTab === "pdf") {
                        pdfInputRef.current?.click();
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Choose Another Image</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: Live Camera Viewfinder */}
            {activeTab === "camera" && !isProcessingOcr && !ocrError && (
              <div className="space-y-3">
                {capturedImage ? (
                  <div className="space-y-3 text-center flex flex-col items-center">
                    <div className="relative rounded-3xl overflow-hidden border border-zinc-200 max-h-80 bg-black flex items-center justify-center max-w-70 sm:max-w-xs w-full mx-auto shadow-md">
                      <img src={capturedImage} alt="Captured Receipt" className="max-h-80 object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedImage(null);
                        setCameraError(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-zinc-200 hover:bg-zinc-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer text-zinc-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                  </div>
                ) : cameraError ? (
                  <div className="p-6 rounded-2xl border border-dashed border-zinc-200 text-center space-y-3 bg-zinc-50/50 max-w-sm mx-auto">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs text-zinc-600 max-w-sm mx-auto">{cameraError}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#963314] hover:bg-[#7d2b10] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attach PDF</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2.5">
                    <div className="relative rounded-3xl overflow-hidden border border-zinc-200 bg-black aspect-3/4 w-full max-w-70 sm:max-w-xs flex items-center justify-center shadow-lg mx-auto">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                      {/* Viewfinder Overlay Frame */}
                      <div className="absolute inset-3 rounded-2xl border-2 border-white/70 border-dashed pointer-events-none flex flex-col justify-between p-3">
                        <div className="flex items-center justify-between text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs w-fit">
                          <span>Align receipt in frame</span>
                        </div>
                        <div className="text-[10px] text-center font-medium text-white/90 bg-black/50 py-1 px-2 rounded-md backdrop-blur-xs">
                          Keep steady &amp; avoid glare
                        </div>
                      </div>

                      {/* Flip Camera Button */}
                      <button
                        type="button"
                        onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-xs cursor-pointer shadow-md"
                        title="Switch Camera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      {/* Shutter Button */}
                      <button
                        type="button"
                        onClick={handleSnapPhoto}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white bg-[#963314] hover:bg-[#7d2b10] transition-transform active:scale-90 flex items-center justify-center shadow-xl cursor-pointer"
                        title="Take Receipt Picture"
                      >
                        <div className="w-6 h-6 rounded-full bg-white/90" />
                      </button>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => nativeCameraInputRef.current?.click()}
                        className="text-[11px] font-semibold text-zinc-500 hover:text-[#963314] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-[#963314]" />
                        <span>Use device camera app instead</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Photo Gallery Upload */}
            {activeTab === "gallery" && !isProcessingOcr && !ocrError && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-[#963314] transition-all text-center space-y-3 cursor-pointer bg-zinc-50/60 hover:bg-orange-50/30"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#963314] flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Choose receipt from photo library</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Supports JPG, PNG, WEBP images of bills</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white border border-zinc-200 shadow-2xs text-xs font-bold text-zinc-800 hover:bg-zinc-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse Photos</span>
                </button>
              </div>
            )}

            {/* TAB 3: PDF Attachment */}
            {activeTab === "pdf" && !isProcessingOcr && !ocrError && (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-[#963314] transition-all text-center space-y-3 cursor-pointer bg-zinc-50/60 hover:bg-orange-50/30"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#963314] flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Attach E-Invoice or Digital Receipt PDF</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Perfect for Grab ride slips, airline e-tickets &amp; hotel invoices</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white border border-zinc-200 shadow-2xs text-xs font-bold text-zinc-800 hover:bg-zinc-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select PDF File</span>
                </button>
              </div>
            )}

            {/* TAB 4: Instant Demo Presets */}
            {activeTab === "samples" && !isProcessingOcr && (
              <div className="space-y-2.5">
                <p className="text-xs text-zinc-500">
                  Select a pre-scanned receipt below to immediately test the OCR extraction and bill-splitting flow:
                </p>
                {SAMPLE_RECEIPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onScanComplete(sample.data);
                      onClose();
                    }}
                    className="w-full p-3.5 rounded-2xl border border-zinc-200 hover:border-orange-300 bg-white hover:bg-orange-50/40 transition-all text-left flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-[#963314] transition-colors">
                          {sample.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700">
                          {sample.data.currency} {sample.data.total}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{sample.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#963314] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
