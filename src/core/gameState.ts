export interface GameSettings {
  length: number;
  base: number;
}

export interface GuessResult {
  bulls: number;
  cows: number;
}

export interface GuessEntry {
  guess: string;
  result: GuessResult;
}

export type GamePhase = 'settings' | 'playing' | 'won';

export interface GameState {
  phase: GamePhase;
  settings: GameSettings | null;
  secret: string | null;
  history: readonly GuessEntry[];
  startedAt: number | null;
}

export const createInitialState = (): GameState => ({
  phase: 'settings',
  settings: null,
  secret: null,
  history: [],
  startedAt: null,
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
    phase: isWon ? 'won' : state.phase,
    history,
  };
};

export const resetGame = (_state: GameState): GameState => createInitialState();
