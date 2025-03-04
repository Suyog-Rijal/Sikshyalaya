export const personalInfo = [
    {
        label: 'Admission Date',
        type: 'date',
        name: 'personal_info.admission_date',
        required: true
    },
    {
        label: 'First Name',
        type: 'text',
        name: 'personal_info.first_name',
        required: true
    },
    {
        label: 'Last Name',
        type: 'text',
        name: 'personal_info.last_name',
        required: true
    },
    {
        label: 'Date of Birth',
        type: 'date',
        name: 'personal_info.date_of_birth',
        required: true
    },
    {
        label: 'Gender',
        type: 'select',
        name: 'personal_info.gender',
        placeholder: 'Select gender',
        required: true,
        options: [
            { id: 1, value: 'Male', key: '1' },
            { id: 2, value: 'Female', key: '2' },
            { id: 3, value: 'Other', key: '3' }
        ]
    },
    {
        label: 'Class',
        type: 'select',
        name: 'student_class',
        placeholder: 'Select class',
        required: true,
        options: [
            {
                id: '68d4f5d7-9320-41f8-88bd-7151ba198079',
                value: 'One'
            },
            {
                id: '6d3f66f7-2ced-445f-ad70-a61e701ceb2b',
                value: 'Two'
            }
        ]
    },
    {
        label: 'Section',
        type: 'select',
        name: 'section',
        placeholder: 'Select section',
        required: true,
        options: [
            {
                id: '638bf627-1a24-448a-bf0d-ff060ccd6bec',
                value: 'A'
            },
            {
                id: 'bde892b6-b68b-4248-b03f-8e24fe5abb8e',
                value: 'B'
            }
        ]
    },
    {
        label: 'House',
        type: 'select',
        name: 'house',
        placeholder: 'Select house',
        required: false,
        options: []
    },
    {
        label: 'Account Status',
        type: 'select',
        name: 'personal_info.account_status',
        placeholder: 'Select Account Status',
        required: true,
        options: [
            { value: 'Active', id: 'A' },
            { value: 'Inactive', id: 'I' },
            { value: 'Disabled', id: 'D' }
        ]
    },
    {
        label: 'Blood Group',
        type: 'select',
        name: 'personal_info.blood_group',
        placeholder: 'Select blood group',
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
        label: 'Personal Email',
        type: 'text',
        name: 'personal_info.personal_email',
        required: false
    },
    {
        label: 'Phone Number',
        type: 'text',
        name: 'personal_info.phone_number',
        required: false
    },
]

export const parentInfo = [
    {
        fatherInfo: {
            heading: 'Father Information',
            fields: [
                {
                    label: 'Father name',
                    type: 'text',
                    name: 'father_name',
                    placeholder: 'Father name',
                    required: true
                },
                {
                    label: 'Phone Number',
                    type: 'text',
                    name: 'father_number',
                    placeholder: 'Phone Number',
                    required: true
                },
                {
                    label: 'Email',
                    type: 'text',
                    name: 'father_email',
                    placeholder: 'Email',
                    required: false
                },
                {
                    label: 'Occupation',
                    type: 'text',
                    name: 'father_occupation',
                    placeholder: 'Occupation',
                    required: false
                },
            ]
        },
        motherInfo: {
            heading: 'Mother Information',
            fields: [
                {
                    label: 'Mother name',
                    type: 'text',
                    name: 'mother_name',
                    placeholder: 'Mother name',
                    required: true
                },
                {
                    label: 'Phone Number',
                    type: 'text',
                    name: 'mother_number',
                    placeholder: 'Phone Number',
                    required: true
                },
                {
                    label: 'Email',
                    type: 'text',
                    name: 'mother_email',
                    placeholder: 'Email',
                    required: false
                },
                {
                    label: 'Occupation',
                    type: 'text',
                    name: 'mother_occupation',
                    placeholder: 'Occupation',
                    required: false
                }
            ]
        },
        guardianInfo: {
            heading: 'Guardian Information',
            fields: [
                {
                    label: 'Guardian name',
                    type: 'text',
                    name: 'guardian_name',
                    placeholder: 'Guardian name',
                    required: true
                },
                {
                    label: 'Relationship',
                    type: 'text',
                    name: 'guardian_relationship',
                    placeholder: 'Relationship',
                    required: true
                },
                {
                    label: 'Phone Number',
                    type: 'text',
                    name: 'guardian_number',
                    placeholder: 'Phone Number',
                    required: true
                },
                {
                    label: 'Address',
                    type: 'text',
                    name: 'guardian_address',
                    placeholder: 'Address',
                    required: true
                },
                {
                    label: 'Email',
                    type: 'text',
                    name: 'guardian_email',
                    placeholder: 'Email',
                    required: false
                },
                {
                    label: 'Occupation',
                    type: 'text',
                    name: 'guardian_occupation',
                    placeholder: 'Occupation',
                    required: false
                },
            ]
        }
    }
]

export const addressInfo = [
    {
        label: 'Current Address',
        type: 'text',
        name: 'personal_info.current_address',
        placeholder: 'Current Address',
        required: true
    },
    {
        label: 'Permanent Address',
        type: 'text',
        name: 'personal_info.permanent_address',
        placeholder: 'Permanent Address',
        required: true
    }
]

export const transportInfo = [
    {
        label: 'Transportation mode',
        type: 'select',
        name: 'personal_info.transportation',
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
        name: 'personal_info.pickup_address',
        placeholder: 'Pickup location',
        required: false
    }
]

export const previousSchoolInfo = [
    {
        label: 'School Name',
        type: 'text',
        name: 'personal_info.previous_school',
        placeholder: 'Previous School Name',
        required: false
    },
    {
        label: 'School Address',
        type: 'text',
        name: 'personal_info.previous_school_address',
        placeholder: 'Previous School Address',
        required: false
    }
]