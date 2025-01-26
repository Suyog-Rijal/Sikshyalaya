import { useState } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const SimpleCalender = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <div className={'flex justify-center items-center h-full shadow-xs'}>
            <Calendar onChange={onChange} value={value} />
        </div>
    );
}