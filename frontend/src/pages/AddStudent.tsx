import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm, useFormContext, FormProvider} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {addStudentSchema, tAddStudentSchema} from "@/schema/AddStudent.ts";
import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {Heading} from "@/components/Forms/Heading.tsx";
import {FormContent} from "@/components/Forms/FormContent.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {addressInfo, parentInfo, personalInfo, previousSchoolInfo, transportInfo} from "@/utils/addStudentData.ts";
import AxiosInstance from "@/auth/AxiosInstance.ts";
import {Dropzone} from "@/components/ui/dropzone.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {dateFormater, removeEmptyFields} from "@/utils/cleanData.ts";
import {DatePicker} from "@/components/ui/date-picker.tsx";
import { toast } from "sonner"



const PersonalInfo = () => {
    const form = useFormContext();

    return (
        <FormContainer>
            <Heading title="Personal Information"/>
            <div className={'mx-4 mt-4'}>
                <Dropzone name={'student_info.profile_picture'}/>
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
                                    render={({ field, fieldState: { error } }) => (
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
    );
};

const ParentInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title="Parent Information"/>
            {parentInfo.map((info, index) => (
                <div key={index} className="space-y-6 mt-4">
                    {/* Father Information */}
                    {info.fatherInfo && (
                        <div>
                            <h2 className="text-lg px-4 font-semibold">Father Information</h2>
                            <div className={'mx-4 mt-4'}>
                                <Dropzone name={'father_info.profile_picture'}/>
                            </div>
                            <FormContent>
                                {info.fatherInfo.fields.map((field, i) => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={field.name}
                                        render={({field: formField}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field.label}{field.required &&
                                                    <span className="-ml-2 text-red-500">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type={field.type} {...formField} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </FormContent>
                        </div>
                    )}

                    {/* Mother Information */}
                    {info.motherInfo && (
                        <div>
                            <h2 className="text-lg px-4 font-semibold">Mother Information</h2>
                            <div className={'mx-4 mt-4'}>
                                <Dropzone name={'mother_info.profile_picture'}/>
                            </div>
                            <FormContent>
                                {info.motherInfo.fields.map((field, i) => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={field.name}
                                        render={({field: formField}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field.label}{field.required &&
                                                    <span className="-ml-2 text-red-500">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type={field.type} {...formField} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </FormContent>
                        </div>
                    )}

                    {info.guardianInfo && (
                        <div>
                            <h2 className="text-lg px-4 font-semibold">Guardian Information</h2>
                            <div className={'mx-4 mt-4'}>
                                <Dropzone name={'guardian_info.profile_picture'}/>
                            </div>
                            <FormContent>
                                {info.guardianInfo.fields.map((field, i) => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={field.name}
                                        render={({field: formField}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field.label}{field.required &&
                                                    <span className="-ml-2 text-red-500">*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type={field.type} {...formField} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </FormContent>
                        </div>
                    )}
                </div>
            ))}
        </FormContainer>
    )
}

const AddressInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title={'Address Information'}></Heading>
            <FormContent>
                {
                    addressInfo.map((each, index) => (
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

const PreviousSchool = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title={'Previous School Information'}></Heading>
            <FormContent>
                {
                    previousSchoolInfo.map((each, index) => (
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

export function AddStudent() {
    const form = useForm<tAddStudentSchema>({
        resolver: zodResolver(addStudentSchema),
        defaultValues: {
            student_info: {
                first_name: '',
                last_name: '',
                date_of_birth: undefined,
                gender: undefined,
                account_status: 'A',
                blood_group: '',
                personal_email: '',
                phone_number: '',
                current_address: '',
                permanent_address: '',
                transportation: undefined,
                pickup_address: '',
                previous_school: '',
                previous_school_address: '',
            },

            enrollment_info: {
                enrollment_date: new Date(),
                school_class: '',
                section: '',
                house: '',

            },

            father_info: {
                full_name: '',
                phone_number: '',
                email: '',
                occupation: '',
            },

            mother_info: {
                full_name: '',
                phone_number: '',
                email: '',
                occupation: '',
            },

            guardian_info: {
                full_name: '',
                guardian_relation: '',
                phone_number: '',
                email: '',
                occupation: '',
                address: '',
            },

        }
    });

    const onSubmit = (data: tAddStudentSchema) => {
        const cleanedData = {
            ...data,
            enrollment_info: dateFormater(data.enrollment_info),
            student_info: dateFormater(data.student_info),
            father_info: removeEmptyFields(data.father_info),
            mother_info: removeEmptyFields(data.mother_info),
            guardian_info: removeEmptyFields(data.guardian_info)
        };
        console.log(cleanedData);
        AxiosInstance.post('api/academic/enrollment/', cleanedData)
            .then((res) => {
                toast.success('Student enrolled successfully');
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    };

    return (
        <FormProvider {...form}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-gray-50">
                    <PersonalInfo/>
                    <ParentInfo/>
                    <AddressInfo/>
                    <TransportInfo/>
                    <PreviousSchool/>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </FormProvider>
    );
}
