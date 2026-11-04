const DIGIT_ALPHABET = '0123456789abcdef';

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (length > base) {
    throw new Error(`Cannot generate ${length} unique digits in base ${base}`);
  }

  const pool = DIGIT_ALPHABET.slice(0, base).split('');

  const pick = (remaining: string[], acc: string): string => {
    if (acc.length === length) return acc;
    const index = Math.floor(random() * remaining.length);
    const digit = remaining[index]!;
    const nextRemaining = remaining.filter((_value, i) => i !== index);
    return pick(nextRemaining, acc + digit);
  };

  return pick(pool, '');
};
