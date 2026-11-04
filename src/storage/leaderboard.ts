export interface RecordEntry {
  length: number;
  base: number;
  attempts: number;
  timeMs: number;
  date: string;
}

const STORAGE_KEY = 'bulls-and-cows:records';
const MAX_RECORDS = 10;

const isRecordEntry = (value: unknown): value is RecordEntry =>
  typeof value === 'object' &&
  value !== null &&
  'length' in value &&
  'base' in value &&
  'attempts' in value &&
  'timeMs' in value &&
  'date' in value;

export const loadRecords = (): RecordEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecordEntry);
  } catch {
    return [];
  }
};

export const sortRecords = (records: readonly RecordEntry[]): RecordEntry[] =>
  [...records].sort((a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs);

export const saveRecord = (
  record: RecordEntry,
  existing: readonly RecordEntry[],
): RecordEntry[] => {
  const next = sortRecords([...existing, record]).slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage may be unavailable (private mode, quota) — keep in-memory result
  }
  return next;
};
