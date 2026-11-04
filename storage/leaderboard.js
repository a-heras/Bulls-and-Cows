const STORAGE_KEY = 'bulls-and-cows:records';
const MAX_RECORDS = 10;
const isRecordEntry = (value) => typeof value === 'object' &&
    value !== null &&
    'length' in value &&
    'base' in value &&
    'attempts' in value &&
    'timeMs' in value &&
    'date' in value;
export const loadRecords = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter(isRecordEntry);
    }
    catch {
        return [];
    }
};
export const sortRecords = (records) => [...records].sort((a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs);
export const saveRecord = (record, existing) => {
    const next = sortRecords([...existing, record]).slice(0, MAX_RECORDS);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    catch {
        // storage may be unavailable (private mode, quota) — keep in-memory result
    }
    return next;
};
//# sourceMappingURL=leaderboard.js.map