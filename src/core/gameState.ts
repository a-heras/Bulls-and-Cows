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

export const createInitialState = (): GameState => {
  throw new Error('Not implemented');
};

export const startGame = (
  _state: GameState,
  _settings: GameSettings,
  _secret: string,
  _now: number,
): GameState => {
  throw new Error('Not implemented');
};

export const addGuess = (_state: GameState, _guess: string, _result: GuessResult): GameState => {
  throw new Error('Not implemented');
};

export const resetGame = (_state: GameState): GameState => {
  throw new Error('Not implemented');
};
