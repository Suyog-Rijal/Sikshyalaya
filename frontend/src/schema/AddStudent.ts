import {z} from "zod";

export const addStudentSchema = z.object({
    personal_info: z.object({
        first_name: z.string(),
        last_name: z.string(),
        date_of_birth: z.date(),
        gender: z.string(),
        account_status: z.enum(['A', 'I', 'D']),
        blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'RN', '']).nullable(),
        personal_email: z.string().email().nullable(),
        phone_number: z.string().max(15).nullable(),
        admission_date: z.date(),
        current_address: z.string(),
        permanent_address: z.string(),
        transportation: z.enum(['SB', 'PV', 'PB', 'OF']).nullable(),
        pickup_address: z.string().nullable(),
        profile_picture: z.string().url().nullable(),
        previous_school: z.string().nullable(),
        previous_school_address: z.string().nullable(),
    }),
});

export type tAddStudentSchema = z.infer<typeof addStudentSchema>;