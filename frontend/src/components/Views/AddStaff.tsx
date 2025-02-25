import {FormContainer} from "@/components/Forms/FormContainer.tsx";
import {Heading} from "@/components/Forms/Heading.tsx";
import {CustomInput} from "@/components/Forms/CustomInput.tsx";
import {CustomDropdown} from "@/components/Forms/CustomDropdown.tsx";
import {CustomFileInput} from "@/components/Forms/CustomFileInput.tsx";
import {CustomDatePicker} from "@/components/Forms/CustomDatePicker.tsx";
import {AddStaffPersonalInfo} from "@/utils/data.ts";

export const AddStudent = () => {

    const PersonalInformation = () => {
        return (
            <FormContainer>
                <Heading label={'Personal Information'} icon={'alert-circle-outline'}/>
                <div className={'px-8'}>
                    <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                </div>
                <div className={'p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6'}>
                    {
                        AddStaffPersonalInfo.map((each, index) => (
                            each.type === 'text' ?
                                <CustomInput label={each.label} type={each.type} key={index}/>
                                :
                                each.type === 'dropdown' ?
                                    <CustomDropdown label={each.label} options={each?.options || ['1', '2', '3']} key={index}/>
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

    return (
        // bg-[#f8fafd]
        <div className={'gap-4 p-2 flex flex-col bg-gray-100'}>
            <PersonalInformation/>
            <div>
                <div className={'py-2 flex justify-end'}>
                    <div className={'grid grid-cols-2 gap-4 w-full md:w-1/2 xl:w-3/12'}>
                        <button
                            type="button"
                            className="text-sm text-red-500 bg-white hover:underline shadow py-2 px-4 rounded-md cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="text-sm hover:underline shadow py-2 px-4 rounded-md text-white bg-[var(--tw-button-primary)] cursor-pointer">
                            Add Student
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};