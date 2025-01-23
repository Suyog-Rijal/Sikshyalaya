import {UserInfoCard, UserInfoCardProps} from "@/components/Dashboard/UserInfoCard.tsx";
import {CountChart} from "@/components/Dashboard/CountChart.tsx";
import {AttendanceChart} from "@/components/Dashboard/AttendanceChart.tsx";

const UserCardInfoData: UserInfoCardProps[] = [
    {
        total: 100,
        title: "Total Students",
        active: 80,
        inactive: 20,
        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/student.svg",
        color: "bg-red-500",
    },
    {
        total: 20,
        title: "Total Teachers",
        active: 15,
        inactive: 5,
        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/teacher.svg",
        color: "bg-blue-500",
    },
    {
        total: 50,
        title: "Total Parents",
        active: 40,
        inactive: 10,
        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/teacher.svg",
        color: "bg-green-500",
    },
    {
        total: 10,
        title: "Total Staffs",
        active: 10,
        inactive: 0,
        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/subject.svg",
        color: "bg-purple-500",
    },
];


export const Dashboard = () => {
    return (
        <div className={'gap-4 p-4 flex h-full flex-col bg-[#f8fafd]'}>

            {/*UserCardInfo*/}
            <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2'}>
                {
                    UserCardInfoData.map((each: {
                        total: number;
                        title: string;
                        active: number;
                        inactive: number;
                        image: string;
                        color: string;
                    }) => (
                        <UserInfoCard total={each.total}
                                      title={each.title}
                                      active={each.active}
                                      inactive={each.inactive}
                                      image={each.image}
                                      color={each.color}/>
                    ))
                }
            </div>

            {/*Chart*/}
            <div className={'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12'}>
                <div className={'sm:col-span-2 md:col-span-1 lg:col-span-3 h-[400px] rounded-md bg-white'}>
                    <CountChart/>
                </div>

                <div className={'sm:col-span-2 md:col-span-2 lg:col-span-6 h-[400px] rounded-md bg-white'}>
                    <AttendanceChart/>
                </div>

                <div className={'lg:block flex items-center  lg:col-span-3 rounded-md '}>
                    <div className="flex h-full w-full items-stretch">

                    </div>
                </div>
            </div>

        </div>
    );
};