export const ProfileCard = () => {
    return (
        <div className={'rounded-md bg-white shadow-xs'}>
            <div className={'flex flex-col justify-between h-full gap-2 p-4'}>
                <div className={'flex gap-2 items-center'}>
                    <div className={'h-16 w-16 bg-yellow-300'}></div>
                    <div>
                        <h1 className={'text-lg font-medium'}>Suyog Rijal</h1>
                        <p className={'text-sm text-gray-500'}>Class : III, C Roll No : 36545</p>
                    </div>
                </div>
                <div className="border-t border-dotted border-gray-500"></div>
                <div className={'flex justify-between items-center'}>
                    <h2>First term: <span className={'text-xs px-2 rounded-md bg-green-100 text-green-500'}>Pass</span></h2>
                    <button className={'p-1 rounded-md bg-blue-500 text-white'}>Edit profile</button>
                </div>
            </div>
        </div>
    );
};