import {z} from "zod";

export const addStudentSchema = z.object({
    student_info: z.object({
        first_name: z.string().trim().min(1, 'First name is required'),
        last_name: z.string().trim().min(1, 'Last name is required'),
        date_of_birth: z
            .string()
            .refine(date => date.length > 0, {
                message: "Date of birth is required",
            })
            .transform(date => {
                const parsedDate = new Date(date);
                return isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().split("T")[0];
            })
            .refine(date => date !== "", {
                message: "Invalid date format",
            })
            .refine(date => new Date(date) <= new Date(), {
                message: "Date of birth cannot be in the future",
            }),
        gender: z.enum(['M', 'F', 'O'], {
            required_error: "Please select a gender",
        }), account_status: z.enum(['A', 'I', 'D']),
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
        // profile_picture: z.union([z.string().url(), z.instanceof(File)]).nullable(),
    }),

    enrollment_info: z.object({
        enrollment_date: z
            .string()
            .transform((val) => new Date(val))
            .refine((date) => !isNaN(date.getTime()), {
                message: 'Invalid date',
            }),
        student_class: z.string().min(1, 'Please select class'),
        section: z.string().min(1, 'Please select section'),
    }),

    father_info: z.object({
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

    mother_info: z.object({
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

    house: z.string().optional(),
});

export type tAddStudentSchema = z.infer<typeof addStudentSchema>;