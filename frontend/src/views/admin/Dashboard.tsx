import {UserInfoCard, UserInfoCardProps} from "@/components/Dashboard/UserInfoCard.tsx";
import {CountChart} from "@/components/Dashboard/CountChart.tsx";
import {AttendanceChart} from "@/components/Dashboard/AttendanceChart.tsx";
import {SimpleCalender} from "@/components/Dashboard/SimpleCalender.tsx";
import {FinanceChart} from "@/components/Dashboard/FinanceChart.tsx";
import {QuickLinkCard, QuickLinksProps} from "@/components/Dashboard/QuickLinkCard.tsx";
import {TodoCard, TodoProps} from "@/components/Dashboard/TodoCard.tsx";
import {NoticeBoardCard, NoticeBoardProps} from "@/components/Dashboard/NoticeBoardCard.tsx";
import {LeaveRequestCard, LeaveRequestCardProps} from "@/components/Dashboard/LeaveRequestCard.tsx";

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

const QuickLinksData: QuickLinksProps[] = [
    {
        icon: 'calendar-outline',
        title: 'Calendar',
        bgColor: 'bg-[#f4fbf4]',
        fgColor: 'bg-green-400', // Green-400 for foreground
        ringColor: 'ring-green-400', // Green-400 for ring
    },
    {
        icon: 'book-outline',
        title: 'Exam',
        bgColor: 'bg-[#f4f7fb]',
        fgColor: 'bg-blue-400', // Blue-400 for foreground
        ringColor: 'ring-blue-400', // Blue-400 for ring
    },
    {
        icon: 'checkmark-done-outline',
        title: 'Attendance',
        bgColor: 'bg-[#fbf4f4]',
        fgColor: 'bg-red-400', // Red-400 for foreground
        ringColor: 'ring-red-400', // Red-400 for ring
    },
    {
        icon: 'cash-outline',
        title: 'Fees',
        bgColor: 'bg-[#fbf8f4]',
        fgColor: 'bg-yellow-400', // Yellow-400 for foreground
        ringColor: 'ring-yellow-400', // Yellow-400 for ring
    },
    {
        icon: 'person-outline',
        title: 'Student',
        bgColor: 'bg-[#f9f4fb]',
        fgColor: 'bg-purple-400', // Purple-400 for foreground
        ringColor: 'ring-purple-400', // Purple-400 for ring
    },
    {
        icon: 'people-outline',
        title: 'Parent',
        bgColor: 'bg-[#f4fbf8]',
        fgColor: 'bg-teal-400', // Teal-400 for foreground
        ringColor: 'ring-teal-400', // Teal-400 for ring
    },
];

const TodoData: TodoProps[] = [
    {
        title: 'Finish writing project proposal',
        description: 'Complete the final draft of the project proposal for the upcoming client meeting. Be sure to highlight the key milestones and deliverables.',
        completed: false,
    },
    {
        title: 'Review code for bug fixes',
        description: 'Check the latest pull request for the mobile app. Focus on the bug fix for the login issue and ensure there are no conflicts.',
        completed: true,
    },
    {
        title: 'Prepare team presentation',
        description: 'Create the PowerPoint presentation for next week’s team meeting. Make sure to include updates on current projects and key performance metrics.',
        completed: false,
    },
    {
        title: 'Update website homepage',
        description: 'Redesign the homepage to feature the new product launch. Ensure the new branding is integrated and test the page for mobile responsiveness.',
        completed: false,
    },
    {
        title: 'Send out weekly newsletter',
        description: 'Write and schedule the weekly newsletter to be sent to all subscribers. Include a summary of recent blog posts and upcoming events.',
        completed: true,
    },
    {
        title: 'Follow up with client on project status',
        description: 'Email the client to check on the status of their feedback on the design mockups. Offer assistance if needed and clarify the project timeline.',
        completed: false,
    },
    {
        title: 'Organize office supplies',
        description: 'Inventory office supplies and reorder necessary items, such as pens, paper, and printer ink. Also, check the stock of snacks in the break room.',
        completed: false,
    },
    {
        title: 'Schedule performance review meetings',
        description: 'Arrange one-on-one meetings with team members for their upcoming performance reviews. Send out calendar invites and prepare feedback notes.',
        completed: true,
    },
    {
        title: 'Plan next marketing campaign',
        description: 'Brainstorm and plan the next digital marketing campaign. Focus on targeting new leads via social media ads and email marketing.',
        completed: false,
    },
    {
        title: 'Submit expense report',
        description: 'Complete and submit the monthly expense report for reimbursement. Make sure to include receipts for all work-related expenses.',
        completed: true,
    },
];

