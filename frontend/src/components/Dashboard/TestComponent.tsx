
import {ProfileCard} from "@/components/Dashboard/ProfileCard.tsx";
import {TodayClass, TodayClassProps} from "@/components/Dashboard/TodayClass.tsx";
import {AttendanceDonutChart} from "@/components/Dashboard/AttendanceDonutChart.tsx";


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


export const Dashboard = () => {
    return (
        <div className={'gap-2 p-2 flex flex-col bg-[#f8fafd]'}>

            {/*Profile and Today's class*/}
            <div className={'grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-2'}>

                {/*Profile and Today's class*/}
                <div className={'h-[600px] flex flex-col gap-2'}>
                    <div>
                        <ProfileCard/>
                    </div>

                    <div className={'flex flex-col flex-grow overflow-hidden'}>
                        <div className={'flex flex-col space-y-4 overflow-y-auto scrollbar h-full'}>
                            {
                                TodayClassData.map((each) => (
                                    <TodayClass {...each}/>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/*Attendance Donut Chart*/}
                <div>
                    <AttendanceDonutChart/>
                </div>

                <div className={'hidden xl:block'}>Userinfo</div>
            </div>


        </div>
    );
};