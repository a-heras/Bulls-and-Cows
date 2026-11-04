const memo = new Map();
const keyOf = (length, base) => `${length}:${base}`;
const countRecursive = (length, base) => {
    if (length < 0 || length > base)
        return 0;
    if (length === 0)
        return 1;
    return base * countRecursive(length - 1, base - 1);
};
export const countPossibleSecrets = (length, base) => {
    const key = keyOf(length, base);
    const cached = memo.get(key);
    if (cached !== undefined)
        return cached;
    const result = countRecursive(length, base);
    memo.set(key, result);
    return result;
};
//# sourceMappingURL=countPossibleSecrets.js.map