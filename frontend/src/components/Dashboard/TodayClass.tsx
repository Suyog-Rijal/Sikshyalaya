export interface TodayClassProps {
    image: string,
    teacherName: string,
    subjectName: string,
    startTime: string,
    endTime: string,
    status?: string;
}

export const TodayClass = ({
                               image,
                               teacherName,
                               subjectName,
                               startTime,
                               endTime,
                               status,
                           }: TodayClassProps) => {
    const calculateStatus = (startTime: string, endTime: string): string => {
        const now = new Date();
        const start = new Date(now.toDateString() + " " + startTime).getTime();
        const end = new Date(now.toDateString() + " " + endTime).getTime();
        const currentTime = now.getTime();

        if (currentTime < start) {
            return "Pending";
        } else if (currentTime >= start && currentTime <= end) {
            return "Running";
        } else {
            return "Completed";
        }
    };

    // Determine the status (use provided or calculate)
    const classStatus = status || calculateStatus(startTime, endTime);
    return (
        <div
            className={'hover:-translate-y-1 duration-500 shadow flex flex-col rounded-md items-center justify-between gap-2 p-2'}>

            <div className={'w-full flex justify-between items-center gap-2'}>

                <div className=" overflow-hidden rounded-full">
                    <img src={image} alt={'x'} className={'w-12 h-12 object-cover '}/>
                </div>

                <div className={'flex flex-col flex-1'}>
                    <p className={'cursor-pointer'}>{subjectName}</p>
                    <p className={'text-xs'}>{teacherName}</p>
                </div>

            </div>

            <div className={'w-full flex justify-between items-center gap-2 text-xs text-gray-500'}>
                <div className={'flex gap-2'}>
                    <p>{startTime}</p>
                    <span>-</span>
                    <p>{endTime}</p>
                </div>
                <div>
                    <p className={
                        classStatus === "Pending" ? "text-yellow-500" :
                            classStatus === "Running" ? "text-green-500" :
                                "text-gray-400"
                    }>{classStatus}</p>
                </div>
            </div>


        </div>
    );
};