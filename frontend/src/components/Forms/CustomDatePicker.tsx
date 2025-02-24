import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
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
        <div className={`flex flex-col gap-2 ${className}`} ref={pickerRef}>
            <label className="text-sm font-semibold">{label}</label>
            <div className="relative w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-2 border border-gray-200 rounded-md text-left bg-white hover:bg-gray-50"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
                        {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                    </span>
                    <ChevronRight className="h-4 w-4 rotate-90 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </button>

                {isOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-md border border-gray-200 bg-white p-4 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <button onClick={previousMonth} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Previous month">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <h2 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
                            <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Next month">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-x-2 gap-y-3">
                            {weekDays.map((day) => (
                                <div key={day} className="mb-2 text-center text-xs font-medium text-gray-500">
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
                                        className={`aspect-square rounded-md text-sm w-full p-1
                                            ${isSelected ? "bg-yellow-300 text-black" : "hover:bg-gray-100"}
                                            ${isCurrentDay && !isSelected ? "font-bold text-white bg-[#5649E8]" : ""}`}
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
