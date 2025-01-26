export interface UserInfoCardProps {
    total: number;
    title: string;
    active: number;
    inactive: number;
    image: string;
    color: string;
}

export const UserInfoCard = ({total, title, active, inactive, image, color}: UserInfoCardProps) => {
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;
    return (
        <div className={'flex hover:-translate-y-1 duration-500 flex-col p-4 rounded-md shadow-xs gap-8 bg-white'}>

            <div className={'flex items-center gap-2'}>
                <div className={'bg-pink-100 w-20 p-1'}>
                    <img src={image} alt={'Total Users'} className={'w-12 h-12'}/>
                </div>
                <div className={'w-full'}>
                    <div className={'flex justify-between'}>
                        <h1 className={'text-2xl font-bold'}>{total}</h1>
                        <p className={`text-sm ${color} text-white flex items-center h-fit px-2 rounded-md`}>{percentage}%</p>
                    </div>
                    <p className={'text-sm text-[var(--tw-text-primary)]'}>{title}</p>
                </div>
            </div>

            <div className={'flex justify-between'}>
                <p className={'text-sm text-gray-700'}>Active: <span
                    className={'text-black font-semibold'}>{active}</span></p>
                <p className={'text-sm text-gray-700'}>Inactive: <span
                    className={'text-black font-semibold'}>{inactive}</span></p>
            </div>

        </div>
    );
};