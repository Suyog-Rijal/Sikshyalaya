interface CustomInputProps {
    label: string;
    icon?: string;
}

export const Heading = ({label, icon}: CustomInputProps) => {
    return (
        <div className={'p-4 bg-zinc-200/80 rounded-tl-md rounded-tr-md'}>
            {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
            <ion-icon name={icon}></ion-icon>
            <span className={'text-xl font-semibold'}> {label}</span>
        </div>
    );
};

