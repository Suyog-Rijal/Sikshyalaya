import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ControllerRenderProps, FieldValues, FormProvider, useForm, useFormContext} from "react-hook-form";
import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {Heading} from "@/components/Forms/Heading.tsx";
import {Dropzone} from "@/components/ui/dropzone.tsx";
import {FormContent} from "@/components/Forms/FormContent.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {DatePicker} from "@/components/ui/date-picker.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    bankInfo, otherInfoManagement,
    otherInfoTeaching,
    payrollInfo, personalInfo, socialMediaInfo, transportInfo,
} from "@/utils/addStaffData.ts";
import {addStaffSchema, tAddStaffSchema} from "@/schema/AddStaff.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import AxiosInstance from "@/auth/AxiosInstance.ts";
import {toast} from "sonner";
import {dateFormater} from "@/utils/cleanData.ts";


const PersonalInfo = () => {
    const form = useFormContext();

    return (
        <FormContainer>
            <Heading title="Personal Information"/>
            <div className={'mx-4 mt-4'}>
                <Dropzone name={'staff_info.profile_picture'}/>
            </div>
            <FormContent>
                {personalInfo.map((each, index) => (
                    each.type === 'select' ? (
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <Select onValueChange={field.onChange}
                                                value={field.value}>
                                            <FormControl className={'w-full'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={each?.placeholder || 'Select an option'}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    each?.options?.map((option: { id: number | string, value: string }) => (
                                                        <SelectItem key={option.id} value={`${option.id}`}>
                                                            {option.value}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ) :
                        each.type === 'date' ? (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field, fieldState: {error}}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}
                                                {each.required && <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={!!error}
                                                />
                                            </FormControl>
                                            <FormMessage>{error?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            )
                            :
                            (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}{each.required &&
                                                <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input type={each.type} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                ))}
            </FormContent>
        </FormContainer>
    );
};

const TeacherOtherInfo = () => {
    const form = useFormContext();
    const [apiData, setApiData] = useState<{
        staff: {
            id: string;
            name: string;
            subjects: {
                id: string;
                name: string;
            }[];
        }[];
        departments: {
            id: string;
            name: string;
        }[];
    }>({
        staff: [],
        departments: []
    });

    const [teachingData, setTeachingData] = useState(otherInfoTeaching);

    useEffect(() => {
        try {
            form.setValue('managementStaff_info.department', undefined)
        } catch (e) {
            console.log(e)
        }
        AxiosInstance.get('/api/academic/add-staff/')
            .then((res) => {
                setApiData({
                    staff: res.data?.staff || [],
                    departments: res.data?.departments || []
                });

                setTeachingData((prev) => prev.map((item) => {
                    if (item.name === 'teacher_info.school_class') {
                        return {
                            ...item,
                            options: res.data?.staff?.map((each: { id: string, name: string }) => ({
                                id: each.id,
                                value: each.name
                            }))
                        };
                    }
                    return item;
                }));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    }, []);

    const handleSelectChange = <T extends FieldValues>(field: ControllerRenderProps<T>, value: string) => {
        if (field.name === 'teacher_info.school_class') {
            form.setValue('teacher_info.subject', undefined)
            const selectedClass = apiData.staff.find((each) => each.id === value); // Use apiData.staff here
            const subjectList = selectedClass?.subjects || [];

            if (selectedClass) {
                setTeachingData((prev) => prev.map((item) => {
                    if (item.name === 'teacher_info.subject') {
                        return {
                            ...item,
                            options: subjectList.map((each) => ({
                                id: each.id,
                                value: each.name
                            })),
                            placeholder: item?.placeholder || 'Select subject'
                        };
                    }
                    return item;
                }));
            }
        }
    };

    return (
        <FormContainer>
            <Heading title="Teacher Information"/>
            <FormContent>
                {teachingData.map((each, index) => (
                    each.type === 'select' ? (
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <Select onValueChange={(value) => {
                                            field.onChange(value);
                                            handleSelectChange(field, value);
                                        }}
                                                defaultValue={field.value}>
                                            <FormControl className={'w-full'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={each?.placeholder || 'Select an option'}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    each?.options?.map((option: { id: number | string, value: string }) => (
                                                        <SelectItem key={option.id} value={`${option.id}`}>
                                                            {option.value}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ) :
                        each.type === 'date' ? (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field, fieldState: {error}}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}
                                                {each.required && <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={!!error}
                                                />
                                            </FormControl>
                                            <FormMessage>{error?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            )
                            :
                            (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}{each.required &&
                                                <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input type={each.type} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                ))}
            </FormContent>
        </FormContainer>
    )
}

const ManagementOtherInfo = () => {
    const form = useFormContext();

    const [apiData, setApiData] = useState<{
        staff: {
            id: string;
            name: string;
            subjects: {
                id: string;
                name: string;
            }[];
        }[];
        departments: {
            id: string;
            name: string;
        }[];
    }>({
        staff: [],
        departments: []
    });

    const [managementData, setManagementData] = useState(otherInfoManagement);

    useEffect(() => {
        try {
            form.setValue('teacher_info.school_class', undefined)
            form.setValue('teacher_info.subject', undefined)

        } catch (e) {
            console.log(e)
        }
        AxiosInstance.get('/api/academic/add-staff/')
            .then((res) => {
                // Set both staff and departments
                setApiData({
                    staff: res.data?.staff || [],
                    departments: res.data?.departments || []
                });

                // Update managementData to include department options
                setManagementData((prev) => prev.map((item) => {
                    if (item.name === 'managementStaff_info.department') {
                        return {
                            ...item,
                            options: res.data?.departments?.map((each: { id: string, name: string }) => ({
                                id: each.id,
                                value: each.name
                            }))
                        };
                    }
                    return item;
                }));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    }, []);

    const handleSelectChange = <T extends FieldValues>(field: ControllerRenderProps<T>, value: string) => {
        if (field.name === 'managementStaff_info.department') {
            form.setValue('managementStaff_info.staff', undefined);
            const selectedDepartment = apiData.departments.find((each) => each.id === value); // Use apiData.departments here
            const staffList = selectedDepartment ? apiData.staff.filter((staff) => staff.id === selectedDepartment.id) : [];

            if (selectedDepartment) {
                setManagementData((prev) => prev.map((item) => {
                    if (item.name === 'managementStaff_info.staff') {
                        return {
                            ...item,
                            options: staffList.map((staff) => ({
                                id: staff.id,
                                value: staff.name
                            })),
                            placeholder: item?.placeholder || 'Select staff'
                        };
                    }
                    return item;
                }));
            }
        }
    };

    return (
        <FormContainer>
            <Heading title="Management Staff Information"/>
            <FormContent>
                {managementData.map((each, index) => (
                    each.type === 'select' ? (
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <Select onValueChange={(value) => {
                                            field.onChange(value);
                                            handleSelectChange(field, value);}}
                                                defaultValue={field.value}>
                                            <FormControl className={'w-full'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={each?.placeholder || 'Select an option'}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    each?.options?.map((option: { id: number | string, value: string }) => (
                                                        <SelectItem key={option.id} value={`${option.id}`}>
                                                            {option.value}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ) :
                        each.type === 'date' ? (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field, fieldState: {error}}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}
                                                {each.required && <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={!!error}
                                                />
                                            </FormControl>
                                            <FormMessage>{error?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            )
                            :
                            (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}{each.required &&
                                                <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input type={each.type} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                ))}
            </FormContent>
        </FormContainer>
    )
}

const PayrollInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title="Payroll Information"/>
            <FormContent>
                {payrollInfo.map((each, index) => (
                    (
                        each.type === 'select' ? (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <Select onValueChange={field.onChange}
                                                    value={field.value}>
                                                <FormControl className={'w-full'}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={each?.placeholder || 'Select an option'}/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        each?.options?.map((option: {
                                                            id: number | string,
                                                            value: string
                                                        }) => (
                                                            <SelectItem key={option.id} value={`${option.id}`}>
                                                                {option.value}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                            :
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            {each.label}{each.required &&
                                            <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type={each.type} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                    )
                ))}
            </FormContent>
        </FormContainer>
    )
}

const BankInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title="Bank Information"/>
            <FormContent>
                {bankInfo.map((each, index) => (
                    (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        {each.label}{each.required &&
                                        <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )
                ))}
            </FormContent>
        </FormContainer>
    )
}

const TransportInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title="Transportation Information"/>
            <FormContent>
                {
                    transportInfo.map((each, index) => (
                        each.type === 'select' ? (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={each.name}
                                    render={({field}) => (
                                        <FormItem className={'col-span-1 xl:col-span-2'}>
                                            <FormLabel>
                                                {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select option"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        each?.options?.map((option, index) => (
                                                            <SelectItem key={index}
                                                                        value={`${option.id}`}>{option.value}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                            :
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({field}) => (
                                    <FormItem className={'col-span-1 xl:col-span-2'}>
                                        <FormLabel>
                                            {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type={each.type} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                    ))
                }
            </FormContent>
        </FormContainer>
    )
}

const SocialMediaInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title={'Social Media Info'}></Heading>
            <FormContent>
                {
                    socialMediaInfo.map((each, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        {each.label}{each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    ))
                }
            </FormContent>
        </FormContainer>
    )
}


export function AddStaff() {
    const form = useForm<tAddStaffSchema>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            staff_info: {
                first_name: '',
                last_name: '',
                phone_number: '',
                gender: undefined,
                date_of_birth: undefined,
                permanent_address: '',
                current_address: '',
                marital_status: undefined,
                blood_group: undefined,
                account_status: 'A',
                personal_email: undefined,
                date_of_joining: undefined,
                qualification: '',
                experience: undefined,
                previous_workplace: '',
                previous_workplace_address: '',
                previous_workplace_phone_number: '',
                salary: 0,
                employment_type: 'FT',
                bank_name: '',
                account_holder: '',
                account_number: '',
                transportation: 'SB',
                pickup_address: '',
                social_facebook: '',
                social_instagram: '',
                social_linkedin: '',
                social_github: '',
            },
            // @ts-expect-error: Conditionally applied validation
            managementStaff_info: {
                department: '',
                pan_number: 0,
            },
            teacher_info: {
                school_class: '',
                subject: '',
            },
            staff_type: 'T',
        }
    })

    const onSubmit = (data: tAddStaffSchema) => {
        const cleaned_data = {
            ...data,
            staff_info: dateFormater(data.staff_info),
        };
        console.log(cleaned_data);
        AxiosInstance.post('/api/academic/add-staff/', cleaned_data)
            .then(() => {
                toast.success('Staff added successfully');
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    }

    return (
        <FormProvider {...form}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-[#fbfbfd]">
                    <PersonalInfo></PersonalInfo>
                    {
                        form.watch('staff_type') === 'T' ? <TeacherOtherInfo></TeacherOtherInfo> : <ManagementOtherInfo></ManagementOtherInfo>
                    }
                    <PayrollInfo></PayrollInfo>
                    <BankInfo></BankInfo>
                    <TransportInfo></TransportInfo>
                    <SocialMediaInfo></SocialMediaInfo>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </FormProvider>
    );
}