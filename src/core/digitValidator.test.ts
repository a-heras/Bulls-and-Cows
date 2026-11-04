import { describe, expect, it } from 'vitest';
import { createDigitValidator } from './digitValidator';

describe('createDigitValidator', () => {
  describe('binary base', () => {
    const isBinary = createDigitValidator(2);

    it('accepts "0" and "1"', () => {
      expect(isBinary('0')).toBe(true);
      expect(isBinary('1')).toBe(true);
    });

    it('rejects digits outside binary alphabet', () => {
      expect(isBinary('2')).toBe(false);
      expect(isBinary('9')).toBe(false);
    });

    it('rejects non-digit characters', () => {
      expect(isBinary('a')).toBe(false);
      expect(isBinary('')).toBe(false);
      expect(isBinary(' ')).toBe(false);
    });
  });

  describe('decimal base', () => {
    const isDecimal = createDigitValidator(10);

    it('accepts digits 0-9', () => {
      for (const d of '0123456789') {
        expect(isDecimal(d)).toBe(true);
      }
    });

    it('rejects letters', () => {
      expect(isDecimal('a')).toBe(false);
      expect(isDecimal('f')).toBe(false);
    });
  });

  describe('hex base', () => {
    const isHex = createDigitValidator(16);

    it('accepts digits 0-9 and letters a-f', () => {
      for (const d of '0123456789abcdef') {
        expect(isHex(d)).toBe(true);
      }
    });

    it('accepts uppercase A-F as the same digits', () => {
      for (const d of 'ABCDEF') {
        expect(isHex(d)).toBe(true);
      }
    });

    it('rejects letters beyond f', () => {
      expect(isHex('g')).toBe(false);
      expect(isHex('z')).toBe(false);
    });
  });

  describe('currying', () => {
    it('returns a reusable predicate per base', () => {
      const isOct = createDigitValidator(8);
      expect(isOct('7')).toBe(true);
      expect(isOct('8')).toBe(false);
      expect(isOct('7')).toBe(true);
    });

    it('creates independent validators for different bases', () => {
      const isBin = createDigitValidator(2);
      const isHex = createDigitValidator(16);
      expect(isBin('a')).toBe(false);
      expect(isHex('a')).toBe(true);
    });
  });
});
