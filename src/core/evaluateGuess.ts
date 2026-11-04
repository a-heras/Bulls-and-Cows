export interface Evaluation {
  bulls: number;
  cows: number;
}

export const evaluateGuess = (_secret: string, _guess: string): Evaluation => {
  throw new Error('Not implemented');
};
