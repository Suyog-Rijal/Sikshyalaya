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
import {tAddStudentSchema} from "@/schema/AddStudent.ts";
import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {Heading} from "@/components/Forms/Heading.tsx";
import {FormContent} from "@/components/Forms/FormContent.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {addressInfo, parentInfo, personalInfo, previousSchoolInfo, transportInfo} from "@/utils/addStudentData.ts";
import AxiosInstance from "@/auth/AxiosInstance.ts";

const PersonalInfo = () => {
    const form = useFormContext();

    return (
        <FormContainer>
            <Heading title="Personal Information"/>
            <FormContent>
                {personalInfo.map((each, index) => (
                    each.type === 'select' ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{each.label}</FormLabel>
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
                    ) : (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{each.label}</FormLabel>
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

const ParentInfo = () => {
    const form = useFormContext();
    return (
        <FormContainer>
            <Heading title="Parent Information"/>
            {parentInfo.map((info, index) => (
                <div key={index} className="space-y-6">
                    {/* Father Information */}
                    {info.fatherInfo && (
                        <div>
                            <h2 className="text-lg px-4 font-semibold">Father Information</h2>
                            <FormContent>
                                {info.fatherInfo.fields.map((field, i) => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={field.name}
                                        render={({field: formField}) => (
                                            <FormItem>
                                                <FormLabel>{field.label}</FormLabel>
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
                            <FormContent>
                                {info.motherInfo.fields.map((field, i) => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={field.name}
                                        render={({field: formField}) => (
                                            <FormItem>
                                                <FormLabel>{field.label}</FormLabel>
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

                    {/* Guardian Information */}
                    {/*{info.guardianInfo && (*/}
                    {/*    <div>*/}
                    {/*        <h2 className="text-lg px-4 font-semibold">Guardian Information</h2>*/}
                    {/*        <FormContent>*/}
                    {/*            {info.guardianInfo.fields.map((field, i) => (*/}
                    {/*                <FormField*/}
                    {/*                    key={i}*/}
                    {/*                    control={form.control}*/}
                    {/*                    name={field.name}*/}
                    {/*                    render={({ field: formField }) => (*/}
                    {/*                        <FormItem>*/}
                    {/*                            <FormLabel>{field.label}</FormLabel>*/}
                    {/*                            <FormControl>*/}
                    {/*                                <Input type={field.type} {...formField} />*/}
                    {/*                            </FormControl>*/}
                    {/*                            <FormMessage />*/}
                    {/*                        </FormItem>*/}
                    {/*                    )}*/}
                    {/*                />*/}
                    {/*            ))}*/}
                    {/*        </FormContent>*/}
                    {/*    </div>*/}
                    {/*)}*/}
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{each.label}</FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                    render={({ field }) => (
                                        <FormItem className={'w-full'}>
                                            <FormLabel>{each.label}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl className={'w-full'}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select option" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        each?.options?.map((option, index) => (
                                                            <SelectItem key={index} value={`${option.id}`}>{option.value}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                            :
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{each.label}</FormLabel>
                                        <FormControl>
                                            <Input type={each.type} {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{each.label}</FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} />
                                    </FormControl>
                                    <FormMessage />
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
        defaultValues: {
            personal_info: {
                first_name: '',
                last_name: '',
                date_of_birth: new Date(),
                gender: '1',
                account_status: 'A',
                blood_group: '',
                personal_email: '',
                phone_number: '',
                admission_date: new Date(),
                current_address: '',
                permanent_address: '',
                transportation: 'SB',
                pickup_address: '',
                profile_picture: '',
                previous_school: '',
                previous_school_address: '',
            },
        },
    });

    const onSubmit = (data: tAddStudentSchema) => {
        console.log(data);
        AxiosInstance.post('api/academic/enrollment/', data)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
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
