export type HouseType = {
    id: string;
    color: string;
};

export type SectionType = {
    id: string;
    name: string;
    house: HouseType[];
};

export type ClassType = {
    id: string;
    name: string;
    sections: SectionType[];
};

export type DropdownOption = {
    id: string;
    value: string;
};
