"use client";

import {Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
const primaryColor = '#d0ed57';
const secondaryColor = '#ffc658';

const data = [
    {
        name: 'Sun',
        present: 5,
        absent: 0,
    },
    {
        name: 'Mon',
        present: 4,
        absent: 1,
    },
    {
        name: 'Tue',
        present: 4,
        absent: 1,
    },
    {
        name: 'Wed',
        present: 5,
        absent: 0,
    },
    {
        name: 'Thu',
        present: 3,
        absent: 2,
    },
    {
        name: 'Fri',
        present: 2,
        absent: 3,
    },
];

export const AttendanceChart = () => {
    return (
        <div className={'flex flex-col gap-2 h-full shadow-xs'}>

            <div className={'p-4 flex justify-between items-center'}>
                <h1 className={'text-lg font-semibold'}>Attendance</h1>
                <p className={'text-[var(--tw-text-hover)]'}>Weekly</p>
            </div>
            <div className={'flex flex-grow justify-center items-center px-4'}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        barSize={20}
                        margin={{
                            left: -35,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={'#d3d3d3'}/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#D1D5DB"}}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: "#6B7280"}}/>
                        <Tooltip contentStyle={{borderRadius:'10px'}}/>
                        <Bar dataKey="present" fill={secondaryColor} activeBar={<Rectangle fill="#ffb74d"/>}
                             radius={[5, 5, 0, 0]} legendType={'circle'}/>
                        <Bar dataKey="absent" fill={primaryColor} activeBar={<Rectangle fill="#d2e34d"/>}
                             radius={[5, 5, 0, 0]} legendType={'circle'}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};