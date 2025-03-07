import {role} from "@/utils/data.ts";
import {Link} from "react-router-dom";
// import { Link } from "react-router-dom";

type Role = "admin" | "teacher" | "student" | "parent";

interface MenuItem {
    icon: string;
    label: string;
    href: string;
    visible: Role[];
}

interface Menu {
    title: string;
    items: MenuItem[];
}

const menuItems: Menu[] = [
    {
        title: "MENU",
        items: [
            {
                icon: "/home.png",
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/teacher.png",
                label: "Teachers",
                href: "/list/teachers",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/student.png",
                label: "Students",
                href: "/list/students",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/parent.png",
                label: "Parents",
                href: "/list/parents",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/subject.png",
                label: "Subjects",
                href: "/list/subjects",
                visible: ["admin"],
            },
            {
                icon: "/class.png",
                label: "Classes",
                href: "/list/classes",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/lesson.png",
                label: "Lessons",
                href: "/list/lessons",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/exam.png",
                label: "Exams",
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/assignment.png",
                label: "Assignments",
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/result.png",
                label: "Results",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/attendance.png",
                label: "Attendance",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/calendar.png",
                label: "Events",
                href: "/list/events",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/message.png",
                label: "Messages",
                href: "/list/messages",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/announcement.png",
                label: "Announcements",
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
    {
        title: "OTHER",
        items: [
            {
                icon: "/profile.png",
                label: "Profile",
                href: "/profile",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/setting.png",
                label: "Settings",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/logout.png",
                label: "Logout",
                href: "/logout",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
];

export const Sidebar = () => {
    return (
        <div className={'py-2 px-4 flex flex-col gap-4'}>
                <div className={'px-2 flex items-center justify-center md:justify-start gap-2 sticky p-2 top-0 bg-white'}>
                    <img src={'/logo.png'} alt="" width={32} height={32}/>
                    <a href={'/'} className={'hidden lg:block text-lg font-medium'}>Sikshyalaya</a>
                </div>
            {
                menuItems.map((each) => (
                    <div key={each.title} className={'flex flex-col gap-2'}>
                        <span className={'hidden lg:block px-2'}>{each.title}</span>
                        {
                            each.items.map((element) => (
                                element.visible.includes(role) && (
                                    <Link to={element.href} key={element.label}
                                       className={'flex gap-2 items-center justify-center lg:justify-start hover:bg-[var(--tw-sidebar-hover)] hover:text-[var(--tw-text-hover)] p-2 duration-500 rounded-md'}>
                                        <img src={element.icon} alt={'x'} width={20} height={20}/>
                                        <span className={'hidden lg:block'}>{element.label}</span>
                                    </Link>
                                )
                                ))
                        }
                    </div>
                ))
            }
        </div>
    );
};