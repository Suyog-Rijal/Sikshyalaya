export interface QuickLinksProps {
    icon: string;
    title: string;
    bgColor: string;
    fgColor: string;
    ringColor: string;
}
export const QuickLinkCard = ({icon, title, bgColor, fgColor, ringColor}: QuickLinksProps) => {
    return (

        <div className={`flex justify-center items-center rounded-lg h-full w-full flex-col gap-2 ${bgColor} group`}>
            <div className={`${fgColor} cursor-pointer text-white w-3 h-3 xl:w-5 xl:h-5 flex items-center justify-center rounded-full ring-2 ring-offset-3 ${ringColor} group-hover:scale-x-[-1] transition-transform duration-500`}>
                {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                <ion-icon name={icon}></ion-icon>
            </div>
            <p className={'text-sm lg:text-md'}>{title}</p>
        </div>


    );
};
