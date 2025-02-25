export const role = "admin";

export const AddStudentPersonalInfo = [
    {
        type: null,
        label: 'Academic Year',
        required: true
    },
    {
        type: 'date',
        label: 'Admission Date',
        required: true
    },
    {
        type: 'dropdown',
        label: 'Status',
        required: true
    },
    {
        type: 'text',
        label: 'First Name',
        required: true
    },
    {
        type: 'text',
        label: 'Last Name',
        required: true
    },
    {
        type: 'dropdown',
        label: 'Class',
        required: true,
        options: []
    },
    {
        type: 'dropdown',
        label: 'Section',
        required: true,
        options: []
    },
    {
        type: 'date',
        label: 'Date of Birth',
        required: true
    },
    {
        type: 'dropdown',
        label: 'Blood Group',
        required: false
    },
    {
        type: 'dropdown',
        label: 'House',
        required: false
    },
    {
        type: 'text',
        label: 'Primary Contact',
        required: false
    },
    {
        type: 'text',
        label: 'Primary Email',
        required: false
    }
]

export const AddStudentParentInfo = [
    {
        fatherInfo:
            [
                {
                    type: 'text',
                    label: 'Father Name',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Father Occupation',
                    required: false
                },
                {
                    type: 'text',
                    label: 'Father Contact',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Father Email',
                    required: false
                }
            ],
        motherInfo:
            [
                {
                    type: 'text',
                    label: 'Mother Name',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Mother Occupation',
                    required: false
                },
                {
                    type: 'text',
                    label: 'Mother Contact',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Mother Email',
                    required: false
                }
            ],
        guardianInfo:
            [
                {
                    type: 'text',
                    label: 'Guardian Name',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Guardian Relation',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Guardian Contact',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Guardian Email',
                    required: false
                },
                {
                    type: 'text',
                    label: 'Guardian Address',
                    required: true
                },
                {
                    type: 'text',
                    label: 'Guardian Occupation',
                    required: false
                }
            ]
    }
]

export const AddStudentAddressInformation = [
    {
        type: 'text',
        label: 'Temporary Address',
        required: true
    },
    {
        type: 'text',
        label: 'Permanent Address',
        required: true
    }
]

export const AddStudentTransportationInformation = [
    {
        type: 'dropdown',
        label: 'Transportation Mode',
        required: true
    },
    {
        type: 'text',
        label: 'Pickup Point',
        required: true
    }
]

export const AddStudentPreviousSchoolInformation = [
    {
        type: 'text',
        label: 'School name',
        required: false
    },
    {
        type: 'text',
        label: 'School Address',
        required: false
    }
]










export const AddStaffPersonalInfo = [
    {
        label: 'Staff Type',
        type: 'dropdown',
        required: true,
        options: [
            'Teaching staff',
            'Non-teaching staff'
        ]
    },
    {
        label: 'First Name',
        type: 'text',
        required: true
    },
    {
        label: 'Last Name',
        type: 'text',
        required: true
    },
    {
        label: 'Gender',
        type: 'dropdown',
        required: true,
        options: [
            'Male',
            'Female',
            'Others'
        ]
    },
    {
        label: 'Primary Contact',
        type: 'text',
        required: true
    },
    {
        label : 'Primary Email',
        type: 'text',
        required: false
    },
    {
        label: 'Blood Group',
        type: 'dropdown',
        required: false,
        options: [
            'A+',
            'A-',
            'B+',
            'B-',
            'AB+',
            'AB-',
            'O+',
            'O-'
        ]
    },
    {
        label: 'Marital Status',
        type: 'dropdown',
        required: false,
        options: [
            'Single',
            'Married',
            'Divorced',
            'Widowed'
        ]
    },
]