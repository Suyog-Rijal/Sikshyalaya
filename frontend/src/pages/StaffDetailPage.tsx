import {PageHeader} from "@/components/ListPage/PageHeader.tsx";
import {Lock, EyeOffIcon, EyeIcon, Pencil} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {CustomStatusBadge} from "@/components/ListPage/CustomStatusBadge.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ReactNode, useEffect, useState} from "react";
import AxiosInstance from "@/auth/AxiosInstance.ts";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";


const TagCard = ({value}: { value: string }) => {
    return (
        <div className="bg-purple-100 text-purple-500 px-2 py-0.5 border border-purple-500 rounded-full">
            <p className="text-gray-600 text-xs">{value}</p>
        </div>
    )
}

const Container = ({children}: { children: ReactNode }) => {
    return (
        <div className="p-4 shadow rounded-md space-y-4 bg-white">
            {children}
        </div>
    )
}

const Heading = ({children}: { children: ReactNode }) => {
    return (
        <h3 className="text-lg font-medium mb-3">{children}</h3>
    )
}

const Content = ({children, className}: { children: ReactNode, className?: string }) => {
    return (
        <div className={`grid gap-6 ${className ? className : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {children}
        </div>
    )
}

const ContentItems = ({label, value}: { label: string, value: string }) => {
    return (
        <div className="flex flex-col">
            <span className="text-gray-700 text-sm font-medium">{label}</span>
            <span className="text-gray-600 text-sm">{value}</span>
        </div>
    )
}


export function StaffDetailPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [staff, setStaff] = useState<{
        id: string;
        profile_picture: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        gender: string;
        date_of_birth: string;
        permanent_address: string;
        current_address: string;
        marital_status: string;
        blood_group: string;
        account_status: 'A' | 'I' | 'D';
        personal_email: string;
        email: string;
        password: string;
        date_of_joining: string;
        note: string;
        staff_type: string;
        employment_type: string;
        salary: string;
        bank_name: string;
        account_holder: string;
        account_number: string;
        transportation: string;
        pickup_address: string;
        social_facebook: string | null;
        social_instagram: string | null;
        social_linkedin: string | null;
        social_github: string | null;
        qualification: string;
        experience: number;
        previous_workplace: string;
        previous_workplace_address: string;
        previous_workplace_phone_number: string;
        created_at: string;
        updated_at: string;
        position_detail: Record<string, string>;
    }>({
        id: "",
        profile_picture: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        gender: "",
        date_of_birth: "",
        permanent_address: "",
        current_address: "",
        marital_status: "",
        blood_group: "",
        account_status: 'I',
        personal_email: "",
        email: "",
        password: "",
        date_of_joining: "",
        note: "",
        staff_type: "",
        employment_type: "",
        salary: "",
        bank_name: "",
        account_holder: "",
        account_number: "",
        transportation: "",
        pickup_address: "",
        social_facebook: "No info",
        social_instagram: "No info",
        social_linkedin: "No info",
        social_github: "No info",
        qualification: "",
        experience: 0,
        previous_workplace: "",
        previous_workplace_address: "",
        previous_workplace_phone_number: "",
        created_at: "",
        updated_at: "",
        position_detail: {},
    });
    const [showLoginDetails, setShowLoginDetails] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        AxiosInstance.get('/api/staff/' + params.id + '/')
            .then((response) => {
                setStaff(response.data);
            })
            .catch((error) => {
                console.log(error)
                toast.error(error.message);
            })
    }, [params.id]);

    const ProfileCard = () => {
        return (
            <div className={'col-span-full'}>
                <div className="bg-white rounded-md shadow">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={staff?.profile_picture}
                                alt="Profile picture"
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className={'space-y-2'}>
                                <h2 className="text-xl font-medium">{staff?.first_name} {staff?.last_name}</h2>
                                <CustomStatusBadge variant={staff?.account_status || 'I'}>
                                    {
                                        staff?.account_status === 'A' ? 'Active'
                                            : staff?.account_status === 'I' ? 'Inactive'
                                                : staff?.account_status === 'D' ? 'Disabled'
                                                    : 'Unknown'
                                    }
                                </CustomStatusBadge>
                                <p className="text-gray-600 text-sm">Joined on: {staff?.date_of_joining}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-medium mb-3">Academic Information</h3>

                        {
                            staff.staff_type === 'T' ?
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700 text-sm font-medium">Class & Section</span>
                                        <span className="text-gray-600 text-sm flex gap-2 flex-wrap justify-end">
                                            <TagCard value={staff.position_detail?.school_class}></TagCard>
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-700 font-medium text-sm">Subject</span>
                                        <span className="text-gray-600 text-sm flex gap-2 flex-wrap justify-end">
                                            {/*@ts-expect-error: Object is possibly 'null'.*/}
                                            <TagCard value={staff.position_detail?.subject?.name || 'unknown'}></TagCard>
                                        </span>
                                    </div>
                                </div>
                                :
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700 text-sm font-medium">Department</span>
                                        <span className="text-gray-600 text-sm flex gap-2 flex-wrap justify-end">
                                            <TagCard value={staff.position_detail?.department}></TagCard>
                                        </span>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    const BasicInfo = () => {
        const basicInfoData = [
            {
                label: 'Full name',
                value: staff?.first_name + ' ' + staff?.last_name
            },
            {
                label: 'Gender',
                value: staff?.gender
            },
            {
                label: 'Date of Birth',
                value: staff?.date_of_birth
            },
            {
                label: 'Permanent Address',
                value: staff?.permanent_address
            },
            {
                label: 'Current Address',
                value: staff?.current_address
            },
            {
                label: 'Marital Status',
                value: staff?.marital_status
            },
            {
                label: 'Blood Group',
                value: staff?.blood_group
            },
            {
                label: 'Personal Email',
                value: staff?.personal_email
            },
            {
                label: 'Phone Number',
                value: staff?.phone_number
            },
        ]
        return (
            <div className={'p-4 bg-white rounded-md  shadow'}>
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>

                <div className="space-y-4">

                    {
                        basicInfoData.map((item, index) => {
                            return (
                                <div key={index} className="flex justify-between">
                                    <span className="text-gray-700 text-sm font-medium">{item.label}</span>
                                    <span className="text-gray-600 text-sm">{item.value}</span>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        )
    }

    const AcademicDetail = () => {
        const social = [
            {
                label: 'Facebook',
                value: staff.social_facebook
            },
            {
                label: 'Instagram',
                value: staff.social_instagram
            },
            {
                label: 'LinkedIn',
                value: staff.social_linkedin
            },
            {
                label: 'Github',
                value: staff.social_github
            }
        ]
        return (
            <div className={'space-y-4'}>
                <Container>
                    <Heading>Joining Detail</Heading>
                    <Content>
                        <ContentItems label="Date of Joining" value={staff?.date_of_joining}/>
                        <ContentItems label="Role"
                                      value={staff.staff_type === 'T' ? 'Teacher' : staff.staff_type === 'M' ? 'Management' : 'Unknown'}/>
                        <ContentItems label="Qualification" value={staff.qualification}/>
                        <ContentItems label="Experience" value={`${staff.experience} years`}/>
                        <ContentItems label="Academic Email" value={staff.email}/>
                        <ContentItems label="Previous School" value={staff.previous_workplace}/>
                        <ContentItems label="Previous School Address" value={staff.previous_workplace_address}/>
                        <ContentItems label="Previous School Phone" value={staff.previous_workplace_phone_number}/>
                    </Content>
                </Container>

                <Container>
                    <Heading>Bank Detail</Heading>
                    <Content>
                        <ContentItems label="Bank Name" value={staff.bank_name}/>
                        <ContentItems label="Account Holder Name" value={staff.account_holder}/>
                        <ContentItems label="Account Number" value={staff.account_number}/>
                    </Content>
                </Container>

                <Container>
                    <Heading>Social Media Detail</Heading>
                    <Content className={'grid-cols-1 lg:grid-cols-2'}>
                        {
                            social.map((item, index) => {
                                return (
                                    <ContentItems key={index} label={item.label} value={`${item.value}`}/>
                                )
                            })
                        }
                    </Content>
                </Container>

                <Container>
                    <Heading>Transportation Detail</Heading>
                    <Content className={'grid-cols-1 lg:grid-cols-2'}>
                        <ContentItems label="Transportation Mode" value={staff.transportation}/>
                        <ContentItems label="Pickup Address" value={staff.pickup_address}/>
                    </Content>
                </Container>
            </div>
        )
    }

    return (
        <div className={'p-4 flex flex-col gap-2'}>
            <div>
                <PageHeader
                    title="Staffs"
                    breadcrumbs={[
                        {label: "Dashboard", href: "/"},
                        {label: "Staff", href: "/staff/list/"},
                        {label: "Staff Detail", href: "/staff/detail/" + params.id},
                    ]}
                    primaryAction={{
                        label: "Edit Detail",
                        onClick: () => navigate('/staff/add/'),
                        icon: <Pencil className="h-4 w-4"/>,
                    }}
                    secondaryActions={{
                        label: "Login Details",
                        onClick: () => setShowLoginDetails(true),
                        icon: <Lock className="h-4 w-4"/>,
                    }}
                />

                <Dialog open={showLoginDetails} onOpenChange={setShowLoginDetails}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Login Details of {staff.first_name} {staff.last_name}
                            </DialogTitle>
                            <DialogDescription>
                                Below are the login credentials for this staff member. Please ensure this information is kept secure.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="flex items-center">
                                    <Input id="email" value={staff.email} readOnly className="flex-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={staff.password}
                                        readOnly
                                        className="flex-1"
                                    />
                                    <Button className={'cursor-pointer'} type="button" variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="outline" className={'cursor-pointer'} onClick={() => setShowLoginDetails(false)}>
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>

            <div className={'grid grid-cols-10 gap-4'}>
                <div className={'col-span-10 lg:col-span-3 space-y-4 flex flex-col'}>
                    <ProfileCard/>
                    <BasicInfo/>

                    <Dialog>
                        <DialogTrigger className="bg-white shadow hover:shadow-md transition-shadow rounded-md p-4 space-y-2 cursor-pointer border border-gray-100 w-full">
                            <div className="flex items-start">
                                <div className="w-full">
                                    <h1 className="text-lg text-left font-medium">Note</h1>
                                    <p className="text-gray-600 text-sm text-justify line-clamp-2">{staff.note}</p>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    Note for {staff.first_name} {staff.last_name}
                                </DialogTitle>
                                <DialogDescription className="pt-2 text-sm text-gray-500">
                                    Staff member notes and additional information
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-100">
                                <p className="text-gray-800 text-justify leading-relaxed whitespace-pre-wrap">
                                    {staff.note || "No notes available for this staff member."}
                                </p>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        document.querySelector('[data-state="open"]')?.dispatchEvent(new Event("close", { bubbles: true }))
                                    }
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                </div>
                <div className={'col-span-10 lg:col-span-7'}>
                    <Tabs defaultValue="academicDetail" className="col-span-full rounded-lg h-full">
                        <TabsList className={'space-x-4 bg-none bg-transparent'}>
                            <TabsTrigger className={'focus:border-b-purple-500 rounded-none shadow-white'}
                                         value="academicDetail">Profile</TabsTrigger>
                            {
                                staff.staff_type === 'T' ?
                                    <TabsTrigger className={'focus:border-b-purple-500 rounded-none shadow-white'}
                                                 value="routine">Routine</TabsTrigger>
                                    :
                                    null
                            }
                            <TabsTrigger className={'focus:border-b-purple-500 rounded-none shadow-white'}
                                         value="leaveAndAttendance">Leave & Attendance</TabsTrigger>
                            <TabsTrigger className={'focus:border-b-purple-500 rounded-none shadow-white'}
                                         value="salary">Salary</TabsTrigger>
                        </TabsList>
                        <TabsContent value="academicDetail"><AcademicDetail></AcademicDetail></TabsContent>
                    </Tabs>

                </div>
            </div>
        </div>
    );
}