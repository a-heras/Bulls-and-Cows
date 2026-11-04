import { createDigitValidator } from './digitValidator.js';
export const isValidGuess = (guess, length, base) => {
    if (guess.length !== length)
        return false;
    const isDigit = createDigitValidator(base);
    const chars = guess.split('');
    const allValid = chars.every((char) => isDigit(char));
    if (!allValid)
        return false;
    const uniqueLower = new Set(chars.map((char) => char.toLowerCase()));
    return uniqueLower.size === chars.length;
};
//# sourceMappingURL=isValidGuess.js.map