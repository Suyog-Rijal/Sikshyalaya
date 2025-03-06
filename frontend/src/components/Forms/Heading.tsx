interface CustomInputProps {
    title: string;
    icon?: string;
}

export const Heading = ({title, icon}: CustomInputProps) => {
    return (
        <div className={'p-4 bg-gray-100 rounded-tl-md rounded-tr-md'}>
            {
                // @ts-expect-error: ion-icon is not recognized by TypeScript
                icon && <ion-icon name={icon}></ion-icon>
            }
            <span className={'text-xl font-semibold'}> {title}</span>
        </div>
    );
};

