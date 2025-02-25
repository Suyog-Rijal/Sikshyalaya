import { useState } from "react";

interface CustomInputProps {
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const CustomInput = ({
                                label,
                                type = "text",
                                placeholder,
                                disabled = false,
                                className = "",
                                ...props
                            }: CustomInputProps) => {
    const [value, setValue] = useState("");
    // -------------------------------------------- NEED FIX ---------------------------------------------------------
    const [isError, ] = useState(false);

    return (
        <div className="py-2 px-3 bg-white rounded relative" {...props}>
            <label htmlFor={label} className="flex justify-start items-center text-sm text-gray-500 mb-1">
                <span>{label}</span>
                {/*{*/}
                {/*    required && (*/}
                {/*        <span>*/}
                {/*            <Asterisk size={12} className="text-red-500 ml-0.5" />*/}
                {/*        </span>*/}
                {/*    )*/}
                {/*}*/}
            </label>
            {
                isError && (
                    <div className={'absolute right-4 p-2'}>
                        <div className={'w-full text-red-500 text-center rounded-sm cursor-pointer group'}>
                            {/*@ts-expect-error: Icon not recognized*/}
                            <ion-icon name="alert-outline"></ion-icon>
                            <div className={'group-hover:block hidden absolute text-red-500 p-1 rounded-xs z-10 bg-white shadow text-xs w-40 transform -translate-x-1/2'}>
                                All fields are required
                            </div>
                        </div>

                    </div>
                )
            }
            <input
                id={label}
                name={label}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className={`p-2 w-full border ${isError ? 'border-red-500': 'border-gray-200'} rounded-sm text-sm placeholder-gray-400 outline-purple-200 ${className}`}
            />
        </div>
    );
};
