export interface AvatarProps {
    src: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Avatar = (props: AvatarProps) => {
    const sizeClasses = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
    }

    return (
        <div className={`relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ${sizeClasses[props.size || 'md']}`}>
            <img src={props.src} alt={props.alt} className="object-cover"/>
        </div>
    );
};