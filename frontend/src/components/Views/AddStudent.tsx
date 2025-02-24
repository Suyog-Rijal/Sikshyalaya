import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {Heading} from "@/components/Forms/Heading.tsx";
import {CustomInput} from "@/components/Forms/CustomInput.tsx";
import {CustomDropdown} from "@/components/Forms/CustomDropdown.tsx";
import {
    AddStudentAddressInformation,
    AddStudentParentInfo,
    AddStudentPersonalInfo, AddStudentPreviousSchoolInformation,
    AddStudentTransportationInformation
} from "@/utils/data.ts";
import {CustomFileInput} from "@/components/Forms/CustomFileInput.tsx";
import {CustomDatePicker} from "@/components/Forms/CustomDatePicker.tsx";

export const AddStudent = () => {

    const PersonalInformation = () => {
        return (
            <FormContainer>
                <Heading label={'Personal Information'} icon={'alert-circle-outline'}/>
                <div className={'px-4'}>
                    <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                </div>
                <div className={'p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6'}>
                    {
                        AddStudentPersonalInfo.map((each, index) => (
                            each.type === 'text' ?
                                <CustomInput label={each.label} type={each.type} key={index}/>
                                :
                                each.type === 'dropdown' ?
                                    <CustomDropdown label={each.label} options={['A', 'B', 'C']} key={index}/>
                                    :
                                    each.type === 'date' ?
                                        <CustomDatePicker label={each.label} key={index}/>
                                        :
                                        <CustomInput label={each.label} disabled={true} key={index}/>

                        ))
                    }
                </div>
            </FormContainer>
        )
    }

    const ParentInformation = () => {
        return (
            <FormContainer>
                <Heading label={'Parents Information'} icon={'alert-circle-outline'}/>
                {
                    AddStudentParentInfo.map((each, index) => (
                        <div key={index} className={'p-4 space-y-8'}>
                            <div className={'space-y-4'}>
                                <h1 className="font-semibold">Father Info</h1>
                                <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {each.fatherInfo.map((info, i) => (
                                        <CustomInput label={info.label} key={`father-${i}`}/>
                                    ))}
                                </div>
                            </div>

                            <div className={'space-y-4'}>
                                <h1 className="font-semibold">Mother Info</h1>
                                <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {each.motherInfo.map((info, i) => (
                                        <CustomInput label={info.label} key={`mother-${i}`}/>
                                    ))}
                                </div>
                            </div>

                            <div className={'space-y-4'}>
                                <h1 className="font-semibold">Guardian Info</h1>
                                <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {each.guardianInfo.map((info, i) => (
                                        <CustomInput label={info.label} key={`guardian-${i}`}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                }


            </FormContainer>
        )
    }

    const AddressInformation = () => {
        return (
            <FormContainer>
                <Heading label={'Address Information'} icon={'alert-circle-outline'}/>
                <div className={'p-4 grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                    {
                        AddStudentAddressInformation.map((each, index) => (
                            <CustomInput label={each.label} type={each.type} key={index}/>
                        ))
                    }
                </div>
            </FormContainer>

        )
    }

    const TransportInformation = () => {
        return (
            <FormContainer>
                <Heading label={'Transportation Information'} icon={'alert-circle-outline'}/>
                <div className={'p-4 grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                    {
                        AddStudentTransportationInformation.map((each, index) => (
                            each.type === 'text'
                                ?
                                <CustomInput label={each.label} type={each.type} key={index}/>
                                :
                                <CustomDropdown label={each.label} options={['School bus', 'On foot']} key={index}/>
                        ))
                    }
                </div>
            </FormContainer>
        )
    }

    const PreviousSchoolInformation = () => {
        return (
            <FormContainer>
                <Heading label={'Previous School Information'} icon={'alert-circle-outline'}/>
                <div className={'p-4 grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                    {
                        AddStudentPreviousSchoolInformation.map((each, index) => (
                            <CustomInput label={each.label} type={each.type} key={index}/>
                        ))
                    }
                </div>
            </FormContainer>
        )
    }
    const Documents = () => {
        interface UploadComponentProps {
            label?: string;
        }
        const UploadComponent = ({label}: UploadComponentProps) => {
            return (
                <div className={'space-y-2'}>
                    <label htmlFor={label} className={'text-sm font-semibold'}>{label}</label>
                    <input type="file" id={label} className="hidden"/>
                    <p className={'text-sm text-gray-500'}>Upload image size 4MB, Format PDF</p>
                    <button className={'bg-[var(--tw-button-primary)] text-white py-1.5 px-4 rounded-md shadow cursor-pointer'}>
                        Upload Document
                    </button>
                </div>
            );
        }
        return (
            <FormContainer>
                <Heading label={'Documents'} icon={'alert-circle-outline'}/>
                <div className={'p-4 grid grid-cols-1 lg:grid-cols-4 gap-6'}>
                    <UploadComponent label={'Birth Certificate'}/>
                    <UploadComponent label={'Transfer Certificate'}/>
                    <UploadComponent label={'Character Certificate'}/>
                    <UploadComponent label={'Mark sheet'}/>
                </div>
            </FormContainer>
        )
    }

    return (
        // bg-[#f8fafd]
        <div className={'gap-4 p-2 flex flex-col bg-gray-100'}>
            <PersonalInformation/>
            <ParentInformation/>
            <AddressInformation/>
            <TransportInformation/>
            <PreviousSchoolInformation/>
            <Documents/>
        </div>
    );
};