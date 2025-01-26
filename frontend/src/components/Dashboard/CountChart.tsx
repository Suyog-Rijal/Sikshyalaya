"use client";

import {RadialBar, RadialBarChart, ResponsiveContainer} from "recharts";

const primaryColor = '#d0ed57';
const secondaryColor = '#ffc658';


const data = [
    {
        name: 'Boys',
        count: 25,
        fill: primaryColor,
    },
    {
        name: 'Girls ',
        count: 43,
        fill: secondaryColor,
    }
];
const totalCount = data.reduce((sum, item) => sum + item.count, 0);
data.unshift({
    name: 'Others',
    count: totalCount,
    fill: 'white',
})


export const CountChart = () => {
    return (
        <div className={'flex flex-col gap-2 h-full shadow-xs'}>

            <div className={'flex justify-between p-4'}>
                <h1 className={'font-semibold text-lg'}>Students</h1>
                <p className={'text-[var(--tw-text-hover)]'}>All class</p>
            </div>

            <div className={'flex flex-grow relative'}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="50%" outerRadius="110%" barSize={32} data={data}>
                        <RadialBar
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className={'absolute flex w-full h-full items-center justify-center text-5xl'}>
                    <div className={'text-[#ffc658]'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="man-outline"></ion-icon>
                    </div>
                    <div className={'text-[#d0ed57]'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="woman-outline"></ion-icon>
                    </div>
                </div>

            </div>

            <div className={'flex justify-evenly p-4'}>

                <div className={'flex flex-col items-center'}>
                    <div className={`w-4 h-4 rounded-full bg-[${primaryColor}]`}></div>
                    <h1 className={'font-semibold text-lg'}>3002</h1>
                    <p className={'text-sm'}>Boys 55%</p>
                </div>

                <div className={'flex flex-col items-center'}>
                    <div className={`w-4 h-4 rounded-full bg-[${secondaryColor}]`}></div>
                    <h1 className={'font-semibold text-lg'}>3002</h1>
                    <p className={'text-sm'}>Girls 55%</p>
                </div>


            </div>

        </div>
    );
};

