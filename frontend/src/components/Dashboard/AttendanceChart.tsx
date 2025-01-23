"use client";

import {Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
const primaryColor = '#d0ed57';
const secondaryColor = '#ffc658';

const data = [
    {
        name: 'Sun',
        present: 40,
        absent: 24,
    },
    {
        name: 'Mon',
        present: 30,
        absent: 13,
    },
    {
        name: 'Tue',
        present: 20,
        absent: 19,
    },
    {
        name: 'Wed',
        present: 27,
        absent: 3,
    },
    {
        name: 'Thu',
        present: 18,
        absent: 4,
    },
    {
        name: 'Fri',
        present: 45,
        absent: 3,
    },
];

export const AttendanceChart = () => {
    return (
        <div className={'flex flex-col gap-2 h-full'}>

            <div className={'p-4 flex justify-between items-center'}>
                <h1>Attendance</h1>
                <p>Weekly</p>
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
                        <Bar dataKey="present" fill={primaryColor} activeBar={<Rectangle fill="#ffb74d"/>}
                             radius={[5, 5, 0, 0]} legendType={'circle'}/>
                        <Bar dataKey="absent" fill={secondaryColor} activeBar={<Rectangle fill="#d2e34d"/>}
                             radius={[5, 5, 0, 0]} legendType={'circle'}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};