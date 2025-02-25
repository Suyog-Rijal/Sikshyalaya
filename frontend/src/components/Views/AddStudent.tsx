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
import React, {useEffect, useState} from "react";
import AxiosInstance from "@/utils/AxiosInstance.ts";

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
                        AddStudentPersonalInfo.map((each, index) => (
                            each.type === 'text' ?
                                <CustomInput label={each.label} type={each.type} key={index} value/>
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
                <Heading label={'Parents Information'} icon={'people-outline'}/>
                {
                    AddStudentParentInfo.map((each, index) => (
                        <div key={index} className={'p-4 space-y-8'}>
                            <div className={''}>
                                <div className={'px-4'}>
                                    <h1 className="font-semibold">Father Info</h1>
                                    <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {each.fatherInfo.map((info, i) => (
                                        <CustomInput label={info.label} key={`father-${i}`}/>
                                    ))}
                                </div>
                            </div>

                            <div className={''}>
                                <div className={'px-4'}>
                                    <h1 className="font-semibold">Mother Info</h1>
                                    <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {each.motherInfo.map((info, i) => (
                                        <CustomInput label={info.label} key={`mother-${i}`}/>
                                    ))}
                                </div>
                            </div>

                            <div className={''}>
                                <div className={'px-4'}>
                                    <h1 className="font-semibold">Guardian Info</h1>
                                    <CustomFileInput label={'Upload image size 4MB, Format JPG, PNG, SVG'}/>
                                </div>
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
                <Heading label={'Address Information'} icon={'location-outline'}/>
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
                <Heading label={'Transportation Information'} icon={'bus-outline'}/>
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
                <Heading label={'Previous School Information'} icon={'business-outline'}/>
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
            label: string;
        }

        const UploadComponent = ({ label }: UploadComponentProps) => {
            const [file, setFile] = useState<File | null>(null);
            const [isDragging, setIsDragging] = useState(false);

            const handleDrag = (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
            };

            const handleDragIn = (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
            };

            const handleDragOut = (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
            };

            const handleDrop = (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);

                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                    setFile(files[0]);
                }
            };

            const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                }
            };

            const removeFile = () => setFile(null);

            return (
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="px-4 border-b border-gray-100">
                        <h3 className="block text-xs text-gray-500">{label}</h3>
                    </div>
                    <div className="p-3">
                        <div
                            className={`relative rounded-lg border-2 border-dashed transition-colors ${
                                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                            onDragEnter={handleDragIn}
                            onDragLeave={handleDragOut}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {!file && (
                                <input
                                    type="file"
                                    id={label}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                />
                            )}
                            <div className="p-4 text-center">
                                {!file ? (
                                    <div className="space-y-2">
                                        <div className="mx-auto w-6 h-6 text-gray-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                                />
                                            </svg>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-700">Drag & drop or click to upload</p>
                                            <p className="text-xs text-gray-500">PDF format, max 4MB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 text-blue-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{file.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={removeFile}
                                                className="text-gray-400 hover:text-gray-600 transition"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <FormContainer>
                <Heading label={'Documents'} icon={'document-attach-outline'}/>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 p-4">
                    <UploadComponent label="Birth Certificate"/>
                    <UploadComponent label="Transfer Certificate"/>
                    <UploadComponent label="Previous Report Card"/>
                    <UploadComponent label="Other Documents"/>
                </div>
            </FormContainer>
        )
    }


    useEffect(() => {
        AxiosInstance.get('enrollment/')
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        // bg-[#f8fafd]
        <div className={'gap-4 p-2 flex flex-col bg-gray-100'}>
            <PersonalInformation/>
            <ParentInformation/>
            <AddressInformation/>
            <TransportInformation/>
            <PreviousSchoolInformation/>
            <Documents/>
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