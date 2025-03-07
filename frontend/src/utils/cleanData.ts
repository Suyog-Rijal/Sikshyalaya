export const removeEmptyFields = (obj: any) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
    );
};