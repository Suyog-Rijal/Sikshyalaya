import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface CustomDropdownProps {
    label?: string;
    name: string;
    options?: { id: number; value: string }[];
    placeholder?: string;
    required?: boolean;
    className?: string;
    onChange?: (selectedId: number) => void;
}

export const CustomDropdown = ({
                                   label,
                                   name,
                                   options = [],
                                   placeholder,
                                   required,
                                   className = '',
                                   onChange, // destructuring onChange from props
                               }: CustomDropdownProps) => {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    const selectedId = watch(name);
    const selectedOption = options.find(opt => opt.id === selectedId);

    const { ...rest } = register(name);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (id: number) => {
        setValue(name, id, { shouldValidate: true });
        // Call the custom onChange function if provided
        if (onChange) {
            onChange(id);
        }
        setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            const currentIndex = options.findIndex(option => option.id === selectedId);
            const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
            setValue(name, options[nextIndex].id, { shouldValidate: true });
            if (onChange) {
                onChange(options[nextIndex].id);
            }
        } else if (e.key === 'ArrowUp' && isOpen) {
            e.preventDefault();
            const currentIndex = options.findIndex(option => option.id === selectedId);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            setValue(name, options[prevIndex].id, { shouldValidate: true });
            if (onChange) {
                onChange(options[prevIndex].id);
            }
        }
    };

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`} ref={dropdownRef}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm text-gray-700 mb-1 font-medium"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <div
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-white border ${
                        error ? "border-red-300" : "border-gray-200"
                    } rounded cursor-pointer focus:outline-none transition-colors`}
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    id={`${name}-dropdown`}
                    aria-labelledby={label ? `${name}-label` : undefined}
                >
                    <span className={selectedId ? "text-gray-800" : "text-gray-400"}>
                        {selectedOption ? selectedOption.value : placeholder || "Select an option"}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    />

                    <input
                        type="hidden"
                        id={name}
                        {...rest}
                    />
                </div>

                {isOpen && (
                    <ul
                        className="absolute left-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-sm max-h-48 overflow-y-auto"
                        role="listbox"
                        aria-labelledby={`${name}-dropdown`}
                    >
                        {options.map((option) => (
                            <li
                                key={option.id}
                                role="option"
                                aria-selected={selectedId === option.id}
                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                                    selectedId === option.id ? "bg-gray-50 text-blue-600" : "text-gray-800"
                                }`}
                                onClick={() => handleSelect(option.id)}
                            >
                                {option.value}
                            </li>
                        ))}
                    </ul>
                )}

                {error && (
                    <div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <AlertCircle size={16} className="text-red-500" />
                        {showTooltip && (
                            <div
                                ref={tooltipRef}
                                role="tooltip"
                                className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 shadow-sm p-2 rounded text-xs text-red-600 w-max max-w-[200px] z-20"
                            >
                                {errorMessage || "This field is invalid"}
                                <div className="absolute bottom-0 translate-y-1/2 right-4 transform rotate-45 w-2 h-2 bg-white border-b border-r border-gray-200"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
