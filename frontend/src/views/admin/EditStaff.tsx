"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Button } from "@/components/ui/button.tsx"
import { FormProvider, useForm } from "react-hook-form"
import { FormContainer } from "@/components/Forms/FormContainer.tsx"
import { Heading } from "@/components/Forms/Heading.tsx"
import { Dropzone } from "@/components/ui/dropzone.tsx"
import { FormContent } from "@/components/Forms/FormContent.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { DatePicker } from "@/components/ui/date-picker.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
    bankInfo,
    otherInfoManagement,
    otherInfoTeaching,
    payrollInfo,
    personalInfo,
    socialMediaInfo,
    transportInfo,
} from "@/utils/addStaffData.ts"
import { addStaffSchema, type tAddStaffSchema } from "@/schema/AddStaff.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
import { dateFormater } from "@/utils/cleanData.ts"
import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Check, ChevronsUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define types for the API data
interface Subject {
    id: string
    name: string
}

interface StaffData {
    id: string
    name: string
    subjects: Subject[]
}

interface Department {
    id: string
    name: string
}

interface ApiData {
    staff: StaffData[]
    departments: Department[]
}

interface Option {
    id: string | number
    value: string
}

// Improved MultiSelect component that looks like shadcn/ui with fixed width
const MultiSelect = ({
                         options,
                         value,
                         onChange,
                         placeholder,
                     }: {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder: string
}) => {
    const [open, setOpen] = useState(false)

    const handleSelect = (optionId: string) => {
        if (value.includes(optionId)) {
            onChange(value.filter((id) => id !== optionId))
        } else {
            onChange([...value, optionId])
        }
    }

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
                        {value.length > 0 ? (
                            <span className="truncate">
                {value.length} class{value.length > 1 ? "es" : ""} selected
              </span>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                    <Command className="w-full">
                        <CommandInput placeholder="Search classes..." className="w-full" />
                        <CommandEmpty>No class found.</CommandEmpty>
                        <CommandList className="w-full">
                            <CommandGroup className="w-full">
                                {options.map((option) => {
                                    const isSelected = value.includes(option.id.toString())
                                    return (
                                        <CommandItem
                                            key={option.id}
                                            value={option.id.toString()}
                                            onSelect={() => handleSelect(option.id.toString())}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <Checkbox checked={isSelected} className="mr-2" />
                                            <span className="flex-grow">{option.value}</span>
                                            {isSelected && <Check className="ml-auto h-4 w-4" />}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

const PersonalInfo = () => {
    const form = useForm<tAddStaffSchema>()

    return (
        <FormContainer>
            <Heading title="Personal Information" />
            <div className={"mx-4 mt-4"}>
                <Dropzone name={"staff_info.profile_picture"} />
            </div>
            <FormContent>
                {personalInfo.map((each, index) =>
                    each.type === "select" ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className={"w-full"}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={each?.placeholder || "Select an option"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {each?.options?.map((option: { id: number | string; value: string }) => (
                                                <SelectItem key={option.id} value={`${option.id}`}>
                                                    {option.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : each.type === "date" ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} error={!!error} />
                                    </FormControl>
                                    <FormMessage>{error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ),
                )}
            </FormContent>
        </FormContainer>
    )
}

const TeacherOtherInfo = () => {
    const form = useForm<tAddStaffSchema>()
    const [apiData, setApiData] = useState<ApiData>({
        staff: [],
        departments: [],
    })

    const [teachingData, setTeachingData] = useState(otherInfoTeaching)
    const [availableSubjects, setAvailableSubjects] = useState<Option[]>([])

    useEffect(() => {
        try {
            form.setValue("managementStaff_info.department", "")
        } catch (e) {
            console.log(e)
        }
        AxiosInstance.get("/api/academic/add-staff/")
            .then((res) => {
                setApiData({
                    staff: res.data?.staff || [],
                    departments: res.data?.departments || [],
                })

                setTeachingData((prev) =>
                    prev.map((item) => {
                        if (item.name === "teacher_info.school_class") {
                            return {
                                ...item,
                                options: res.data?.staff?.map((each: { id: string; name: string }) => ({
                                    id: each.id,
                                    value: each.name,
                                })),
                            }
                        }
                        return item
                    }),
                )
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message)
            })
    }, [])

    // Update available subjects when selected classes change
    useEffect(() => {
        const selectedClasses = form.watch("teacher_info.school_class") || []
        if (selectedClasses.length > 0) {
            // Get all subjects from all selected classes
            const allSubjects = new Map<string, Subject>()

            selectedClasses.forEach((classId) => {
                const selectedClass = apiData.staff.find((staff) => staff.id === classId)
                if (selectedClass) {
                    selectedClass.subjects.forEach((subject) => {
                        allSubjects.set(subject.id, subject)
                    })
                }
            })

            // Convert map to array of options
            const subjectOptions = Array.from(allSubjects.values()).map((subject) => ({
                id: subject.id,
                value: subject.name,
            }))

            setAvailableSubjects(subjectOptions)

            // Reset subject if it's not in the available subjects
            const currentSubject = form.watch("teacher_info.subject")
            if (currentSubject && !Array.from(allSubjects.keys()).includes(currentSubject)) {
                form.setValue("teacher_info.subject", "")
            }
        } else {
            setAvailableSubjects([])
            form.setValue("teacher_info.subject", "")
        }
    }, [form.watch("teacher_info.school_class"), apiData.staff])

    return (
        <FormContainer>
            <Heading title="Teacher Information" />
            <FormContent>
                {teachingData.map((each, index) => {
                    if (each.name === "teacher_info.school_class") {
                        return (
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {each.label}
                                            {each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={each.options || []}
                                                value={field.value || []}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                placeholder={each?.placeholder || "Select classes"}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    } else if (each.name === "teacher_info.subject") {
                        return (
                            <FormField
                                key={index}
                                control={form.control}
                                name={each.name}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {each.label}
                                            {each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={availableSubjects.length === 0}
                                        >
                                            <FormControl className={"w-full"}>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            availableSubjects.length === 0
                                                                ? "Select classes first"
                                                                : each?.placeholder || "Select subject"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableSubjects.map((option) => {
                                                    // Find which classes have this subject
                                                    const classesWithSubject = apiData.staff
                                                        .filter(
                                                            (staff) =>
                                                                form.watch("teacher_info.school_class")?.includes(staff.id) &&
                                                                staff.subjects.some((subj) => subj.id === option.id),
                                                        )
                                                        .map((staff) => staff.name)

                                                    // Format the display text with class name in parentheses
                                                    const displayText =
                                                        classesWithSubject.length > 0
                                                            ? `${option.value} (${classesWithSubject.join(", ")})`
                                                            : option.value

                                                    return (
                                                        <SelectItem key={option.id} value={`${option.id}`}>
                                                            {displayText}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    } else {
                        return each.type === "date" ? (
                            <FormField
                                key={index}
                                control={form.control}
                                // @ts-expect-error: Not sure why it's here
                                name={each.name}
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {each.label}
                                            {each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker value={field.value} onChange={field.onChange} error={!!error} />
                                        </FormControl>
                                        <FormMessage>{error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                key={index}
                                control={form.control}
                                // @ts-expect-error: Not sure why it's here
                                name={each.name}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {each.label}
                                            {each.required && <span className="-ml-2 text-red-500">*</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type={each.type} {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    }
                })}
            </FormContent>
        </FormContainer>
    )
}

const ManagementOtherInfo = () => {
    const form = useForm<tAddStaffSchema>()

    const [apiData, setApiData] = useState<{
        staff: {
            id: string
            name: string
            subjects: {
                id: string
                name: string
            }[]
        }[]
        departments: {
            id: string
            name: string
        }[]
    }>({
        staff: [],
        departments: [],
    })

    const [managementData, setManagementData] = useState(otherInfoManagement)

    useEffect(() => {
        try {
            form.setValue("teacher_info.school_class", [])
            form.setValue("teacher_info.subject", undefined)
        } catch (e) {
            console.log(e)
        }
        AxiosInstance.get("/api/academic/add-staff/")
            .then((res) => {
                // Set both staff and departments
                setApiData({
                    staff: res.data?.staff || [],
                    departments: res.data?.departments || [],
                })

                // Update managementData to include department options
                setManagementData((prev) =>
                    prev.map((item) => {
                        if (item.name === "managementStaff_info.department") {
                            return {
                                ...item,
                                options: res.data?.departments?.map((each: { id: string; name: string }) => ({
                                    id: each.id,
                                    value: each.name,
                                })),
                            }
                        }
                        return item
                    }),
                )
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message)
            })
    }, [])

    return (
        <FormContainer>
            <Heading title="Management Staff Information" />
            <FormContent>
                {managementData.map((each, index) =>
                    each.type === "select" ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className={"w-full"}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={each?.placeholder || "Select an option"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {each?.options?.map((option: { id: number | string; value: string }) => (
                                                <SelectItem key={option.id} value={`${option.id}`}>
                                                    {option.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : each.type === "date" ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} error={!!error} />
                                    </FormControl>
                                    <FormMessage>{error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ),
                )}
            </FormContent>
        </FormContainer>
    )
}

const PayrollInfo = () => {
    const form = useForm<tAddStaffSchema>()
    return (
        <FormContainer>
            <Heading title="Payroll Information" />
            <FormContent>
                {payrollInfo.map((each, index) =>
                    each.type === "select" ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className={"w-full"}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={each?.placeholder || "Select an option"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {each?.options?.map(
                                                (option: {
                                                    id: number | string
                                                    value: string
                                                }) => (
                                                    <SelectItem key={option.id} value={`${option.id}`}>
                                                        {option.value}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ),
                )}
            </FormContent>
        </FormContainer>
    )
}

const BankInfo = () => {
    const form = useForm<tAddStaffSchema>()
    return (
        <FormContainer>
            <Heading title="Bank Information" />
            <FormContent>
                {bankInfo.map((each, index) => (
                    <FormField
                        key={index}
                        control={form.control}
                        name={each.name}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    {each.label}
                                    {each.required && <span className="-ml-2 text-red-500">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </FormContent>
        </FormContainer>
    )
}

const TransportInfo = () => {
    const form = useForm<tAddStaffSchema>()
    return (
        <FormContainer>
            <Heading title="Transportation Information" />
            <FormContent>
                {transportInfo.map((each, index) =>
                    each.type === "select" ? (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className={"col-span-1 xl:col-span-2 w-full"}>
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {each?.options?.map((option, index) => (
                                                <SelectItem key={index} value={`${option.id}`}>
                                                    {option.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            key={index}
                            control={form.control}
                            name={each.name}
                            render={({ field }) => (
                                <FormItem className={"col-span-1 xl:col-span-2 w-full"}>
                                    <FormLabel>
                                        {each.label}
                                        {each.required && <span className="-ml-2 text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type={each.type} {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ),
                )}
            </FormContent>
        </FormContainer>
    )
}

const SocialMediaInfo = () => {
    const form = useForm<tAddStaffSchema>()
    return (
        <FormContainer>
            <Heading title={"Social Media Info"}></Heading>
            <FormContent>
                {socialMediaInfo.map((each, index) => (
                    <FormField
                        key={index}
                        control={form.control}
                        name={each.name}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    {each.label}
                                    {each.required && <span className="-ml-2 text-red-500">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input type={each.type} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </FormContent>
        </FormContainer>
    )
}

const NoteInfo = () => {
    const form = useForm<tAddStaffSchema>()
    return (
        <FormContainer>
            <Heading title="Additional Notes" />
            <FormContent>
                <FormField
                    control={form.control}
                    name="staff_info.note"
                    render={({ field }) => (
                        <FormItem className="w-full col-span-full">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="min-h-[120px]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </FormContent>
        </FormContainer>
    )
}

export function EditStaff() {
    const navigate = useNavigate()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [originalStaff, setOriginalStaff] = useState<any>(null)

    const form = useForm<tAddStaffSchema>({
        resolver: zodResolver(addStaffSchema),
        defaultValues: {
            staff_info: {
                first_name: "",
                last_name: "",
                phone_number: "",
                gender: undefined,
                date_of_birth: undefined,
                permanent_address: "",
                current_address: "",
                marital_status: undefined,
                blood_group: undefined,
                account_status: "A",
                personal_email: undefined,
                date_of_joining: undefined,
                qualification: "",
                experience: undefined,
                previous_workplace: "",
                previous_workplace_address: "",
                previous_workplace_phone_number: "",
                salary: 0,
                employment_type: "FT",
                bank_name: "",
                account_holder: "",
                account_number: "",
                transportation: "SB",
                pickup_address: "",
                social_facebook: "",
                social_instagram: "",
                social_linkedin: "",
                social_github: "",
                note: "",
            },
            // @ts-expect-error: Conditionally applied validation
            managementStaff_info: {
                department: "",
                pan_number: 0,
            },
            teacher_info: {
                school_class: [], // Changed to array for multiple selection
                subject: "",
            },
            staff_type: "T",
        },
    })

    useEffect(() => {
        setLoading(true)
        AxiosInstance.get(`/api/staff/${params.id}/`)
            .then((response) => {
                const staffData = response.data
                setOriginalStaff(staffData)

                // Map the API data to the form structure
                form.reset({
                    staff_info: {
                        first_name: staffData.first_name,
                        last_name: staffData.last_name,
                        phone_number: staffData.phone_number,
                        gender: staffData.gender,
                        date_of_birth: staffData.date_of_birth ? new Date(staffData.date_of_birth) : undefined,
                        permanent_address: staffData.permanent_address,
                        current_address: staffData.current_address,
                        marital_status: staffData.marital_status,
                        blood_group: staffData.blood_group,
                        account_status: staffData.account_status,
                        personal_email: staffData.personal_email,
                        date_of_joining: staffData.date_of_joining ? new Date(staffData.date_of_joining) : undefined,
                        qualification: staffData.qualification,
                        experience: staffData.experience,
                        previous_workplace: staffData.previous_workplace,
                        previous_workplace_address: staffData.previous_workplace_address,
                        previous_workplace_phone_number: staffData.previous_workplace_phone_number,
                        salary: Number.parseFloat(staffData.salary),
                        employment_type: staffData.employment_type,
                        bank_name: staffData.bank_name,
                        account_holder: staffData.account_holder,
                        account_number: staffData.account_number,
                        transportation: staffData.transportation,
                        pickup_address: staffData.pickup_address,
                        social_facebook: staffData.social_facebook || "",
                        social_instagram: staffData.social_instagram || "",
                        social_linkedin: staffData.social_linkedin || "",
                        social_github: staffData.social_github || "",
                        note: staffData.note,
                    },
                    staff_type: staffData.staff_type,
                    teacher_info: {
                        school_class: staffData.position_detail?.school_class ? [staffData.position_detail.school_class] : [],
                        subject: staffData.position_detail?.subject || "",
                    },
                    managementStaff_info: {
                        department: staffData.position_detail?.department || "",
                        pan_number: 0, // Default value if not available
                    },
                })
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch staff details")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [params.id])

    const onSubmit = (data: tAddStaffSchema) => {
        const cleaned_data = {
            ...data,
            staff_info: dateFormater(data.staff_info),
        }

        AxiosInstance.put(`/api/staff/${params.id}/`, cleaned_data)
            .then(() => {
                // Handle profile picture update if changed
                if (data.staff_info.profile_picture && data.staff_info.profile_picture !== originalStaff.profile_picture) {
                    AxiosInstance.post(
                        "/api/academic/update-staff-image/",
                        {
                            image: data.staff_info.profile_picture,
                            id: params.id,
                        },
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        },
                    )
                }

                toast.success("Staff updated successfully")
                navigate(`/staff/detail/${params.id}`)
            })
            .catch((err) => {
                console.log(err)
                toast.error("Failed to update staff: " + (err.message || "Unknown error"))
            })
    }

    if (loading) {
        return (
            <div className="p-4 flex flex-col gap-2 bg-slate-100 min-h-screen">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-4 space-y-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-md shadow p-4">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <div key={idx} className="flex flex-col space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-10 w-full bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-2 bg-slate-100">
            <div>
                <PageHeader
                    title="Edit Staff"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Staff", href: "/staff/list/" },
                        { label: "Staff Detail", href: `/staff/detail/${params.id}` },
                        { label: "Edit Staff", href: `/staff/edit/${params.id}` },
                    ]}
                />
            </div>

            <FormProvider {...form}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-[#fbfbfd]">
                        <PersonalInfo />
                        {form.watch("staff_type") === "T" ? <TeacherOtherInfo /> : <ManagementOtherInfo />}
                        <PayrollInfo />
                        <BankInfo />
                        <TransportInfo />
                        <SocialMediaInfo />
                        <NoteInfo />
                        <div className={"w-full justify-end items-center flex gap-4"}>
                            <Button
                                className={"px-8"}
                                variant={"outline"}
                                type="button"
                                onClick={() => navigate(`/staff/detail/${params.id}`)}
                            >
                                Cancel
                            </Button>
                            <Button className={"px-8"} variant={"default"} type="submit">
                                Update Staff
                            </Button>
                        </div>
                    </form>
                </Form>
            </FormProvider>
        </div>
    )
}
