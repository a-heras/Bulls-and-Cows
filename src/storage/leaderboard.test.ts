// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadRecords, saveRecord, sortRecords, type RecordEntry } from './leaderboard';

const makeRecord = (attempts: number, timeMs: number): RecordEntry => ({
  length: 4,
  base: 10,
  attempts,
  timeMs,
  date: '2026-01-01T00:00:00.000Z',
});

describe('leaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('loadRecords', () => {
    it('returns empty array when storage is empty', () => {
      expect(loadRecords()).toEqual([]);
    });

    it('returns parsed records from storage', () => {
      const records = [makeRecord(3, 1000), makeRecord(5, 2000)];
      localStorage.setItem('bulls-and-cows:records', JSON.stringify(records));
      expect(loadRecords()).toEqual(records);
    });

    it('returns empty array when stored value is corrupted', () => {
      localStorage.setItem('bulls-and-cows:records', '{not json');
      expect(loadRecords()).toEqual([]);
    });

    it('returns empty array when stored value is not an array', () => {
      localStorage.setItem('bulls-and-cows:records', JSON.stringify({ foo: 'bar' }));
      expect(loadRecords()).toEqual([]);
    });
  });

  describe('sortRecords', () => {
    it('sorts by attempts ascending', () => {
      const sorted = sortRecords([makeRecord(5, 1000), makeRecord(3, 2000), makeRecord(4, 500)]);
      expect(sorted.map((r) => r.attempts)).toEqual([3, 4, 5]);
    });

    it('breaks ties by time ascending', () => {
      const sorted = sortRecords([makeRecord(3, 2000), makeRecord(3, 1000), makeRecord(3, 1500)]);
      expect(sorted.map((r) => r.timeMs)).toEqual([1000, 1500, 2000]);
    });

    it('does not mutate the input array', () => {
      const input = [makeRecord(5, 1000), makeRecord(3, 2000)];
      const copy = [...input];
      sortRecords(input);
      expect(input).toEqual(copy);
    });
  });

  describe('saveRecord', () => {
    it('appends a new record and returns sorted array', () => {
      const existing = [makeRecord(5, 1000)];
      const next = saveRecord(makeRecord(3, 2000), existing);
      expect(next.map((r) => r.attempts)).toEqual([3, 5]);
    });

    it('persists records to localStorage', () => {
      const next = saveRecord(makeRecord(3, 1000), []);
      const stored: unknown = JSON.parse(localStorage.getItem('bulls-and-cows:records') ?? '[]');
      expect(stored).toEqual(next);
    });

    it('keeps only top 10 records', () => {
      const existing = Array.from({ length: 10 }, (_, i) => makeRecord(10 + i, 1000));
      const next = saveRecord(makeRecord(1, 500), existing);
      expect(next).toHaveLength(10);
      expect(next[0]?.attempts).toBe(1);
    });

    it('does not mutate the existing records array', () => {
      const existing = [makeRecord(5, 1000)];
      const copy = [...existing];
      saveRecord(makeRecord(3, 2000), existing);
      expect(existing).toEqual(copy);
    });

    it('handles corrupted storage gracefully when saving', () => {
      localStorage.setItem('bulls-and-cows:records', '{broken');
      const next = saveRecord(makeRecord(3, 1000), loadRecords());
      expect(next).toHaveLength(1);
    });
  });
});
