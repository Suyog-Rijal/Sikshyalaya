import { useState, useRef, useEffect } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
    label: string;
    className?: string;
}

export function CustomDatePicker({ label, className = "" }: CustomDatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setIsOpen(false);
    };

    return (
        <div className={`flex flex-col gap-1 rounded py-2 px-3 ${className}`} ref={pickerRef}>
            <label htmlFor="datepicker" className="block text-sm text-gray-500">
                {label}
            </label>
            <div className="relative">
                <button
                    id="datepicker"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-1.5 border border-gray-200 rounded text-left bg-white hover:bg-gray-50 transition"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
          <span className={`${selectedDate ? "text-gray-900" : "text-gray-700"} text-sm`}>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </span>
                    <ChevronRight className="h-4 w-4 rotate-90 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </button>

                {isOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-sm border border-dotted border-gray-300 bg-white p-2 shadow-md">
                        <div className="mb-4 flex items-center justify-between">
                            <button
                                onClick={previousMonth}
                                className="rounded-sm p-2 hover:bg-gray-100 transition"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="h-4 w-4 text-gray-500" />
                            </button>
                            <h2 className="text-xs font-medium text-gray-700">
                                {format(currentMonth, "MMMM yyyy")}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="rounded-sm p-1 hover:bg-gray-100 transition"
                                aria-label="Next month"
                            >
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}

                            {daysInMonth.map((date) => {
                                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                                const isCurrentDay = isToday(date);

                                return (
                                    <button
                                        key={date.toString()}
                                        onClick={() => handleDateSelect(date)}
                                        className={`aspect-square rounded-sm text-xs w-full p-3 transition flex justify-center items-center
                      ${isSelected ? "bg-blue-400 text-white" : "hover:bg-gray-100"}
                      ${isCurrentDay && !isSelected ? "font-bold text-blue-600" : "text-gray-700"}`}
                                    >
                                        {format(date, "d")}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
