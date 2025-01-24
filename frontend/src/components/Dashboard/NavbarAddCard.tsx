export interface NavbarAddCardProps {
    image: string;
    title: string;
    color: string;
}

export const NavbarAddCard = ({ image, title, color }: NavbarAddCardProps) => {
    return (
        <div className={`h-full rounded gap-2 ${color} flex justify-center items-center flex-col`}>
            <div className={'w-8 h-8'}>
                <img src={image} alt="x" className={'w-full h-full object-center object-cover'}/>
            </div>
            <p className={'text-sm text-black'}>{title}</p>
        </div>
    );
};