import {Heading} from "@/components/Forms/Heading.tsx";
import {FormContentContainer} from "@/components/Forms/FormContentContainer.tsx";
import {CustomInput} from "@/components/Forms/CustomInput.tsx";
import * as z from "zod";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DevTool} from "@hookform/devtools";
import {CustomDropdown} from "@/components/Forms/CustomDropdown.tsx";
import {CustomSingleFileInputV1} from "@/components/Forms/CustomSingleFileInputV1.tsx";
import {CustomButton} from "@/components/Forms/CustomButton.tsx";
import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {bankInfo, otherInfoManagement, otherInfoTeaching, personalInfo, transportInfo} from "@/utils/addStaffData.ts";
import {useState} from "react";
import {CustomTextarea} from "@/components/Forms/CustomTextarea.tsx";
import {CustomFileInput} from "@/components/Forms/CustomFileInput.tsx";

const addStaffSchema = z.object({
    staffType: z.number(),
    accountStatus: z.number(),
    files: z.array(z.object({
        name: z.string(),
        size: z.number(),
    })),
});
type tAddStaff = z.infer<typeof addStaffSchema>;


export const AddStaff = () => {
    const form = useForm<tAddStaff>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            staffType: 1,
            accountStatus: 1,
            files: [],
        },
    });
    const {control, handleSubmit} = form;
    const onSubmit = (data: tAddStaff) => {
        console.log(data);
    }
    const [showRoleInfo, setShowRoleInfo] = useState(true);


    const PersonalInfo = () => {
        const handleRoleChange = (selectedId: number) => {
            if (selectedId === 1 || selectedId === 3) {
                setShowRoleInfo(true);
            } else {
                setShowRoleInfo(false);
            }
        }
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
                                    <CustomDropdown
                                        onChange={each.name === 'staffType' ? (selectedId) => handleRoleChange(selectedId) : undefined}
                                        name={each.name}
                                        label={each.label}
                                        required={each.required}
                                        key={index}
                                        options={each?.options || []}/>
                                    :
                                    null

                        ))
                    }
                </FormContentContainer>
            </FormContainer>
        )
    }

    const OtherInfo = () => {
        const { getValues } = useFormContext();
        const staffType = getValues('staffType');
        const renderValues = staffType === 1 ? otherInfoTeaching : otherInfoManagement;

        return (
            showRoleInfo ?
                <FormContainer>
                    <Heading label={'Other Information'}></Heading>
                    <FormContentContainer>
                        {
                            renderValues.map((each, index) => (
                                each.type === 'text' || each.type === 'date' ?
                                    <CustomInput name={each.name} label={each.label} type={each.type}
                                                 required={each.required} key={index}/>
                                    :
                                    each.type === 'dropdown' ?
                                        <CustomDropdown name={each.name} label={each.label} required={each.required}
                                                        options={each?.options || []} key={index}/>
                                        :
                                        each.type === 'textarea' ?
                                            <CustomTextarea className={'col-span-full'} name={each.name} label={each.label} />
                                            :
                                            null
                            ))
                        }
                    </FormContentContainer>
                </FormContainer>
                :
                null
        )
    }

    const BankInfo = () => {
        return (
            <FormContainer>
                <Heading label={'Bank Account Detail'}></Heading>
                <FormContentContainer>
                    {
                        bankInfo.map((each, index) => (
                            <CustomInput name={each.name} label={each.label} type={each.type} required={each.required}
                                            key={index}/>
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

    const Documents = () => {
        return (
            <FormContainer>
                <Heading label={'Documents'}></Heading>
                <FormContentContainer>
                    <CustomFileInput className={'col-span-full'} name={'files'} label={'Upload Documents'} required={false} multiple={true} maxFiles={3}/>
                </FormContentContainer>
            </FormContainer>
        )
    }


    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={'p-4 space-y-4 bg-gray-50'}>
                <PersonalInfo/>
                <OtherInfo/>
                <BankInfo/>
                <TransportInfo/>
                <Documents/>
                <div className={'flex gap-4 w-1/3 ml-auto justify-end px-4'}>
                    <CustomButton variant={'neutral'} className={'w-full'} size={'md'}>Cancel</CustomButton>
                    <CustomButton type={'submit'} variant={'primary'} className={'w-full'} size={'md'}>Add
                                                                                                       Staff</CustomButton>
                </div>
            </form>
            <DevTool control={control}/>
        </FormProvider>
    )
};