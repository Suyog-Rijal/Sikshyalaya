import {ReactNode} from "react";

export const MainPage = ({children, className}: {children: ReactNode, className?: string}) => {
    return (
        <div className={`${className}  p-4`}>
            {children}
        </div>
    );
};