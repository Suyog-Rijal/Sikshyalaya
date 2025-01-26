export interface NoticeBoardProps {
    title: string;
    createdAt: string;
}

export const NoticeBoardCard = ({ title, createdAt }: NoticeBoardProps) => {

    return (
        <div className={'flex hover:-translate-y-1 duration-500 shadow rounded-md items-center justify-between gap-2 p-2'}>

            <div className={'flex flex-col w-full'}>
                <h1 className={''}>{title}</h1>
                <p className={'text-xs overflow-hidden flex items-center overflow-ellipsis whitespace-nowrap gap-1 text-gray-400'}>
                    {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                    <span className={'flex justify-center items-center'}><ion-icon name="stopwatch-outline"></ion-icon></span>
                    <span className={'flex justify-center items-center'}>Added on: </span>
                    <span className={'flex justify-center items-center'}>{createdAt}</span>
                </p>
            </div>
        </div>
    );
};
