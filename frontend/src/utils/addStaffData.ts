export const personalInfo = [
    {
        label: 'Staff Type',
        type: 'dropdown',
        name: 'staffType',
        required: true,
        options: [
            {
                id: 1,
                value: 'Teaching Staff'
            },
            {
                id: 3,
                value: 'Management staff'
            }
        ]

    },
    {
        label: 'First Name',
        type: 'text',
        name: 'firstName',
        placeholder: 'First Name',
        required: true
    },
    {
        label: 'Last Name',
        type: 'text',
        name: 'lastName',
        placeholder: 'Last Name',
        required: true
    },
    {
        label: 'Gender',
        type: 'dropdown',
        name: 'gender',
        required: true,
        options: [
            { id: 'M', value: 'Male'},
            { id: 'F', value: 'Female'},
            { id: 'O', value: 'Other'}
        ]
    },
    {
        label: 'Blood Group',
        type: 'dropdown',
        name: 'bloodGroup',
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
        label: 'Date of Birth',
        type: 'date',
        name: 'dob',
        required: true
    },
    {
        label: 'Marital Status',
        type: 'dropdown',
        name: 'maritalStatus',
        required: true,
        options: [
            {
                id: 1,
                value: 'Single'
            },
            {
                id: 2,
                value: 'Married'
            },
            {
                id: 3,
                value: 'Rather Not Say'
            }
        ]
    },
    {
        label: 'Permanent Address',
        type: 'text',
        name: 'permanentAddress',
        required: true
    },
    {
        label: 'Current Address',
        type: 'text',
        name: 'currentAddress',
        required: true
    },
    {
        label: 'Email',
        type: 'text',
        name: 'email',
        required: false
    },
    {
        label: 'Phone Number',
        type: 'text',
        name: 'phoneNumber',
        required: true
    },
]

export const otherInfoTeaching = [
    {
        label: 'Class',
        type: 'dropdown',
        name: 'grade',
        required: true,
    },
    {
        label: 'Subject',
        type: 'dropdown',
        name: 'subject',
        required: true,
    },
    {
        label: 'Qualification',
        type: 'text',
        name: 'qualification',
        required: true,
    },
    {
        label: 'Work Experience',
        type: 'text',
        name: 'workExperience',
        required: true,
    },
    {
        label: 'Previous School (If Any)',
        type: 'text',
        name: 'previousSchool',
        required: false,
    },
    {
        label: 'Previous School Address',
        type: 'text',
        name: 'previousSchoolAddress',
        required: false,
    },
    {
        label: 'Previous School Phone Number',
        type: 'text',
        name: 'previousSchoolPhoneNumber',
        required: false,
    },
    {
        label: 'PAN Number / ID number',
        type: 'text',
        name: 'panNumber',
        required: false,
    },
    {
        label: 'Date of Joining',
        type: 'date',
        name: 'doj',
        required: true
    },
    {
        label: 'Account status',
        type: 'dropdown',
        name: 'accountStatus',
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
        ]
    },
    {
        label: 'Notes',
        type: 'textarea',
        name: 'notes',
        required: false
    }
]

export const otherInfoManagement = [
    {
        label: 'Department',
        type: 'dropdown',
        name: 'department',
        required: true,
    },
    {
        label: 'Qualification',
        type: 'text',
        name: 'qualification',
        required: true,
    },
    {
        label: 'Work Experience',
        type: 'text',
        name: 'workExperience',
        required: true,
    },
    {
        label: 'Previous Work Place (If Any)',
        type: 'text',
        name: 'previousSchool',
        required: false,
    },
    {
        label: 'Previous Work Place Address',
        type: 'text',
        name: 'previousSchoolAddress',
        required: false,
    },
    {
        label: 'Previous Work Place Phone Number',
        type: 'text',
        name: 'previousSchoolPhoneNumber',
        required: false,
    },
    {
        label: 'PAN Number / ID number',
        type: 'text',
        name: 'panNumber',
        required: false,
    },
    {
        label: 'Date of Joining',
        type: 'date',
        name: 'doj',
        required: true
    },
    {
        label: 'Account status',
        type: 'dropdown',
        name: 'accountStatus',
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
        ]
    },
    {
        label: 'Notes',
        type: 'textarea',
        name: 'notes',
        required: false
    },
    {
    }
]

export const bankInfo = [
    {
        label: 'Bank Name',
        type: 'text',
        name: 'bankName',
        required: false
    },
    {
        label: 'Branch Name',
        type: 'text',
        name: 'branchName',
        required: false
    },
    {
        label: 'Account Name',
        type: 'text',
        name: 'accountName',
        required: false
    },
    {
        label: 'Account Number',
        type: 'text',
        name: 'accountNumber',
        required: false
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