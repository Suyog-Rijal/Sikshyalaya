import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {Heading} from "@/components/Forms/Heading.tsx";
import {FormContentContainer} from "@/components/Forms/FormContentContainer.tsx";
import {addressInfo, parentInfo, personalInfo, previousSchoolInfo, transportInfo} from "@/utils/addStudentData.ts";
import {CustomInput} from "@/components/Forms/CustomInput.tsx";
import * as z from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DevTool} from "@hookform/devtools";
import {CustomDropdown} from "@/components/Forms/CustomDropdown.tsx";
import {CustomFileInput} from "@/components/Forms/CustomFileInput.tsx";
import {CustomSingleFileInputV1} from "@/components/Forms/CustomSingleFileInputV1.tsx";
import {CustomButton} from "@/components/Forms/CustomButton.tsx";


const addStudentSchema = z.object({
    accountStatus: z.number(),
    files: z.array(z.object({
        name: z.string(),
        size: z.number(),
    })),
});
type tAddStudent = z.infer<typeof addStudentSchema>;


export const AddStudent = () => {
    const form = useForm<tAddStudent>({
        resolver: zodResolver(addStudentSchema),
        defaultValues: {
            accountStatus: 1,
            files: [],
        },
    });
    const {control, handleSubmit} = form;
    const onSubmit = (data: tAddStudent) => {
        console.log(data);
    }


    const PersonalInfo = () => {
        return (
            <FormContainer>
                <Heading label={'Personal Information'}></Heading>
                <div className={'px-4 pt-4'}>
                    <CustomSingleFileInputV1 className={'col-span-full'} name={'profilePicture'}/>
                </div>
                <FormContentContainer>
                    {
                        personalInfo.map((each, index) => (
                            each.type === 'text' || each.type === 'date' ?
                                <CustomInput name={each.name} label={each.label} type={each.type}
                                             required={each.required} key={index}/>
                                :
                                each.type === 'dropdown' ?
                                    <CustomDropdown name={each.name} label={each.label} required={each.required}
                                                    key={index} options={each?.options || []}/>
                                    :
                                    null

                        ))
                    }
                </FormContentContainer>
            </FormContainer>
        )
    }

    const ParentInfo = () => {
        const SubHeading = ({label}: { label: string }) => {
            return (
                <h2 className={'text-md p-4 font-semibold'}>{label}</h2>
            );
        };

        return (
            <FormContainer>
                <Heading label={'Parent Information'}/>
                {
                    parentInfo.map((parent, index) => (
                        <div key={index}>
                            {/* Father Information */}
                            <div className={'space-y-0'}>
                                <SubHeading label={parent.fatherInfo.heading}/>
                                <div className={'px-4'}>
                                    <CustomSingleFileInputV1 className={'col-span-full'} name={'fatherPicture'}/>
                                </div>
                                <FormContentContainer>
                                    {parent.fatherInfo.fields.map((field, fieldIndex) => (
                                        <CustomInput
                                            name={field.name}
                                            label={field.label}
                                            type={field.type}
                                            required={field.required}
                                            key={fieldIndex}
                                        />
                                    ))}
                                </FormContentContainer>
                            </div>

                            {/* Mother Information */}
                            <div className={'space-y-0'}>
                                <SubHeading label={parent.motherInfo.heading}/>
                                <div className={'px-4'}>
                                    <CustomSingleFileInputV1 className={'col-span-full'} name={'motherPicture'}/>
                                </div>
                                <FormContentContainer>
                                    {parent.motherInfo.fields.map((field, fieldIndex) => (
                                        <CustomInput
                                            name={field.name}
                                            label={field.label}
                                            type={field.type}
                                            required={field.required}
                                            key={fieldIndex}
                                        />
                                    ))}
                                </FormContentContainer>
                            </div>

                            {/* Guardian Information */}
                            <div className={'space-y-0'}>
                                <SubHeading label={parent.guardianInfo.heading}/>
                                <div className={'px-4'}>
                                    <CustomSingleFileInputV1 className={'col-span-full'} name={'guardianPicture'}/>
                                </div>
                                <FormContentContainer>
                                    {parent.guardianInfo.fields.map((field, fieldIndex) => (
                                        <CustomInput
                                            name={field.name}
                                            label={field.label}
                                            type={field.type}
                                            required={field.required}
                                            key={fieldIndex}
                                        />
                                    ))}
                                </FormContentContainer>
                            </div>
                        </div>
                    ))
                }
            </FormContainer>
        );
    };

    const AddressInfo = () => {
        return (
            <FormContainer>
                <Heading label={'Address Information'}></Heading>
                <FormContentContainer>
                    {
                        addressInfo.map((each, index) => (
                            <CustomInput name={each.name} label={each.label} type={each.type}
                                         required={each.required} key={index} className={'col-span-1 xl:col-span-2'}/>
                        ))
                    }
                </FormContentContainer>
            </FormContainer>
        )
    }

    const TransportInfo = () => {
        return (
            <FormContainer>
                <Heading label={'Transport Information'}></Heading>
                <FormContentContainer>
                    {
                        transportInfo.map((each, index) => (
                            each.type === 'text' ?
                                <CustomInput key={index} name={each.name} label={each.label} type={each.type}
                                             className={'col-span-1 xl:col-span-2'}></CustomInput>
                                :
                                each.type === 'dropdown' ?
                                    <CustomDropdown key={index} name={each.name} label={each.label}
                                                    options={each.options}
                                                    className={'col-span-1 xl:col-span-2'}></CustomDropdown>
                                    :
                                    null
                        ))
                    }
                </FormContentContainer>
            </FormContainer>
        )
    }

    const PreviousSchoolInfo = () => {
        return (
            <FormContainer>
                <Heading label={'Previous School Information'}></Heading>
                <FormContentContainer>
                    {
                        previousSchoolInfo.map((each, index) => (
                            <CustomInput name={each.name} label={each.label} type={each.type}
                                         required={each.required} key={index} className={'col-span-1 xl:col-span-2'}/>
                        ))
                    }
                </FormContentContainer>
            </FormContainer>
        )
    }

    const DocumentInfo = () => {
        return (
            <FormContainer>
                <Heading label={'Document Information'}></Heading>
                <FormContentContainer>
                    <CustomFileInput name={'files'}
                                     label={'Upload Documents'}
                                     maxFiles={3}
                                     multiple={true}
                                     maxSize={2}
                                     accept='.pdf,.png'
                                     className={'col-span-full'}
                                     required={true}/>
                </FormContentContainer>
            </FormContainer>
        )
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={'p-4 space-y-4 bg-gray-50'}>
                <PersonalInfo/>
                <ParentInfo/>
                <AddressInfo/>
                <TransportInfo/>
                <PreviousSchoolInfo/>
                <DocumentInfo/>
                <div className={'flex gap-4 w-1/3 ml-auto justify-end px-4'}>
                    <CustomButton variant={'neutral'} className={'w-full'} size={'md'}>Cancel</CustomButton>
                    <CustomButton type={'submit'} variant={'primary'} className={'w-full'} size={'md'}>Submit</CustomButton>
                </div>
            </form>
            <DevTool control={control}/>
        </FormProvider>
    )
};