import { FC, useState, useEffect, useRef } from "react";

interface CustomDropdownProps {
    label: string;
    options: string[];
    placeholder?: string;
}

export const CustomDropdown: FC<CustomDropdownProps> = ({ label, options, placeholder = "Select an option" }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col relative" ref={dropdownRef}>
            <label className="text-sm font-semibold mb-2">{label}</label>
            <div
                className="rounded-md border border-gray-200 p-2 cursor-pointer flex justify-between items-center"
                onClick={toggleDropdown}
            >
                <span>{selectedOption || placeholder}</span>
                <span className="text-gray-500">
                    {
                        // @ts-expect-error: ion-icon is not recognized by TypeScript
                        isOpen ? (<ion-icon name="chevron-down-outline"></ion-icon>
                    ) : (
                        // @ts-expect-error: ion-icon is not recognized by TypeScript
                        <ion-icon name="chevron-up-outline"></ion-icon>
                    )
                    }
                </span>
            </div>
            {isOpen && (
                <ul className="absolute max-h-40 overflow-y-scroll scrollbar top-full mt-1 w-full border border-gray-200 rounded-md bg-white shadow-md z-10">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
