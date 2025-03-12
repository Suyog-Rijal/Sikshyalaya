import { z } from "zod";


const urlSchema = z
    .string()
    .optional()
    .refine(
        (val) => !val || /^https?:\/\/.+\..+/.test(val), // Allow empty or valid URL
        { message: "Invalid URL. Must start with http:// or https://" }
    );

const baseStaffInfo = z.object({
    first_name: z.string().trim().min(1, { message: "First name is required" }),
    last_name: z.string().trim().min(1, { message: "Last name is required" }),
    phone_number: z
        .string()
        .refine((phone) => {
            return phone === '' || (/^[0-9]{10}$/.test(phone));
        }, {
            message: "Phone number must be of 10 digits",
        }),
    gender: z.enum(['M', 'F', 'O']),
    date_of_birth: z
        .date({
            required_error: "Please select date of birth.",
        })
        .refine((date) => date <= new Date(), {message: "Date cannot be in the future"})
        .refine((date) => date >= new Date("1900-01-01"), {message: "Date must be after January 1, 1900"}),
    permanent_address: z.string().trim().min(1, { message: "Permanent address is required" }),
    current_address: z.string().trim().min(1, { message: "Current address is required" }),
    marital_status: z.enum(['M', 'S', 'D', 'W']),
    blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'RN', '']),
    account_status: z.enum(['A', 'I', 'D']),
    personal_email: z.string().email().optional(),
    date_of_joining: z
        .date({
            required_error: "Please select Joining date.",
        })
        .refine((date) => date >= new Date("1900-01-01"), {message: "Date must be after January 1, 1900"}),
    qualification: z.string().trim().min(1, { message: "Qualification is required" }),
    experience: z.coerce.number().int({ message: "Experience is required" }),
    previous_workplace: z.string().optional(),
    previous_workplace_address: z.string().optional(),
    previous_workplace_phone_number: z
        .string()
        .optional()
        .refine((phone) => {
            return phone === '' || (typeof phone === 'string' && /^[0-9]{10}$/.test(phone));
        }, {
            message: "Phone number must be of 10 digits",
        }),
    salary: z.coerce.number().int().positive({ message: "Salary must be greater than 0" }),
    employment_type: z.enum(['FT', 'PT']),
    bank_name: z.string().optional(),
    account_holder: z.string().optional(),
    account_number: z.string().optional(),
    transportation: z.enum(['SB', 'PV', 'PB', 'OF']),
    pickup_address: z.string().optional(),
    social_facebook: urlSchema,
    social_instagram: urlSchema,
    social_linkedin: urlSchema,
    social_github: urlSchema,
});

const teacherInfo = z.object({
    school_class: z.string().trim().min(1, { message: "School class is required" }),
    subject: z.string().trim().min(1, { message: "Subject is required" }),
});

const managementStaffInfo = z.object({
    department: z.string().trim().min(1, { message: "Department is required" }),
    pan_number: z.coerce.number().int().min(1, { message: "PAN number is required" }),
});

const teacherSchema = z.object({
    staff_info: baseStaffInfo,
    teacher_info: teacherInfo,
    staff_type: z.literal("T"),
});

const managementSchema = z.object({
    staff_info: baseStaffInfo,
    managementStaff_info: managementStaffInfo,
    staff_type: z.literal("M"),
});

export const addStaffSchema = z.discriminatedUnion("staff_type", [
    teacherSchema,
    managementSchema,
]);

export type tAddStaffSchema = z.infer<typeof addStaffSchema>;
