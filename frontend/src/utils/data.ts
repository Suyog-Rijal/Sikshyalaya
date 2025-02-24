export const role = "admin";

export const AddStudentPersonalInfo = [
    {
        type: null,
        label: 'Academic Year',
    },
    {
        type: 'date',
        label: 'Admission Date',
    },
    {
        type: 'dropdown',
        label: 'Status',
    },
    {
        type: 'text',
        label: 'First Name',
    },
    {
        type: 'text',
        label: 'Last Name',
    },
    {
        type: 'dropdown',
        label: 'Class'
    },
    {
        type: 'dropdown',
        label: 'Section'
    },
    {
        type: 'date',
        label: 'Date of Birth',
    },
    {
        type: 'dropdown',
        label: 'Blood Group',
    },
    {
        type: 'dropdown',
        label: 'House'

    },
    {
        type: 'text',
        label: 'Primary Contact'
    },
    {
        type: 'text',
        label: 'Primary Email'
    }
]

export const AddStudentParentInfo = [
    {
        fatherInfo:
            [
                {
                    type: 'text',
                    label: 'Father Name'
                },
                {
                    type: 'text',
                    label: 'Father Occupation'
                },
                {
                    type: 'text',
                    label: 'Father Contact'
                },
                {
                    type: 'text',
                    label: 'Father Email'
                }
            ],
        motherInfo:
            [
                {
                    type: 'text',
                    label: 'Mother Name'
                },
                {
                    type: 'text',
                    label: 'Mother Occupation'
                },
                {
                    type: 'text',
                    label: 'Mother Contact'
                },
                {
                    type: 'text',
                    label: 'Mother Email'
                }
            ],
        guardianInfo:
            [
                {
                    type: 'text',
                    label: 'Guardian Name'
                },
                {
                    type: 'text',
                    label: 'Guardian Relation'
                },
                {
                    type: 'text',
                    label: 'Guardian Contact'
                },
                {
                    type: 'text',
                    label: 'Guardian Email'
                },
                {
                    type: 'text',
                    label: 'Guardian Address'
                },
                {
                    type: 'text',
                    label: 'Guardian Occupation'
                }
            ]
    }
]

export const AddStudentAddressInformation = [
    {
        type: 'text',
        label: 'Temporary Address'
    },
    {
        type: 'text',
        label: 'Permanent Address'
    }
]

export const AddStudentTransportationInformation = [
    {
        type: 'dropdown',
        label: 'Transportation Mode'
    },
    {
        type: 'text',
        label: 'Pickup Point'
    }
]

export const AddStudentPreviousSchoolInformation = [
    {
        type: 'text',
        label: 'School name'
    },
    {
        type: 'text',
        label: 'School Address'
    }
]

