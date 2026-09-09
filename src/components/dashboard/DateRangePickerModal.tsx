import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Check,
} from "lucide-react";

export interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onApply: (start: Date | null, end: Date | null, formattedStr: string) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const formatDateDisplay = (date: Date | null): string => {
  if (!date) return "Select date";
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatRangeSummary = (start: Date | null, end: Date | null): string => {
  if (!start && !end) return "Select travel dates";
  if (start && !end) {
    const sMonth = MONTH_NAMES[start.getMonth()].slice(0, 3);
    return `${sMonth} ${start.getDate()} - Select return`;
  }
  if (start && end) {
    const sMonth = MONTH_NAMES[start.getMonth()].slice(0, 3);
    const eMonth = MONTH_NAMES[end.getMonth()].slice(0, 3);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    if (sMonth === eMonth) {
      return `${sMonth} ${start.getDate()} - ${end.getDate()} (${nights} night${nights > 1 ? "s" : ""})`;
    }
    return `${sMonth} ${start.getDate()} - ${eMonth} ${end.getDate()} (${nights} night${nights > 1 ? "s" : ""})`;
  }
  return "Select travel dates";
};

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isOpen,
  onClose,
  startDate: initialStart,
  endDate: initialEnd,
  onApply,
}) => {
  const [selectedStart, setSelectedStart] = useState<Date | null>(initialStart);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(initialEnd);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Month navigation: default to October 2026
  const [currentYear, setCurrentYear] = useState(
    initialStart ? initialStart.getFullYear() : 2026
  );
  const [currentMonth, setCurrentMonth] = useState(
    initialStart ? initialStart.getMonth() : 9 // October
  );

  // Reset internal states when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStart(initialStart);
      setSelectedEnd(initialEnd);
      if (initialStart) {
        setCurrentYear(initialStart.getFullYear());
        setCurrentMonth(initialStart.getMonth());
      }
    }
  }, [isOpen, initialStart, initialEnd]);

  // Handle month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Days in month calculation (Monday as 0)
  const { calendarDays, firstDayOffset } = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return { calendarDays: days, firstDayOffset: firstDayIndex };
  }, [currentYear, currentMonth]);

  // Date click handler
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    clickedDate.setHours(0, 0, 0, 0);

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(clickedDate);
      setSelectedEnd(null);
    } else if (selectedStart && !selectedEnd) {
      if (clickedDate.getTime() >= selectedStart.getTime()) {
        setSelectedEnd(clickedDate);
      } else {
        setSelectedStart(clickedDate);
        setSelectedEnd(null);
      }
    }
  };

  // Check state for styling
  const isDateSelected = (day: number) => {
    if (!day) return { isStart: false, isEnd: false, isInRange: false, isHoverRange: false };
    const date = new Date(currentYear, currentMonth, day).setHours(0, 0, 0, 0);

    const sTime = selectedStart ? new Date(selectedStart).setHours(0, 0, 0, 0) : null;
    const eTime = selectedEnd ? new Date(selectedEnd).setHours(0, 0, 0, 0) : null;
    const hTime = hoveredDate ? new Date(hoveredDate).setHours(0, 0, 0, 0) : null;

    const isStart = sTime !== null && date === sTime;
    const isEnd = eTime !== null && date === eTime;
    const isInRange = sTime !== null && eTime !== null && date > sTime && date < eTime;
    const isHoverRange =
      sTime !== null &&
      eTime === null &&
      hTime !== null &&
      date > sTime &&
      date <= hTime;

    return { isStart, isEnd, isInRange, isHoverRange };
  };

  // Nights count
  const nightsCount = useMemo(() => {
    if (selectedStart && selectedEnd) {
      const diff = Math.round(
        (selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      return Math.max(1, diff);
    }
    return 0;
  }, [selectedStart, selectedEnd]);

  const handleApply = () => {
    const formatted = formatRangeSummary(selectedStart, selectedEnd);
    onApply(selectedStart, selectedEnd, formatted);
    onClose();
  };

  const handleClear = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  if (!isOpen) return null;

  const hasEndBoundary = Boolean(
    selectedEnd || (hoveredDate && selectedStart && hoveredDate.getTime() > selectedStart.getTime())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/45 backdrop-blur-xs">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200/90 overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 stroke-2" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 leading-tight">
                  Travel Dates
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Choose your departure &amp; return
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-2" />
            </button>
          </div>

          {/* Unified Departure & Return Card */}
          <div className="px-6 pb-2">
            <div className="p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 flex items-center justify-between gap-3">
              {/* Departure */}
              <div className="flex-1 text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Departure
                </span>
                <span className="text-sm font-extrabold text-zinc-900 leading-snug">
                  {formatDateDisplay(selectedStart)}
                </span>
              </div>

              {/* Connecting Duration Pill */}
              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-200/80 text-[11px] font-bold text-[#963314] shadow-2xs">
                <ArrowRight className="w-3 h-3 text-zinc-400" />
                <span>{nightsCount > 0 ? `${nightsCount} nights` : "Select dates"}</span>
              </div>

              {/* Return */}
              <div className="flex-1 text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Return
                </span>
                <span className="text-sm font-extrabold text-zinc-900 leading-snug">
                  {formatDateDisplay(selectedEnd)}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar Month Navigation */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                title="Previous month"
                className="w-7 h-7 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-2" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                title="Next month"
                className="w-7 h-7 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-2" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="px-5 grid grid-cols-7 text-center pb-2">
            {WEEKDAY_NAMES.map((w, idx) => (
              <div
                key={idx}
                className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide"
              >
                {w}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="px-5 pb-5 grid grid-cols-7 gap-y-1 text-center">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-9 sm:h-10" />;
              }

              const { isStart, isEnd, isInRange, isHoverRange } = isDateSelected(day);
              const isSelectedEndpoint = isStart || isEnd;
              const isHighlighted = isInRange || isHoverRange;

              // Row position for rounded corners on weekly rows
              const colIndex = (firstDayOffset + day - 1) % 7;
              const isRowStart = colIndex === 0;
              const isRowEnd = colIndex === 6;

              return (
                <div
                  key={`day-${day}`}
                  className="h-9 sm:h-10 flex items-center justify-center relative"
                >
                  {/* Seamless range connector background */}
                  {isHighlighted && (
                    <div
                      className={`absolute inset-y-1 inset-x-0 bg-[#963314]/12 ${
                        isRowStart ? "rounded-l-full" : ""
                      } ${isRowEnd ? "rounded-r-full" : ""}`}
                    />
                  )}

                  {/* Start date connector strip to the right */}
                  {isStart && hasEndBoundary && (
                    <div
                      className={`absolute inset-y-1 left-1/2 right-0 bg-[#963314]/12 ${
                        isRowEnd ? "rounded-r-full" : ""
                      }`}
                    />
                  )}

                  {/* End date connector strip to the left */}
                  {isEnd && selectedStart && (
                    <div
                      className={`absolute inset-y-1 left-0 right-1/2 bg-[#963314]/12 ${
                        isRowStart ? "rounded-l-full" : ""
                      }`}
                    />
                  )}

                  {/* Day Circle Button */}
                  <button
                    type="button"
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => {
                      if (selectedStart && !selectedEnd) {
                        setHoveredDate(new Date(currentYear, currentMonth, day));
                      }
                    }}
                    className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isSelectedEndpoint
                        ? "bg-[#963314] text-white font-bold shadow-xs scale-105"
                        : isHighlighted
                        ? "text-[#963314] font-bold"
                        : "text-zinc-800 hover:bg-zinc-100"
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Clean Footer Actions */}
          <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Reset
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={!selectedStart}
                className="px-5 py-2.5 rounded-xl bg-[#963314] hover:bg-[#802a0f] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-2" />
                <span>{nightsCount > 0 ? `Apply (${nightsCount}N)` : "Apply Dates"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