const NoticeboardData: NoticeBoardProps[] = [
    {
        title: 'Complete quarterly financial report afd sadsfafsaf fdsaf ff fdfafs fsaffdsa  sfds ff sff sf ',
        createdAt: '11 May 2024',
    },
    {
        title: 'Fix website login issue',
        createdAt: '05 May 2024',
    },
    {
        title: 'Prepare client pitch deck',
        createdAt: '10 May 2024',
    },
    {
        title: 'Update company product catalog',
        createdAt: '03 May 2024',
    },
    {
        title: 'Organize team-building event',
        createdAt: '02 May 2024',
    },
    {
        title: 'Schedule server maintenance',
        createdAt: '30 Apr 2024',
    },
    {
        title: 'Review employee performance reports',
        createdAt: '28 Apr 2024',
    },
    {
        title: 'Write company blog post',
        createdAt: '15 Apr 2024',
    },
    {
        title: 'Design marketing campaign materials',
        createdAt: '12 Apr 2024',
    },
    {
        title: 'Conduct customer satisfaction survey',
        createdAt: '10 Apr 2024',
    },
];

const LeaveRequestData: LeaveRequestCardProps[] = [
    {
        image: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg',
        name: 'John Doe',
        appliedOn: '15 Jan 2024',
        startDate: '20 Jan 2024',
        endDate: '22 Jan 2024',
        leaveType: 'emergency',
        accepted: true,
        candidateType: 'teacher',
    },
    {
        image: 'https://example.com/images/jane_smith.jpg',
        name: 'Jane Smith',
        appliedOn: '10 Jan 2024',
        startDate: '14 Jan 2024',
        endDate: '16 Jan 2024',
        leaveType: 'holiday',
        accepted: true,
        candidateType: 'student',
    },
    {
        image: 'https://example.com/images/michael_jones.jpg',
        name: 'Michael Jones',
        appliedOn: '12 Jan 2024',
        startDate: '18 Jan 2024',
        endDate: '20 Jan 2024',
        leaveType: 'casual',
        accepted: false,
        candidateType: 'teacher',
    },
    {
        image: 'https://example.com/images/anna_williams.jpg',
        name: 'Anna Williams',
        appliedOn: '14 Jan 2024',
        startDate: '19 Jan 2024',
        endDate: '21 Jan 2024',
        leaveType: 'family',
        accepted: true,
        candidateType: 'student',
    },
    {
        image: 'https://example.com/images/robert_brown.jpg',
        name: 'Robert Brown',
        appliedOn: '10 Jan 2024',
        startDate: '15 Jan 2024',
        endDate: '17 Jan 2024',
        leaveType: 'emergency',
        accepted: false,
        candidateType: 'teacher',
    },
    {
        image: 'https://example.com/images/susan_davis.jpg',
        name: 'Susan Davis',
        appliedOn: '8 Jan 2024',
        startDate: '13 Jan 2024',
        endDate: '15 Jan 2024',
        leaveType: 'holiday',
        accepted: true,
        candidateType: 'student',
    },
    {
        image: 'https://example.com/images/mark_taylor.jpg',
        name: 'Mark Taylor',
        appliedOn: '11 Jan 2024',
        startDate: '16 Jan 2024',
        endDate: '18 Jan 2024',
        leaveType: 'casual',
        accepted: true,
        candidateType: 'teacher',
    },
    {
        image: 'https://example.com/images/lisa_martin.jpg',
        name: 'Lisa Martin',
        appliedOn: '9 Jan 2024',
        startDate: '14 Jan 2024',
        endDate: '16 Jan 2024',
        leaveType: 'family',
        accepted: true,
        candidateType: 'student',
    }
];






