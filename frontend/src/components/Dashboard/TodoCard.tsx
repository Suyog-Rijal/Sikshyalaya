import { useState } from 'react';

export interface TodoProps {
    title: string;
    description: string;
    completed: boolean;
}

export const TodoCard = ({ title, description, completed }: TodoProps) => {
    const [isCompleted, setIsCompleted] = useState(completed);

    const handleCheckboxChange = () => {
        setIsCompleted(!isCompleted);
    };

    return (
        <div className={'flex hover:-translate-y-1 duration-500 shadow rounded-md items-center justify-between gap-2 p-2'}>
            <div>
                <input
                    type={'checkbox'}
                    checked={isCompleted}
                    onChange={handleCheckboxChange}
                />
            </div>

            <div className={'flex flex-col w-[70%]'}>
                <h1 className={''}>{title}</h1>
                <p className={'text-xs overflow-hidden overflow-ellipsis whitespace-nowrap'}>
                    {description}
                </p>
            </div>

            <div>
                <p className={`p-1 text-xs rounded-md ${isCompleted ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {isCompleted ? 'complete' : 'incomplete'}
                </p>
            </div>
        </div>
    );
};
