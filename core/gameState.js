export const createInitialState = () => ({
    phase: 'settings',
    settings: null,
    secret: null,
    history: [],
    startedAt: null,
    finishedAt: null,
});
export const startGame = (_state, settings, secret, now) => ({
    phase: 'playing',
    settings,
    secret,
    history: [],
    startedAt: now,
    finishedAt: null,
});
export const addGuess = (state, guess, result) => {
    const normalizedGuess = guess.toLowerCase();
    const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);
    if (isDuplicate)
        return state;
    const entry = { guess: normalizedGuess, result };
    const history = [...state.history, entry];
    const isWon = state.settings !== null && result.bulls === state.settings.length;
    return {
        ...state,
        phase: isWon ? 'result' : state.phase,
        history,
        finishedAt: isWon ? Date.now() : state.finishedAt,
    };
};
export const resetGame = (_state) => createInitialState();
//# sourceMappingURL=gameState.js.map