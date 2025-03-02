export const personalInfo = [
    {
        label: 'Academic Year',
        type: 'text',
        name: 'academicYear',
        placeholder: 'Academic Year',
        required: true
    },
    {
        label: 'Admission Date',
        type: 'date',
        name: 'admissionDate',
        placeholder: 'Admission Date',
        required: true
    },
    {
        label: 'Account Status',
        type: 'dropdown',
        name: 'accountStatus',
        placeholder: 'Account Status',
        required: true,
        options: [
            {
                id: 1,
                value: 'Active'
            },
            {
                id: 2,
                value: 'Inactive'
            },
            {
                id: 3,
                value: 'Suspended'
            }
        ]
    },
    {
        label: 'Student ID',
        type: 'text',
        name: 'studentID',
        placeholder: 'Student ID',
        required: true
    },
    {
        label: 'First Name',
        type: 'text',
        name: 'firstName',
        placeholder: 'First Name',
        required: true
    },
    {
        label: 'Middle Name',
        type: 'text',
        name: 'middleName',
        placeholder: 'Middle Name',
        required: false
    },
    {
        label: 'Last Name',
        type: 'text',
        name: 'lastName',
        placeholder: 'Last Name',
        required: true
    },
    {
        label: 'Date of Birth',
        type: 'date',
        name: 'dob',
        placeholder: 'Date of Birth',
        required: true
    },
    {
        label: 'Gender',
        type: 'dropdown',
        name: 'gender',
        placeholder: 'Select student gender',
        required: true,
        options: [
            {
                id: 1,
                value: 'Male'
            },
            {
                id: 2,
                value: 'Female'
            },
            {
                id: 3,
                value: 'Other'
            }
        ]
    },
    {
        label: 'Blood Group',
        type: 'dropdown',
        name: 'bloodGroup',
        placeholder: 'Select student blood group',
        required: false,
        options: [
            {
                id: 1,
                value: 'A+'
            },
            {
                id: 2,
                value: 'A-'
            },
            {
                id: 3,
                value: 'B+'
            },
            {
                id: 4,
                value: 'B-'
            },
            {
                id: 5,
                value: 'O+'
            },
            {
                id: 6,
                value: 'O-'
            },
            {
                id: 7,
                value: 'AB+'
            },
            {
                id: 8,
                value: 'AB-'
            }
        ]
    },
    {
        label: 'Class',
        type: 'dropdown',
        name: 'class',
        placeholder: 'Select student class',
        required: true
    },
    {
        label: 'Section',
        type: 'dropdown',
        name: 'section',
        placeholder: 'Select student section',
        required: true
    },
    {
        label: 'House',
        type: 'dropdown',
        name: 'house',
        placeholder: 'Select student house',
        required: false
    },
    {
        label: 'Email',
        type: 'text',
        name: 'email',
        placeholder: 'Email',
        required: false
    },
    {
        label: 'Phone Number',
        type: 'text',
        name: 'phoneNumber',
        placeholder: 'Phone Number',
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
                    name: 'fatherName',
                    placeholder: 'Father name',
                    required: true
                },
                {
                    label: 'Phone Number',
                    type: 'text',
                    name: 'fatherPhoneNumber',
                    placeholder: 'Phone Number',
                    required: true
                },
                {
                    label: 'Email',
                    type: 'text',
                    name: 'fatherEmail',
                    placeholder: 'Email',
                    required: false
                },
                {
                    label: 'Occupation',
                    type: 'text',
                    name: 'fatherOccupation',
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
                    name: 'motherName',
                    placeholder: 'Mother name',
                    required: true
                },
                {
                    label: 'Phone Number',
                    type: 'text',
                    name: 'motherPhoneNumber',
                    placeholder: 'Phone Number',
                    required: true
                },
                {
                    label: 'Email',
                    type: 'text',
                    name: 'motherEmail',
                    placeholder: 'Email',
                    required: false
                },
                {
                    label: 'Occupation',
                    type: 'text',
                    name: 'motherOccupation',
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
                    name: 'guardianName',
                    placeholder: 'Guardian name',
                    required: true
                },
                {
                    label: 'Relationship',
                    type: 'text',
                    name: 'guardianRelationship',
                    placeholder: 'Relationship',
                    required: true
                },
                {
                    label: 'Phone Number',
                    type: 'text',
                    name: 'guardianPhoneNumber',
                    placeholder: 'Phone Number',
                    required: true
                },
                {
                    label: 'Email',
                    type: 'text',
                    name: 'guardianEmail',
                    placeholder: 'Email',
                    required: false
                },
                {
                    label: 'Occupation',
                    type: 'text',
                    name: 'guardianOccupation',
                    placeholder: 'Occupation',
                    required: false
                },
                {
                    label: 'Address',
                    type: 'text',
                    name: 'guardianAddress',
                    placeholder: 'Address',
                    required: true
                }
            ]
        }
    }
]

export const addressInfo = [
    {
        label: 'Current Address',
        type: 'text',
        name: 'currentAddress',
        placeholder: 'Current Address',
        required: true
    },
    {
        label: 'Permanent Address',
        type: 'text',
        name: 'permanentAddress',
        placeholder: 'Permanent Address',
        required: true
    }
]

export const transportInfo = [
    {
        label: 'Transportation mode',
        type: 'dropdown',
        name: 'transportMode',
        options: [
            {
                id: 1,
                value: 'School bus'
            },
            {
                id: 2,
                value: 'Private vehicle'
            },
            {
                id: 3,
                value: 'Public transport'
            },
            {
                id: 4,
                value: 'On foot'
            }
        ],
        placeholder: 'Select transportation mode',
        required: true
    },
    {
        label: 'Pickup location',
        type: 'text',
        name: 'pickupLocation',
        placeholder: 'Pickup location',
        required: false
    }
]

export const previousSchoolInfo = [
    {
        label: 'School Name',
        type: 'text',
        name: 'previousSchoolName',
        placeholder: 'Previous School Name',
        required: false
    },
    {
        label: 'School Address',
        type: 'text',
        name: 'previousSchoolAddress',
        placeholder: 'Previous School Address',
        required: false
    }
]