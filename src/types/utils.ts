export const ToNumber = (value: string | undefined | null): number => {
    const numValue = Number(value);

    if (!numValue) {
        return 0;
    }

    return numValue;
}