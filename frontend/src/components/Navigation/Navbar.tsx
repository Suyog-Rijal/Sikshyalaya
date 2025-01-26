// import {NavbarAddCardProps} from "@component/Dashboard/NavbarAddCard.tsx";


// const NavbarAddCardData: NavbarAddCardProps[] = [
//     {
//         title: 'Add Student',
//         image: '/student.png',
//         color: 'bg-[#f2f5ff]'  // Light Blue
//     },
//     {
//         title: 'Add Teacher',
//         image: 'https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/svg/person-add-outline.svg',
//         color: 'bg-green-50'  // Light Green
//     },
//     {
//         title: 'Add Staff',
//         image: 'https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/svg/book-outline.svg',
//         color: 'bg-yellow-50'  // Light Yellow
//     },
//     {
//         title: 'Add Event',
//         image: 'https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/svg/people-outline.svg',
//         color: 'bg-red-50'  // Light Red
//     }
// ];



export const Navbar = () => {
    return (
        <div className={'flex bg-white items-center justify-between p-2 z-10 sticky top-0'}>

            {/* Left Section */}
            <div className={'p-1 rounded-md items-center w-44 md:w-52 lg:w-64 justify-center flex gap-1 border-2 border-gray-100'}>
                {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                <ion-icon name="search-outline"></ion-icon>
                <input
                    type={'search'}
                    placeholder={'Search'}
                    className={'bg-transparent outline-none text-sm p-0.5 w-full'}
                />
            </div>

            {/* Right Section */}
            <div className={'flex justify-center items-center gap-2'}>

                <p className={'hidden px-2 py-1 bg-white rounded-md border-2 select-none border-gray-100 lg:block'}>
                    Academic Year: 2024/2025
                </p>

                <div title={'Add New'}
                     className={' relative hidden bg-white w-8 h-8 cursor-pointer border-2 border-gray-100 lg:flex items-center justify-center rounded-md hover:text-[var(--tw-text-hover)] duration-500 hover:-translate-y-1'}>
                    <div className={'flex items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="add-circle-outline"></ion-icon>
                    </div>
                    {/*<div className={'bg-white shadow-xl p-2 absolute rounded-md z-10 top-full mt-1 w-64 h-64 hover:bg-white duration-500 hover:text-text-primary'}>*/}
                    {/*    <div className={'w-full h-full grid grid-cols-2 grid-rows-2 gap-2'}>*/}
                    {/*        {*/}
                    {/*            NavbarAddCardData.map((each) => (*/}
                    {/*                <NavbarAddCard title={each.title} image={each.image} color={each.color}/>*/}
                    {/*            ))*/}
                    {/*        }*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <div
                    className={'hidden bg-white w-8 h-8 cursor-pointer border-2 border-gray-100 lg:flex items-center justify-center rounded-md hover:text-[var(--tw-text-hover)] duration-500 hover:-translate-y-1'}>
                    <div className={'flex items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="moon-outline"></ion-icon>
                    </div>
                </div>

                <div
                    className={'hidden bg-white w-8 h-8 cursor-pointer border-2 border-gray-100 lg:flex items-center justify-center rounded-md hover:text-[var(--tw-text-hover)] duration-500 hover:-translate-y-1'}>
                    <div className={'flex items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="chatbubbles-outline"></ion-icon>
                    </div>
                </div>

                <div
                    className={'hidden bg-white w-8 h-8 cursor-pointer border-2 border-gray-100 lg:flex items-center justify-center rounded-md hover:text-[var(--tw-text-hover)] duration-500 hover:-translate-y-1'}>
                    <div className={'flex items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="bar-chart-outline"></ion-icon>
                    </div>
                </div>

                <div
                    className={'hidden bg-white w-8 h-8 cursor-pointer border-2 border-gray-100 lg:flex items-center justify-center rounded-md hover:text-[var(--tw-text-hover)] duration-500 hover:-translate-y-1'}>
                    <div className={'flex items-center'}>
                        {/* @ts-expect-error: ion-icon is not recognized by TypeScript */}
                        <ion-icon name="scan-outline"></ion-icon>
                    </div>
                </div>

                <div className={'flex px-2 py-1 gap-4 rounded-md border-2 items-center border-gray-100 hover:bg-background-hover duration-500 hover:text-text-hover cursor-pointer'}>
                    <div>
                        <p className={'text-sm'}>Suyog Rijal</p>
                        <p className={'text-xs text-text-muted'}>Admin</p>
                    </div>
                    <div className={'bg-purple-600 h-8 w-8 rounded-md cursor-pointer'}>
                        <img src={'https://via.placeholder.com/150'} alt={'profile'}/>
                    </div>
                </div>

            </div>

        </div>
    );
};
