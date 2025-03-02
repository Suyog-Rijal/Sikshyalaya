import {ReactNode, RefObject, useRef, useState} from "react";
import {useClickOutside} from "@/hooks/useClickOutside.ts";

interface ActionMenuItem {
    id: number
    label: string
    onClick: () => void
    icon?: ReactNode
}

export interface ActionMenuProps {
    items: ActionMenuItem[]
}

export const ActionMenu = ({items}: ActionMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref: RefObject<HTMLDivElement> = useRef(null);
    useClickOutside(ref, () => setIsOpen(false))

    return (
        <div className={'relative'} ref={ref}>
            <button className={'cursor-pointer rounded-full p-1.5 hover:bg-gray-100 transition-colors duration-500'}
                    onClick={() => setIsOpen(!isOpen)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                </svg>
            </button>

            {
                isOpen && (
                    <div className={'absolute right-0 mt-1 w-48 bg-white rounded-md shadow py-1 z-10'}>
                        {
                            items.map((each, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        each.onClick()
                                        setIsOpen(false)
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <span>{each.icon}</span>
                                    <span>{each.label}</span>
                                </button>
                            ))
                        }
                    </div>
                )
            }

        </div>
    );
};
