export interface RecordEntry {
  length: number;
  base: number;
  attempts: number;
  timeMs: number;
  date: string;
}

export const loadRecords = (): RecordEntry[] => {
  throw new Error('Not implemented');
};

export const sortRecords = (_records: readonly RecordEntry[]): RecordEntry[] => {
  throw new Error('Not implemented');
};

export const saveRecord = (
  _record: RecordEntry,
  _existing: readonly RecordEntry[],
): RecordEntry[] => {
  throw new Error('Not implemented');
};
