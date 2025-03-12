/* eslint-disable */
// @ts-nocheck
import { format } from "date-fns";

export const removeEmptyFields = (obj: any) => {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) => value !== '' && value !== null && value !== undefined
        )
    );
};

export const dateFormater = (obj: any) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            if (key.toLowerCase().includes("date") && value) {
                const dateObj = new Date(value);
                if (!isNaN(dateObj.getTime())) {
                    return [key, format(dateObj, "yyyy-M-d")];
                }
            }
            return [key, value];
        })
    );
};