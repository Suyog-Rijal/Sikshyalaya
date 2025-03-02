import { ButtonHTMLAttributes, forwardRef, ReactNode, useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // Importing the loader icon

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'neutral';
    playful?: boolean;
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    loadingText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
    fullWidth?: boolean;
    preserveWidth?: boolean;
}

const variantClasses = {
    primary: {
        default: 'bg-[#5649E8] text-white hover:bg-[#4638D6]',
        playful: 'bg-[#E6E4FB] text-[#5649E8] hover:bg-[#D1CFFC]',
    },
    secondary: {
        default: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        playful: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    neutral: {
        default: 'bg-white shadow text-gray-800 hover:bg-gray-100',
        playful: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
    },
    danger: {
        default: 'bg-red-500 text-white hover:bg-red-600',
        playful: 'bg-red-100 text-red-500 hover:bg-red-200',
    },
};


const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
};

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            playful = false,
            loading = false,
            loadingText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            preserveWidth = true,
            children,
            className = "",
            disabled,
            type = "button",
            ...props
        },
        ref
    ) => {
        const buttonRef = useRef<HTMLDivElement>(null);
        const [buttonWidth, setButtonWidth] = useState<number | null>(null);
        const [, setShowContent] = useState<boolean>(!loading);

        useEffect(() => {
            if (buttonRef.current && preserveWidth && !buttonWidth) {
                setButtonWidth(buttonRef.current.offsetWidth);
            }
        }, [children, preserveWidth, buttonWidth]);

        useEffect(() => {
            let timer: ReturnType<typeof setTimeout>;
            if (loading) {
                setShowContent(false);
            } else {
                timer = setTimeout(() => {
                    setShowContent(true);
                }, 300);
            }

            return () => {
                if (timer) clearTimeout(timer);
            };
        }, [loading]);

        const isDisabled = loading || disabled;

        const buttonClass = `${playful ? variantClasses[variant]?.playful : variantClasses[variant]?.default} ${sizeClasses[size]} ${
            fullWidth ? "w-full" : ""
        } ${isDisabled && !loading ? "opacity-50" : ""} ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-center rounded-md transition-all duration-300 ${className}`;

        // Get style for maintaining consistent width if preserveWidth is true
        const buttonStyle = preserveWidth && buttonWidth ? { minWidth: `${buttonWidth}px` } : {};

        return (
            <button
                ref={ref as never}
                type={type}
                disabled={isDisabled}
                className={buttonClass}
                style={buttonStyle}
                {...props}
            >
                <div ref={buttonRef} className="flex items-center justify-center relative w-full">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fadeIn">
                            <Loader2 className="animate-spin mr-2" size={16} />
                            {loadingText}
                        </div>
                    )}

                    <div className={`flex items-center justify-center transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2">{rightIcon}</span>}
                    </div>
                </div>
            </button>
        );
    }
);

CustomButton.displayName = "CustomButton";
