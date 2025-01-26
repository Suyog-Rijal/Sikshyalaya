import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const primaryColor = '#d0ed57';
const secondaryColor = '#ffc658';

const data = [
    {
        name: 'Jan',
        income: 4000,
        expense: 2400,
    },
    {
        name: 'Feb',
        income: 3000,
        expense: 1398,
    },
    {
        name: 'Mar',
        income: 2000,
        expense: 9800,
    },
    {
        name: 'Apr',
        income: 2780,
        expense: 3908,
    },
    {
        name: 'May',
        income: 1890,
        expense: 4800,
    },
    {
        name: 'Jun',
        income: 2390,
        expense: 3800,
    },
    {
        name: 'Jul',
        income: 3490,
        expense: 4300,
    },
    {
        name: 'Aug',
        income: 3490,
        expense: 4300,
    },
    {
        name: 'Sep',
        income: 3490,
        expense: 4300,
    },
    {
        name: 'Otc',
        income: 3490,
        expense: 4300,
    },
    {
        name: 'Nov',
        income: 3490,
        expense: 4300,
    },
    {
        name: 'Dec',
        income: 3490,
        expense: 4300,
    },
];

export const FinanceChart = () => {
    return (
        <div className={'flex flex-col h-full w-full pr-4 pl-2'}>
            <div className={'flex justify-between p-4'}>
                <h1 className={'font-semibold text-lg'}>Finance</h1>
                <p className={'text-[var(--tw-text-hover)]'}>Year 2025</p>
            </div>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            left: -5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={'#d3d3d3'}/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#D1D5DB"}}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: "#6B7280"}}/>
                        <Tooltip contentStyle={{borderRadius:'10px'}}/>
                        <Line type="monotone" dataKey="income" stroke={primaryColor} activeDot={{ r: 8 }} strokeWidth={4}/>
                        <Line type="monotone" dataKey="expense" stroke={secondaryColor} strokeWidth={4}/>
                    </LineChart>
                </ResponsiveContainer>
        </div>
    );
};