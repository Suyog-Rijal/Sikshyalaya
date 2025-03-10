import {ReactNode} from "react";
import {Sidebar} from "@/components/Navigation/Sidebar.tsx";
import {Navbar} from "@/components/Navigation/Navbar.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

export const DashboardLayout = ({children}: Readonly<{ children: ReactNode }>) => {
    return (
        <div className={'flex h-screen w-full relative text-[var(--tw-text-primary)] overflow-hidden'}>

            {/*Mobile device sidebar*/}
            <div className={'absolute md:hidden w-5/12 h-full hidden'}></div>

            {/*Desktop sidebar*/}
            <div className={'hidden md:block md:w-1/12 lg:w-2/12 overflow-y-scroll scrollbar'}>
                <Sidebar></Sidebar>
            </div>

            {/*Content*/}
            <div className={'w-full md:w-11/12 lg:w-5/6 overflow-y-scroll scrollbar'}>
                <Navbar></Navbar>
                {children}
            </div>

            <Toaster richColors  />
        </div>
    );
};