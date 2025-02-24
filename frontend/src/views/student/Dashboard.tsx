import {ProfileCard} from "@/components/Dashboard/ProfileCard.tsx";
import {TodayClass, TodayClassProps} from "@/components/Dashboard/TodayClass.tsx";
import {AttendanceDonutChart} from "@/components/Dashboard/AttendanceDonutChart.tsx";
import {SimpleCalender} from "@/components/Dashboard/SimpleCalender.tsx";
import {QuickLinkCard, QuickLinksProps} from "@/components/Dashboard/QuickLinkCard.tsx";


const TodayClassData: TodayClassProps[] = [
    {
        image: "https://previews.123rf.com/images/auremar/auremar2001/auremar200101774/138602185-picture-of-a-single-man-in-a-park.jpg",
        teacherName: "John Doe",
        subjectName: "Mathematics",
        startTime: "09:00 AM",
        endTime: "10:30 AM",
    },
    {
        image: "https://www.shutterstock.com/image-photo/happy-young-man-sitting-home-260nw-2248472067.jpg",
        teacherName: "Jane Smith",
        subjectName: "Physics",
        startTime: "11:00 AM",
        endTime: "12:30 PM",
    },
    {
        image: "https://static.vecteezy.com/system/resources/previews/035/814/723/non_2x/ai-generated-portrait-of-handsome-businessman-wearing-white-shirt-isolated-gray-background-ai-generated-free-photo.jpg",
        teacherName: "Emily Brown",
        subjectName: "Chemistry",
        startTime: "12:30 PM",
        endTime: "02:30 PM",
    },
    {
        image: "https://previews.123rf.com/images/auremar/auremar2001/auremar200101774/138602185-picture-of-a-single-man-in-a-park.jpg",
        teacherName: "Michael Johnson",
        subjectName: "History",
        startTime: "03:00 PM",
        endTime: "04:30 PM",
    },
    {
        image: "https://static.vecteezy.com/system/resources/previews/035/814/723/non_2x/ai-generated-portrait-of-handsome-businessman-wearing-white-shirt-isolated-gray-background-ai-generated-free-photo.jpg",
        teacherName: "Sarah Lee",
        subjectName: "English Literature",
        startTime: "05:00 PM",
        endTime: "06:30 PM",
    },
];


const QuickLinkData: QuickLinksProps[] = [
    {
        icon: 'checkmark-done-outline',
        title: 'Attendance',
        bgColor: 'bg-[#fbf4f4]',
        fgColor: 'bg-red-400', // Red-400 for foreground
        ringColor: 'ring-red-400', // Red-400 for ring
    },
    {
        icon: 'book-outline',
        title: 'Exam',
        bgColor: 'bg-[#f4f7fb]',
        fgColor: 'bg-blue-400', // Blue-400 for foreground
        ringColor: 'ring-blue-400', // Blue-400 for ring
    },
    {
        icon: 'chatbubble-ellipses-outline',
        title: 'Messages',
        bgColor: 'bg-[#f4fbf8]',
        fgColor: 'bg-teal-400', // Teal-400 for foreground
        ringColor: 'ring-teal-400', // Teal-400 for ring
    },
];


export const Dashboard = () => {
    return (
        <div className={'gap-2 p-2 flex flex-col bg-[#f8fafd]'}>


            <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'}>

                {/*Profile and Today's class*/}
                <div className={'h-[600px] flex flex-col gap-2'}>
                    <div>
                        <ProfileCard/>
                    </div>

                    <div className={'col-span-3 lg:col-span-1 p-4 flex flex-col h-full gap-2 bg-white shadow-xs overflow-hidden'}>
                        <div className={'flex items-center justify-between'}>
                            <h1 className={'font-semibold text-lg'}>Today's class</h1>
                            <p className={'text-[var(--tw-text-hover)]'}>Date: 2025-27-1</p>
                        </div>

                        <div className={'flex flex-col overflow-y-scroll scrollbar'}>
                            {
                                TodayClassData.map((each) => (
                                    <TodayClass {...each}/>
                                ))
                            }
                        </div>
                    </div>
                </div>


                {/*Attendance Donut Chart*/}
                <div className={'bg-white shadow-xs p-4 h-[600px]'}>
                    <AttendanceDonutChart/>
                </div>

                <div className={'hidden p-4 xl:flex flex-col bg-white gap-2'}>
                    <div className={'space-y-2 flex flex-col items-center'}>
                        <h1 className={'font-semibold text-lg'}>Calender</h1>
                        <SimpleCalender/>
                    </div>
                    <div className={'h-full px-4 pt-2 flex flex-col items-center gap-2'}>
                        <h1 className={'font-semibold text-lg'}>Quick link</h1>
                        <div className={'w-full h-full'}>
                            <div className={'grid grid-cols-3 h-full gap-2'}>
                                {
                                    QuickLinkData.map((each) => (
                                        <QuickLinkCard {...each}/>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                sadfsfsadf
            </div>

        </div>
    );
};