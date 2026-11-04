const DIGIT_ALPHABET = '0123456789abcdef';
export const createDigitValidator = (base) => (char) => {
    if (char.length !== 1)
        return false;
    const allowed = DIGIT_ALPHABET.slice(0, base);
    return allowed.includes(char.toLowerCase());
};
//# sourceMappingURL=digitValidator.js.map