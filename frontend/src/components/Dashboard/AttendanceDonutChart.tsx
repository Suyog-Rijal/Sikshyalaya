import {PieChart, Pie, Tooltip, ResponsiveContainer, Cell} from 'recharts';

const attendanceData = [
    { name: 'Present', value: 24, color: '#48BB78' },
    { name: 'Absent', value: 2, color: '#F56565' },
    { name: 'Late', value: 4, color: '#ECC94B' },
];



export const AttendanceDonutChart = () => {
    return (
        <div className={'flex flex-col gap-2 h-full shadow-xs'}>

            <div className={'flex justify-between'}>
                <h1 className={'font-semibold text-lg'}>Attendance</h1>
                <p className={'text-[var(--tw-text-hover)]'}>This month</p>
            </div>

            {/*<div className={'flex justify-evenly items-center'}>*/}
            {/*    <div className={'w-24 h-14 rounded-md flex items-center justify-center flex-col shadow-xs'}>*/}
            {/*        <h2>Present</h2>*/}
            {/*        <p className={'text-sm'}>23</p>*/}
            {/*    </div>*/}

            {/*    <div className={'w-px h-[75%] bg-gray-200'}></div>*/}

            {/*    <div className={'w-24 h-14 rounded-md flex items-center justify-center flex-col shadow-xs'}>*/}
            {/*        <h2>Absent</h2>*/}
            {/*        <p className={'text-sm'}>3</p>*/}
            {/*    </div>*/}

            {/*    <div className={'w-px h-[75%] bg-gray-200'}></div>*/}

            {/*    <div className={'w-24 h-14 rounded-md flex items-center justify-center flex-col shadow-xs'}>*/}
            {/*        <h2>Late</h2>*/}
            {/*        <p className={'text-sm'}>2</p>*/}
            {/*    </div>*/}
            {/*</div>*/}


            <div className={'flex h-[40%] relative'}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            fill="#82ca9d"
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

            </div>


            <div className={'flex justify-evenly'}>

                <div className={'flex flex-col items-center'}>
                    <div className={`w-4 h-4 rounded-full bg-green-500`}></div>
                    <p className={'text-sm'}>Present</p>
                </div>

                <div className={'flex flex-col items-center'}>
                    <div className={`w-4 h-4 rounded-full bg-red-500`}></div>
                    <p className={'text-sm'}>Absent</p>
                </div>

                <div className={'flex flex-col items-center'}>
                    <div className={`w-4 h-4 rounded-full bg-yellow-500`}></div>
                    <p className={'text-sm'}>Late</p>
                </div>
            </div>



            {/*<div className="flex flex-col items-center mt-2">*/}
            {/*    <h2 className="text-lg font-semibold mb-2">This Week</h2>*/}
            {/*    <div className="flex items-center justify-evenly w-full">*/}
            {/*        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (*/}
            {/*            <div*/}
            {/*                key={index}*/}
            {/*                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 text-sm font-medium"*/}
            {/*            >*/}
            {/*                {day}*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>
    );
};