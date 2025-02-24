import { ReactNode, HTMLAttributes } from "react";

interface FormContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const FormContainer = ({ children, className = "", ...props }: Readonly<FormContainerProps>) => {
    return (
        <div className={`rounded-md shadow-xs bg-white ${className}`} {...props}>
            {children}
        </div>
    );
};
