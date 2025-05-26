import {Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

const primaryColor = '#d0ed57';

interface AttendanceChartProps {
    averageWeeklyAttendance: { [key: string]: number };
}

export const AttendanceChart = ({ averageWeeklyAttendance }: AttendanceChartProps) => {
    // Transform the average_weekly_attendance object into chart data
    const data = Object.entries(averageWeeklyAttendance).map(([className, attendance]) => ({
        name: className,
        attendance: attendance, // Use raw percentage value directly
    }));

    return (
        <div className={'flex flex-col gap-2 h-full shadow-xs'}>
            <div className={'p-4 flex justify-between items-center'}>
                <h1 className={'text-lg font-semibold'}>Attendance</h1>
                <p className={'text-[var(--tw-text-hover)]'}>Weekly Average by Class</p>
            </div>
            <div className={'flex flex-grow justify-center items-center px-4'}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        barSize={20}
                        margin={{
                            left: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={'#d3d3d3'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#D1D5DB" }} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280" }}
                            domain={[0, 100]} // Hardcode Y-axis to 0-100%
                            tickFormatter={(value) => `${value}%`} // Display as percentage
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '10px' }}
                            formatter={(value: number) => [`${value}%`, 'Attendance']}
                        />
                        <Bar
                            dataKey="attendance"
                            fill={primaryColor}
                            activeBar={<Rectangle fill="#b8cc3a" />}
                            radius={[5, 5, 0, 0]}
                            legendType={'circle'}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};