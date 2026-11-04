export interface Evaluation {
  bulls: number;
  cows: number;
}

const normalize = (value: string): string[] => value.toLowerCase().split('');

export const evaluateGuess = (secret: string, guess: string): Evaluation => {
  const secretDigits = normalize(secret);
  const guessDigits = normalize(guess);

  const isBull = (digit: string, index: number): boolean => digit === secretDigits[index];

  const bulls = guessDigits.filter(isBull).length;

  const secretCowsPool = secretDigits.filter((digit, index) => !isBull(guessDigits[index]!, index));
  const guessCowsPool = guessDigits.filter((digit, index) => !isBull(digit, index));

  const cows = guessCowsPool.reduce<{ count: number; pool: string[] }>(
    (acc, digit) => {
      const matchIndex = acc.pool.indexOf(digit);
      if (matchIndex === -1) return acc;
      return {
        count: acc.count + 1,
        pool: [...acc.pool.slice(0, matchIndex), ...acc.pool.slice(matchIndex + 1)],
      };
    },
    { count: 0, pool: secretCowsPool },
  ).count;

  return { bulls, cows };
};
