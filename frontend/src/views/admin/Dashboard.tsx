import {UserInfoCard, type UserInfoCardProps} from "@/components/Dashboard/UserInfoCard.tsx"
import {CountChart} from "@/components/Dashboard/CountChart.tsx"
import {AttendanceChart} from "@/components/Dashboard/AttendanceChart.tsx"
import {SimpleCalender} from "@/components/Dashboard/SimpleCalender.tsx"
import {FinanceChart} from "@/components/Dashboard/FinanceChart.tsx"
import {QuickLinkCard, type QuickLinksProps} from "@/components/Dashboard/QuickLinkCard.tsx"
import {type LeaveRequestCardProps} from "@/components/Dashboard/LeaveRequestCard.tsx"
import { Calendar, Clock} from "lucide-react"
import {useEffect, useState} from "react";
import axiosInstance from "@/auth/AxiosInstance.ts";

interface dashboard {
    total_student_active: number,
    total_student_inactive: number,
    total_teacher_active: number,
    total_teacher_inactive: number,
    total_parent_active: number,
    total_parent_inactive: number,
    total_staff_active: number,
    total_staff_inactive: number,
    total_student: number,
    total_boys: number,
    total_girls: number,
    average_weekly_attendance: { [key: string]: number };
}

const QuickLinksData: QuickLinksProps[] = [
    {
        icon: "person-outline",
        title: "Student",
        bgColor: "bg-[#f9f4fb]",
        fgColor: "bg-purple-400",
        ringColor: "ring-purple-400",
        navigation: "/student/list",
    },
    {
        icon: "people-outline",
        title: "Parent",
        bgColor: "bg-[#f4fbf8]",
        fgColor: "bg-teal-400",
        ringColor: "ring-teal-400",
        navigation: "/parent/list",
    },
    {
        icon: "book-outline",
        title: "Exam",
        bgColor: "bg-[#f4f7fb]",
        fgColor: "bg-blue-400",
        ringColor: "ring-blue-400",
        navigation: "/exam/list",
    },
    {
        icon: "checkmark-done-outline",
        title: "Attendance",
        bgColor: "bg-[#fbf4f4]",
        fgColor: "bg-red-400",
        ringColor: "ring-red-400",
        navigation: "/list/attendance",
    },
    {
        icon: "cash-outline",
        title: "Fees",
        bgColor: "bg-[#fbf8f4]",
        fgColor: "bg-yellow-400",
        ringColor: "ring-yellow-400",
        navigation: "/fees/list",
    },
]

const LeaveRequestData: LeaveRequestCardProps[] = [
    {
        image: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
        name: "John Doe",
        appliedOn: "15 Jan 2024",
        startDate: "20 Jan 2024",
        endDate: "22 Jan 2024",
        leaveType: "emergency",
        accepted: true,
        candidateType: "teacher",
    },
    {
        image: "/diverse-group-city.png",
        name: "Jane Smith",
        appliedOn: "10 Jan 2024",
        startDate: "14 Jan 2024",
        endDate: "16 Jan 2024",
        leaveType: "holiday",
        accepted: true,
        candidateType: "student",
    },
    {
        image: "/diverse-group-city.png",
        name: "Michael Jones",
        appliedOn: "12 Jan 2024",
        startDate: "18 Jan 2024",
        endDate: "20 Jan 2024",
        leaveType: "casual",
        accepted: false,
        candidateType: "teacher",
    },
    {
        image: "/diverse-group-city.png",
        name: "Anna Williams",
        appliedOn: "14 Jan 2024",
        startDate: "19 Jan 2024",
        endDate: "21 Jan 2024",
        leaveType: "family",
        accepted: true,
        candidateType: "student",
    },
    {
        image: "/diverse-group-city.png",
        name: "Robert Brown",
        appliedOn: "10 Jan 2024",
        startDate: "15 Jan 2024",
        endDate: "17 Jan 2024",
        leaveType: "emergency",
        accepted: false,
        candidateType: "teacher",
    },
    {
        image: "/diverse-group-city.png",
        name: "Susan Davis",
        appliedOn: "8 Jan 2024",
        startDate: "13 Jan 2024",
        endDate: "15 Jan 2024",
        leaveType: "holiday",
        accepted: true,
        candidateType: "student",
    },
    {
        image: "/diverse-group-city.png",
        name: "Mark Taylor",
        appliedOn: "11 Jan 2024",
        startDate: "16 Jan 2024",
        endDate: "18 Jan 2024",
        leaveType: "casual",
        accepted: true,
        candidateType: "teacher",
    },
    {
        image: "/diverse-group-city.png",
        name: "Lisa Martin",
        appliedOn: "9 Jan 2024",
        startDate: "14 Jan 2024",
        endDate: "16 Jan 2024",
        leaveType: "family",
        accepted: true,
        candidateType: "student",
    },
]