export const Dashboard = () => {
    return (
        <div className={'gap-2 p-2 flex flex-col bg-[#f8fafd]'}>

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

            {/*Chart and simple calender*/}
            <div className={'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12'}>
                <div className={'sm:col-span-2 md:col-span-1 lg:col-span-3 h-[400px] rounded-md bg-white'}>
                    <CountChart/>
                </div>

                <div className={'sm:col-span-2 md:col-span-2 lg:col-span-6 h-[400px] rounded-md bg-white'}>
                    <AttendanceChart/>
                </div>

                <div className={'hidden lg:block items-center  lg:col-span-3 rounded-md bg-white'}>
                    <SimpleCalender/>
                </div>
            </div>

            {/*Finance Chart*/}
            <div className={'grid grid-cols-1 lg:grid-cols-4 gap-2'}>
                <div className={'col-span-1 lg:col-span-3 h-[400px] rounded-md bg-white shadow-xs'}>
                    <FinanceChart/>
                </div>
                <div className={'hidden lg:block lg:col-span-1 py-4 px-2 gap-2 h-[400px] bg-white rounded-md shadow-xs'}>
                    <div className={'h-full flex flex-col gap-2 px-2'}>
                        <div>
                            <h1 className={'font-semibold text-lg px-1'}>Quick Link</h1>
                        </div>
                        <div className={'grid lg:grid-cols-1 xl:grid-cols-2 h-full gap-2'}>
                            {
                                QuickLinksData.map((each: {
                                    icon: string;
                                    title: string;
                                    bgColor: string;
                                    fgColor: string;
                                    ringColor: string
                                }) => (
                                    <QuickLinkCard
                                        icon={each.icon}
                                        title={each.title}
                                        bgColor={each.bgColor}
                                        fgColor={each.fgColor}
                                        ringColor={each.ringColor}
                                    />
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>

            {/*TodoCard, Noticeboard and leave request*/}
            <div className={'grid grid-cols-3 gap-2'}>


                <div className={'col-span-3 lg:col-span-1 h-[400px] bg-white shadow-xs'}>
                    <div className={'flex flex-col h-full p-4 gap-4'}>
                        <div className={'flex items-center justify-between'}>
                            <h1 className={'font-semibold text-lg'}>Todo</h1>
                            <p className={'text-[var(--tw-text-hover)]'}>Add todo</p>
                        </div>
                        <div
                            className={'flex flex-col space-y-4 overflow-y-auto scrollbar'}>
                            {
                                TodoData.map((each: { title: string; description: string; completed: boolean }) => (
                                    <TodoCard title={each.title} description={each.description}
                                              completed={each.completed}/>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className={'col-span-3 lg:col-span-1 h-[400px] bg-white shadow-xs'}>
                    <div className={'flex flex-col h-full p-4 gap-4'}>
                        <div className={'flex items-center justify-between'}>
                            <h1 className={'font-semibold text-lg'}>Notice board</h1>
                            <p className={'text-[var(--tw-text-hover)]'}>View all</p>
                        </div>
                        <div
                            className={'flex flex-col space-y-4 overflow-y-auto scrollbar'}>
                            {
                                NoticeboardData.map((each: {
                                    title: string;
                                    createdAt: string;
                                }) => (
                                    <NoticeBoardCard
                                        title={each.title}
                                        createdAt={each.createdAt}
                                    />
                                ))

                            }
                        </div>
                    </div>
                </div>

                <div className={'col-span-3 lg:col-span-1 h-[400px] bg-white shadow-xs'}>
                    <div className={'flex flex-col h-full p-4 gap-4'}>
                        <div className={'flex items-center justify-between'}>
                            <h1 className={'font-semibold text-lg'}>Leave request</h1>
                            <p className={'text-[var(--tw-text-hover)]'}>View all</p>
                        </div>
                        <div
                            className={'flex flex-col space-y-4 overflow-y-auto scrollbar'}>
                            {
                                LeaveRequestData.map((each: LeaveRequestCardProps) => (
                                    <LeaveRequestCard
                                        image={each.image}
                                        name={each.name}
                                        appliedOn={each.appliedOn}
                                        startDate={each.startDate}
                                        endDate={each.endDate}
                                        leaveType={each.leaveType}
                                        accepted={each.accepted}
                                        candidateType={each.candidateType}
                                    />
                                ))
                            }

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};