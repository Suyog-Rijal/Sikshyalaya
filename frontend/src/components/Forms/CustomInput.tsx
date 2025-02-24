import {useState} from "react";

interface CustomInputProps {
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const CustomInput = ({label, type = 'text', placeholder, disabled = false, className = '', ...props}: CustomInputProps) => {
    const [value, setValue] = useState('');
    return (
        <div className={`flex flex-col gap-2`} {...props}>
            <label htmlFor={label} className={'text-sm font-semibold'}>{label}</label>
            <input
                name={label}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className={`p-2 border border-gray-200 outline-hidden rounded-md ${className}`} />
        </div>
    );
};