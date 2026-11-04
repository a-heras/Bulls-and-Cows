import { describe, expect, it } from 'vitest';
import { isValidGuess } from './isValidGuess';

describe('isValidGuess', () => {
  describe('length check', () => {
    it('rejects guess shorter than required length', () => {
      expect(isValidGuess('1', 4, 10)).toBe(false);
    });

    it('rejects guess longer than required length', () => {
      expect(isValidGuess('12345', 4, 10)).toBe(false);
    });

    it('accepts guess of exact length', () => {
      expect(isValidGuess('1234', 4, 10)).toBe(true);
    });
  });

  describe('digit validity per base', () => {
    it('rejects digits not allowed in binary base', () => {
      expect(isValidGuess('12', 2, 2)).toBe(false);
      expect(isValidGuess('02', 2, 2)).toBe(false);
    });

    it('rejects digits not allowed in octal base', () => {
      expect(isValidGuess('89', 2, 8)).toBe(false);
    });

    it('accepts valid hex digits in lowercase', () => {
      expect(isValidGuess('abcd', 4, 16)).toBe(true);
    });

    it('accepts valid hex digits in uppercase', () => {
      expect(isValidGuess('ABCD', 4, 16)).toBe(true);
    });

    it('rejects letters beyond f in hex', () => {
      expect(isValidGuess('abg', 3, 16)).toBe(false);
    });
  });

  describe('uniqueness of digits', () => {
    it('rejects repeated digits', () => {
      expect(isValidGuess('1123', 4, 10)).toBe(false);
      expect(isValidGuess('0000', 4, 10)).toBe(false);
    });

    it('treats uppercase and lowercase hex as the same digit', () => {
      expect(isValidGuess('aA12', 4, 16)).toBe(false);
    });

    it('accepts all-unique guess', () => {
      expect(isValidGuess('0123', 4, 10)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('rejects empty guess when length > 0', () => {
      expect(isValidGuess('', 4, 10)).toBe(false);
    });

    it('accepts leading zeros as valid digits', () => {
      expect(isValidGuess('0123', 4, 10)).toBe(true);
    });
  });
});
