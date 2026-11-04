import { describe, expect, it } from 'vitest';
import { generateSecret } from './generateSecret';

const sequenceRandom = (values: number[]) => {
  let i = 0;
  return (): number => {
    const value = values[i % values.length];
    i += 1;
    return value ?? 0;
  };
};

describe('generateSecret', () => {
  describe('length', () => {
    it('returns a secret of the requested length', () => {
      const secret = generateSecret(4, 10, () => 0.5);
      expect(secret).toHaveLength(4);
    });

    it('returns a secret of length 2 for binary base', () => {
      const secret = generateSecret(2, 2, () => 0.5);
      expect(secret).toHaveLength(2);
    });
  });

  describe('uniqueness', () => {
    it('produces unique digits for decimal base', () => {
      const secret = generateSecret(4, 10, () => 0.5);
      const unique = new Set(secret.split(''));
      expect(unique.size).toBe(4);
    });

    it('produces unique digits for hex base with uppercase input source', () => {
      // random returns values that would pick the same digit if not handled
      const secret = generateSecret(6, 16, sequenceRandom([0, 0, 0, 0, 0, 0]));
      const unique = new Set(secret.split(''));
      expect(unique.size).toBe(6);
    });
  });

  describe('digit validity per base', () => {
    it('only uses digits valid for the requested base', () => {
      const secret = generateSecret(4, 10, () => 0.5);
      for (const char of secret) {
        expect('0123456789'.includes(char)).toBe(true);
      }
    });

    it('only uses binary digits when base is 2', () => {
      const secret = generateSecret(2, 2, () => 0.5);
      for (const char of secret) {
        expect('01'.includes(char)).toBe(true);
      }
    });
  });

  describe('determinism with injected random', () => {
    it('produces the same secret with the same random sequence', () => {
      const first = generateSecret(4, 10, sequenceRandom([0.1, 0.2, 0.3, 0.4]));
      const second = generateSecret(4, 10, sequenceRandom([0.1, 0.2, 0.3, 0.4]));
      expect(first).toBe(second);
    });

    it('produces a different secret with a different random sequence', () => {
      const first = generateSecret(4, 10, sequenceRandom([0.1, 0.2, 0.3, 0.4]));
      const second = generateSecret(4, 10, sequenceRandom([0.9, 0.8, 0.7, 0.6]));
      expect(first).not.toBe(second);
    });

    it('accepts a custom random returning 0 and picks the first digit each time', () => {
      const secret = generateSecret(4, 10, () => 0);
      // With random always 0, first pick is '0', then unique picks continue from '1' and so on
      expect(secret).toBe('0123');
    });
  });

  describe('edge cases', () => {
    it('returns an empty string when length is 0', () => {
      expect(generateSecret(0, 10, () => 0.5)).toBe('');
    });

    it('throws when length exceeds base', () => {
      expect(() => generateSecret(5, 2, () => 0.5)).toThrow(/cannot generate/i);
    });
  });
});
