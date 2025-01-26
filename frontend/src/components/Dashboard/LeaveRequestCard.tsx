export interface LeaveRequestCardProps {
    image: string,
    name: string,
    appliedOn: string,
    startDate: string,
    endDate: string,
    leaveType: string,
    accepted: boolean,
    candidateType: string,
}

export const LeaveRequestCard = ({image, name, appliedOn, startDate, endDate, leaveType, candidateType}: LeaveRequestCardProps) => {

    return (
        <div className={'hover:-translate-y-1 duration-500 shadow flex flex-col rounded-md items-center justify-between gap-2 p-2'}>

            <div className={'w-full flex justify-between items-center gap-2'}>

                <div className=" overflow-hidden rounded-full">
                    <img src={image} alt={''} className={'w-12 h-12 object-cover '}/>
                </div>

                <div className={'flex flex-col flex-1'}>
                    <div className={'flex gap-2 items-center'}>
                        <p className={'cursor-pointer'}>{name}</p>
                        <p className={'text-xs p-1 bg-red-100 text-red-500 rounded-md'}>{leaveType}</p>
                    </div>
                    <p className={'text-xs'}>{candidateType}</p>
                </div>
                <div className={'flex gap-3'}>
                    <button
                        className={'w-5 h-5 rounded-md bg-green-100 text-green-500 flex justify-center items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="checkmark-outline"></ion-icon>
                    </button>

                    <button className={'w-5 h-5 rounded-md bg-red-100 text-red-500 flex justify-center items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>

            </div>

            <div className={'w-full flex justify-between items-center gap-2 text-xs text-gray-500'}>
                <div className={'flex gap-2'}>
                    <p>{startDate}</p>
                    <span>-</span>
                    <p>{endDate}</p>
                </div>
                <div>
                    <p>Applied on: {appliedOn}</p>
                </div>
            </div>


        </div>
    );
};