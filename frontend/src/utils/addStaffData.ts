export const personalInfo = [
    {
        label: 'Staff Type',
        type: 'select',
        name: 'staff_type',
        required: true,
        options: [
            {
                id: 'T',
                value: 'Teaching Staff'
            },
            {
                id: 'M',
                value: 'Management staff'
            }
        ]

    },
    {
        label: 'First Name',
        type: 'text',
        name: 'staff_info.first_name',
        placeholder: 'First Name',
        required: true
    },
    {
        label: 'Last Name',
        type: 'text',
        name: 'staff_info.last_name',
        placeholder: 'Last Name',
        required: true
    },
    {
        label: 'Phone Number',
        type: 'tel',
        name: 'staff_info.phone_number',
        required: true
    },
    {
        label: 'Gender',
        type: 'select',
        name: 'staff_info.gender',
        required: true,
        options: [
            { id: 'M', value: 'Male'},
            { id: 'F', value: 'Female'},
            { id: 'O', value: 'Other'}
        ]
    },
    {
        label: 'Date of Birth',
        type: 'date',
        name: 'staff_info.date_of_birth',
        required: true
    },
    {
        label: 'Permanent Address',
        type: 'text',
        name: 'staff_info.permanent_address',
        required: true
    },
    {
        label: 'Current Address',
        type: 'text',
        name: 'staff_info.current_address',
        required: true
    },
    {
        label: 'Marital Status',
        type: 'select',
        name: 'staff_info.marital_status',
        required: false,
        options: [
            {
                id: 'S',
                value: 'Single'
            },
            {
                id: 'M',
                value: 'Married'
            },
            {
                id: 'D',
                value: 'Divorced'
            },
            {
                id: 'W',
                value: 'Widowed'
            }
        ]
    },
    {
        label: 'Blood Group',
        type: 'select',
        name: 'staff_info.blood_group',
        required: false,
        options: [
            {value: 'A+', id: 'A+' },
            {value: 'A-', id: 'A-' },
            {value: 'B+', id: 'B+' },
            {value: 'B-', id: 'B-' },
            {value: 'O+', id: 'O+' },
            {value: 'O-', id: 'O-' },
            {value: 'AB+', id: 'AB+' },
            {value: 'AB-', id: 'AB-' },
            {value: 'Rh Null', id: 'RN' }
        ]
    },
    {
        label: 'Account status',
        type: 'select',
        name: 'staff_info.account_status',
        required: false,
        options: [
            {
                id: 'A',
                value: 'Active'
            },
            {
                id: 'I',
                value: 'Inactive'
            },
            {
                id: 'D',
                value: 'Disabled'
            }
        ]
    },
    {
        label: 'Email',
        type: 'text',
        name: 'staff_info.personal_email',
        required: false
    },
]

export const otherInfoTeaching = [
    {
        label: 'Date of Joining',
        type: 'date',
        name: 'staff_info.date_of_joining',
        required: true
    },
    {
        label: 'Class',
        type: 'select',
        name: 'teacher_info.school_class',
        required: true,
        placeholder: 'Select class',
        options: [] as { id: string; value: string }[],
    },
    {
        label: 'Subject',
        type: 'select',
        name: 'teacher_info.subject',
        required: true,
        placeholder: 'Select subject',
        options: [] as { id: string; value: string }[],
    },
    {
        label: 'Qualification',
        type: 'text',
        name: 'staff_info.qualification',
        required: true,
    },
    {
        label: 'Work Experience',
        type: 'number',
        name: 'staff_info.experience',
        required: true,
    },
    {
        label: 'Previous School (If Any)',
        type: 'text',
        name: 'staff_info.previous_workplace',
        required: false,
    },
    {
        label: 'Previous School Address',
        type: 'text',
        name: 'staff_info.previous_workplace_address',
        required: false,
    },
    {
        label: 'Previous School Phone Number',
        type: 'tel',
        name: 'staff_info.previous_workplace_phone_number',
        required: false,
    },
]

export const otherInfoManagement = [
    {
        label: 'Date of Joining',
        type: 'date',
        name: 'staff_info.date_of_join',
        required: true
    },
    {
        label: 'Department',
        type: 'select',
        name: 'managementStaff_info.department',
        required: true,
        placeholder: 'Select department',
        options: [] as { id: string; value: string }[],
    },
    {
        label: 'Qualification',
        type: 'text',
        name: 'staff_info.qualification',
        required: true,
    },
    {
        label: 'Work Experience',
        type: 'number',
        name: 'staff_info.experience',
        required: true,
    },
    {
        label: 'Previous Work Place (If Any)',
        type: 'text',
        name: 'staff_info.previous_workplace',
        required: false,
    },
    {
        label: 'Previous Work Place Address',
        type: 'text',
        name: 'staff_info.previous_workplace_address',
        required: false,
    },
    {
        label: 'Previous Work Place Phone Number',
        type: 'tel',
        name: 'staff_info.previous_workplace_phone_number',
        required: false,
    },
    {
        label: 'PAN Number / ID number',
        type: 'number',
        name: 'managementStaff_info.pan_number',
        required: false,
    },
]

export const payrollInfo = [
    {
        label: 'Basic Salary',
        type: 'number',
        name: 'staff_info.salary',
        required: true
    },
    {
        label: 'Employment Type',
        type: 'select',
        name: 'staff_info.employment_type',
        required: true,
        placeholder: 'Select employment type',
        options: [
            {
                id: 'FT',
                value: 'Full Time'
            },
            {
                id: 'PT',
                value: 'Part Time'
            },
        ]
    }
]

export const bankInfo = [
    {
        label: 'Bank Name',
        type: 'text',
        name: 'staff_info.bank_name',
        required: false
    },
    {
        label: 'Account Holder Name',
        type: 'text',
        name: 'staff_info.account_holder',
        required: false
    },
    {
        label: 'Account Number',
        type: 'text',
        name: 'staff_info.account_number',
        required: false
    }
]

export const transportInfo = [
    {
        label: 'Transportation mode',
        type: 'select',
        name: 'staff_info.transportation',
        options: [
            {value: 'School Bus', id: 'SB' },
            {value: 'Private', id: 'PV' },
            {value: 'Public', id: 'PB' },
            {value: 'On Foot', id: 'OF' }
        ],
        placeholder: 'Select transportation mode',
        required: true
    },
    {
        label: 'Pickup address',
        type: 'text',
        name: 'staff_info.pickup_address',
        placeholder: 'Pickup location',
        required: false
    }
]

export const socialMediaInfo = [
    {
        label: 'Facebook',
        type: 'text',
        name: 'staff_info.social_facebook',
        required: false
    },
    {
        label: 'Instagram',
        type: 'text',
        name: 'staff_info.social_instagram',
        required: false
    },
    {
        label: 'LinkedIn',
        type: 'text',
        name: 'staff_info.social_linkedin',
        required: false
    },
    {
        label: 'Github',
        type: 'text',
        name: 'staff_info.social_github',
        required: false
    },
]