export const Dashboard = () => {
    const [userCardInfoData, setUserCardInfoData] = useState<UserInfoCardProps[]>([]);
    const [countChartData, setCountChartData] = useState<{ totalBoys: number; totalGirls: number }>({ totalBoys: 0, totalGirls: 0 });
    const [averageWeeklyAttendance, setAverageWeeklyAttendance] = useState<{ [key: string]: number }>({});
    const currentDate = new Date()
    const hours = currentDate.getHours()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    let greeting = "Good morning"
    if (hours >= 12 && hours < 17) {
        greeting = "Good afternoon"
    } else if (hours >= 17) {
        greeting = "Good evening"
    }

    useEffect(() => {
        axiosInstance.get<dashboard>("/api/academic/admin-dashboard/")
            .then((res) => {
                const apiData = res.data;
                // Map data for UserCardInfo
                const mappedUserCardData: UserInfoCardProps[] = [
                    {
                        total: apiData.total_student,
                        title: "Total Students",
                        active: apiData.total_student_active,
                        inactive: apiData.total_student_inactive,
                        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/student.svg",
                        color: "bg-rose-500",
                    },
                    {
                        total: apiData.total_teacher_active + apiData.total_teacher_inactive,
                        title: "Total Teachers",
                        active: apiData.total_teacher_active,
                        inactive: apiData.total_teacher_inactive,
                        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/teacher.svg",
                        color: "bg-sky-500",
                    },
                    {
                        total: apiData.total_parent_active + apiData.total_parent_inactive,
                        title: "Total Parents",
                        active: apiData.total_parent_active,
                        inactive: apiData.total_parent_inactive,
                        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/teacher.svg",
                        color: "bg-emerald-500",
                    },
                    {
                        total: apiData.total_staff_active + apiData.total_staff_inactive,
                        title: "Total Staff",
                        active: apiData.total_staff_active,
                        inactive: apiData.total_staff_inactive,
                        image: "https://preskool.dreamstechnologies.com/html/template/assets/img/icons/subject.svg",
                        color: "bg-violet-500",
                    },
                ];
                setUserCardInfoData(mappedUserCardData);
                // Set data for CountChart
                setCountChartData({
                    totalBoys: apiData.total_boys,
                    totalGirls: apiData.total_girls,
                });
                // Set data for AttendanceChart
                setAverageWeeklyAttendance(apiData.average_weekly_attendance);
            })
            .catch((err) => {
                console.error("Error fetching dashboard data:", err);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-4">
            {/* Welcome Section */}
            <div className="mb-6 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{greeting}, Admin</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4"/>
                            <span>
                                {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()},{" "}
                                {currentDate.getFullYear()}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2 rounded-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-slate-500"/>
                            <span className="text-slate-700 font-medium">
                                {currentDate.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* UserCardInfo */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {userCardInfoData.map((each, index) => (
                    <UserInfoCard
                        key={index}
                        total={each.total}
                        title={each.title}
                        active={each.active}
                        inactive={each.inactive}
                        image={each.image}
                        color={each.color}
                    />
                ))}
            </div>

            {/* Chart and simple calendar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 mb-6">
                <div className="sm:col-span-2 md:col-span-1 lg:col-span-3 h-[400px] rounded-xl bg-white shadow-sm ">
                    <CountChart totalBoys={countChartData.totalBoys} totalGirls={countChartData.totalGirls} />
                </div>

                <div className="sm:col-span-2 md:col-span-2 lg:col-span-6 h-[400px] rounded-xl bg-white shadow-sm ">
                    <AttendanceChart averageWeeklyAttendance={averageWeeklyAttendance} />
                </div>

                <div className="hidden lg:block lg:col-span-3 rounded-xl bg-white shadow-sm py-4">
                    <div className="h-full flex flex-col gap-3 px-4">
                        <div>
                            <h2 className="font-semibold text-lg text-slate-800">Quick Links</h2>
                            <p className="text-sm text-slate-500">Access important sections</p>
                        </div>
                        <div className="grid lg:grid-cols-1 xl:grid-cols-2 h-full gap-3">
                            {QuickLinksData.map((each, index) => (
                                <QuickLinkCard
                                    key={index}
                                    icon={each.icon}
                                    title={each.title}
                                    bgColor={each.bgColor}
                                    fgColor={each.fgColor}
                                    ringColor={each.ringColor}
                                    navigation={each.navigation}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Finance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="col-span-1 lg:col-span-3 h-[400px] rounded-xl bg-white shadow-sm ">
                    <FinanceChart/>
                </div>
                <div className="hidden lg:block lg:col-span-1 py-4 px-4 gap-3 h-[400px] bg-white rounded-xl shadow-sm ">
                    <SimpleCalender/>
                </div>
            </div>
        </div>
    )
}