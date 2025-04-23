import {z} from "zod";

export const addStudentSchema = z.object({
    student_info: z.object({
        first_name: z.string().trim().min(1, 'First name is required'),
        last_name: z.string().trim().min(1, 'Last name is required'),
        date_of_birth: z
            .date({
                required_error: "Please select date of birth.",
            })
            .refine((date) => date <= new Date(), {message: "Date cannot be in the future"})
            .refine((date) => date >= new Date("1900-01-01"), {message: "Date must be after January 1, 1900"}),
        gender: z.enum(['M', 'F', 'O'], {
            required_error: "Please select a gender",
        }),
        account_status: z.enum(['A', 'I', 'D']),
        blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'RN', '']).nullable(),
        personal_email: z
            .string()
            .optional()
            .refine((email) => {
                return email === '' || (typeof email === 'string' && /\S+@\S+\.\S+/.test(email));
            }, {
                message: "Invalid email address",
            }),
        phone_number: z
            .string()
            .optional()
            .refine((phone) => {
                return phone === '' || (typeof phone === 'string' && /^[0-9]{10}$/.test(phone));
            }, {
                message: "Phone number must be of 10 digits",
            }),

        current_address: z.string().trim().min(1, 'Current address is required'),
        permanent_address: z.string().trim().min(1, 'Permanent address is required'),
        transportation: z.enum(['SB', 'PV', 'PB', 'OF']),
        pickup_address: z.string().optional(),
        previous_school: z.string().optional(),
        previous_school_address: z.string().optional(),
        profile_picture: z.any().optional().nullable().or(z.instanceof(File)).or(z.literal("")).or(z.undefined()),
    }),

    enrollment_info: z.object({
        house: z.string().optional(),
        enrollment_date: z
            .date({
                required_error: "Please select admission date.",
            })
            .refine((date) => date <= new Date(), { message: "Date cannot be in the future" })
            .refine((date) => date >= new Date("1900-01-01"), { message: "Date must be after January 1, 1900" }),
        school_class: z.string().min(1, 'Please select class'),
        section: z.string().min(1, 'Please select section'),
    }),

    father_info: z.object({
        full_name: z.string().optional(),
        profile_picture: z.any().optional().nullable().or(z.instanceof(File)).or(z.literal("")).or(z.undefined()),

        phone_number: z
            .string()
            .optional()
            .refine((phone) => {
                return phone === '' || (typeof phone === 'string' && /^[0-9]{10}$/.test(phone));
            }, {
                message: "Phone number must be of 10 digits",
            }),
        email: z.string()
            .optional()
            .refine((email) => {
                return email === '' || (typeof email === 'string' && /\S+@\S+\.\S+/.test(email));
            }, {
                message: "Invalid email address",
            }),
        occupation: z.string().optional(),
    }),

    mother_info: z.object({
        profile_picture: z.any().optional().nullable().or(z.instanceof(File)).or(z.literal("")).or(z.undefined()),

        full_name: z.string().optional(),
        phone_number: z
            .string()
            .optional()
            .refine((phone) => {
                return phone === '' || (typeof phone === 'string' && /^[0-9]{10}$/.test(phone));
            }, {
                message: "Phone number must be of 10 digits",
            }),
        email: z.string()
            .optional()
            .refine((email) => {
                return email === '' || (typeof email === 'string' && /\S+@\S+\.\S+/.test(email));
            }, {
                message: "Invalid email address",
            }),
        occupation: z.string().optional(),
    }),

    guardian_info: z.object({
        full_name: z.string().trim().min(1, 'Guardian name is required'),
        guardian_relation: z.string().trim().min(1, 'Relationship is required'),
        profile_picture: z.any().optional().nullable().or(z.instanceof(File)).or(z.literal("")).or(z.undefined()),

        phone_number: z
            .string()
            .min(10, 'Phone number must be exactly 10 digits')
            .max(10, 'Phone number must be exactly 10 digits')
            .refine((phone) => /^[0-9]{10}$/.test(phone), {
                message: "Phone number must contain only digits",
            }),
        email: z.string()
            .optional()
            .refine((email) => {
                return email === '' || (typeof email === 'string' && /\S+@\S+\.\S+/.test(email));
            }, {
                message: "Invalid email address",
            }),
        occupation: z.string().optional(),
        address: z.string().trim().min(1, 'Address is required'),
    }),
});

export type tAddStudentSchema = z.infer<typeof addStudentSchema>;