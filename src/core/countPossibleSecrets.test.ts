import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  describe('decimal base', () => {
    it('returns 90 for length 2, base 10 (P(10, 2))', () => {
      expect(countPossibleSecrets(2, 10)).toBe(90);
    });

    it('returns 5040 for length 4, base 10 (P(10, 4))', () => {
      expect(countPossibleSecrets(4, 10)).toBe(5040);
    });

    it('returns 151200 for length 6, base 10 (P(10, 6))', () => {
      expect(countPossibleSecrets(6, 10)).toBe(151200);
    });
  });

  describe('other bases', () => {
    it('returns 2 for length 2, base 2 (P(2, 2))', () => {
      expect(countPossibleSecrets(2, 2)).toBe(2);
    });

    it('returns 56 for length 2, base 8 (P(8, 2))', () => {
      expect(countPossibleSecrets(2, 8)).toBe(56);
    });

    it('returns 43680 for length 4, base 16 (P(16, 4))', () => {
      expect(countPossibleSecrets(4, 16)).toBe(43680);
    });
  });

  describe('edge cases', () => {
    it('returns 1 when length is 0 (empty secret)', () => {
      expect(countPossibleSecrets(0, 10)).toBe(1);
    });

    it('returns 0 when length exceeds base', () => {
      expect(countPossibleSecrets(5, 2)).toBe(0);
      expect(countPossibleSecrets(11, 10)).toBe(0);
    });

    it('returns 1 when length equals base (all permutations of full alphabet)', () => {
      expect(countPossibleSecrets(2, 2)).toBe(2);
      expect(countPossibleSecrets(10, 10)).toBe(3628800);
    });
  });

  describe('memoization', () => {
    it('returns the same value on repeated calls', () => {
      const first = countPossibleSecrets(4, 10);
      const second = countPossibleSecrets(4, 10);
      const third = countPossibleSecrets(4, 10);
      expect(first).toBe(second);
      expect(second).toBe(third);
    });

    it('handles repeated calls for different inputs independently', () => {
      expect(countPossibleSecrets(2, 10)).toBe(90);
      expect(countPossibleSecrets(4, 10)).toBe(5040);
      expect(countPossibleSecrets(2, 10)).toBe(90);
    });
  });
});
