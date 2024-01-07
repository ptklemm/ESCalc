export const toNumber = (value: string | undefined | null): number => {
    const numValue = Number(value);

    if (!numValue) {
        return 0;
    }

    return numValue;
}

export function getEnumKeyByEnumValue<T extends {[index: string]: string}>
    (myEnum: T, enumValue: string): keyof T | null {
        const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
}