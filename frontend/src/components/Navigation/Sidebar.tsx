import {Link} from "react-router-dom";

type Role = "admin" | "teacher" | "student" | "parent" | "staff";

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
                visible: ["admin", "teacher", "staff", "student", "parent"],
            },
            {
                icon: "/teacher.png",
                label: "Staff",
                href: "/staff/list",
                visible: ["admin"],
            },
            {
                icon: "/student.png",
                label: "Students",
                href: "/student/list",
                visible: ["admin", "teacher", 'staff'],
            },
            {
                icon: "/parent.png",
                label: "Parents",
                href: "/parent/list",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/class.png",
                label: "Classes",
                href: "/classes/list/",
                visible: ["admin",],
            },
            {
                icon: "/subject.png",
                label: "Subjects",
                href: "/subject/list/",
                visible: ["admin"],
            },
            {
                icon: "/lesson.png",
                label: "Routine",
                href: "/routine/list/",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/exam.png",
                label: "Exams",
                href: "/exam/list",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/assignment.png",
                label: "Assignments",
                href: "/assignment/list",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/result.png",
                label: "Leave",
                href: "/leave",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/attendance.png",
                label: "Attendance",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/message.png",
                label: "Messages",
                href: "/messages",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/announcement.png",
                label: "Announcements",
                href: "/announcement/list",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/class.png",
                label: "Fees",
                href: "/fees/",
                visible: ["admin", "staff", "parent"],
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
                visible: ["admin", "teacher", "student", "parent", "staff"],
            },
            {
                icon: "/logout.png",
                label: "Logout",
                href: "/logout",
                visible: ["admin", "teacher", "student", "parent", "staff"],
            },
        ],
    },
];

export const Sidebar = () => {
    const role = localStorage.getItem('role') as Role;
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