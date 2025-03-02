import { ReactNode, HTMLAttributes } from "react";

interface FormContentContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const FormContentContainer = ({ children, className = "", ...props }: Readonly<FormContentContainerProps>) => {
    return (
        <div className={`p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`} {...props}>
            {children}
        </div>
    );
};
