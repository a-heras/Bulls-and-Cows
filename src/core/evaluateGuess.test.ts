import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  describe('bulls (correct digit and position)', () => {
    it('counts all bulls when guess equals secret', () => {
      expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
    });

    it('counts a single bull when only one position matches', () => {
      expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 });
    });
  });

  describe('cows (correct digit, wrong position)', () => {
    it('counts all cows when guess is a full permutation', () => {
      expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
    });

    it('counts mixed bulls and cows', () => {
      expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
    });

    it('counts cows for rotated guess', () => {
      expect(evaluateGuess('1234', '4123')).toEqual({ bulls: 0, cows: 4 });
    });
  });

  describe('no matches', () => {
    it('returns zero bulls and zero cows when nothing matches', () => {
      expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
    });
  });

  describe('hex case-insensitivity', () => {
    it('treats lowercase and uppercase hex digits as equal', () => {
      expect(evaluateGuess('abcd', 'ABCD')).toEqual({ bulls: 4, cows: 0 });
    });

    it('counts cows across mixed case', () => {
      expect(evaluateGuess('ABCD', 'bcda')).toEqual({ bulls: 0, cows: 4 });
    });

    it('counts mixed bulls and cows across mixed case', () => {
      expect(evaluateGuess('AbCd', 'aBdC')).toEqual({ bulls: 2, cows: 2 });
    });
  });

  describe('leading zeros', () => {
    it('handles leading zeros as regular digits', () => {
      expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
      expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
    });
  });
});
