export type GameSettings = {
  length: number;
  base: number;
};

export type GuessResult = {
  bulls: number;
  cows: number;
};

export type GuessEntry = {
  guess: string;
  result: GuessResult;
};

export type GamePhase = 'settings' | 'playing' | 'result';

export type GameState = {
  phase: GamePhase;
  settings: GameSettings | null;
  secret: string | null;
  history: readonly GuessEntry[];
  startedAt: number | null;
  finishedAt: number | null;
};

export const createInitialState = (): GameState => ({
  phase: 'settings',
  settings: null,
  secret: null,
  history: [],
  startedAt: null,
  finishedAt: null,
});

export const startGame = (
  _state: GameState,
  settings: GameSettings,
  secret: string,
  now: number,
): GameState => ({
  phase: 'playing',
  settings,
  secret,
  history: [],
  startedAt: now,
  finishedAt: null,
});

export const addGuess = (state: GameState, guess: string, result: GuessResult): GameState => {
  const normalizedGuess = guess.toLowerCase();
  const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);
  if (isDuplicate) return state;

  const entry: GuessEntry = { guess: normalizedGuess, result };
  const history = [...state.history, entry];
  const isWon = state.settings !== null && result.bulls === state.settings.length;

  return {
    ...state,
    phase: isWon ? 'result' : state.phase,
    history,
    finishedAt: isWon ? Date.now() : state.finishedAt,
  };
};

export const resetGame = (_state: GameState): GameState => createInitialState();
