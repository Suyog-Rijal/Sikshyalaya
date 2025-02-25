import {FC, useState, useEffect, useRef} from "react";

interface CustomDropdownProps {
    label: string;
    options: string[];
    placeholder?: string;
}

export const CustomDropdown: FC<CustomDropdownProps> = ({
                                                            label,
                                                            options,
                                                            placeholder = "Select an option",
                                                        }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [isError, setIsError] = useState(false);


    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
        setIsError(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col relative py-2 px-3 bg-white rounded-sm" ref={dropdownRef}>
            <label htmlFor={label} className="block text-sm text-gray-500 mb-1">
                {label}
            </label>
            <div
                className={`rounded-sm border ${isError ? "border-red-500": "border-gray-200"} p-2 cursor-pointer flex justify-between items-center`}
                onClick={toggleDropdown}
            >
        <span className="text-sm text-gray-700">
          {selectedOption || placeholder}
        </span>
                <span className="text-gray-500 flex justify-center items-center text-sm">
          {isOpen ? (
              // @ts-expect-error: IonIcon not recognized by TypeScript
              <ion-icon name="chevron-up-outline"></ion-icon>
          ) : (
              // @ts-expect-error: IonIcon not recognized by TypeScript
              <ion-icon name="chevron-down-outline"></ion-icon>
          )}
        </span>
            </div>
            {isOpen && (
                <ul className="absolute max-h-40 overflow-y-auto left-3 top-full w-[93%] md:w-[92%] rounded-sm bg-white shadow-md z-10">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
