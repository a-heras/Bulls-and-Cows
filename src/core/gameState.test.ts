import { describe, expect, it } from 'vitest';
import {
  addGuess,
  createInitialState,
  resetGame,
  startGame,
  type GameSettings,
} from './gameState.js';

const settings: GameSettings = { length: 4, base: 10 };

describe('gameState', () => {
  describe('createInitialState', () => {
    it('starts in settings phase with empty history', () => {
      const state = createInitialState();
      expect(state.phase).toBe('settings');
      expect(state.history).toEqual([]);
      expect(state.secret).toBeNull();
      expect(state.settings).toBeNull();
      expect(state.startedAt).toBeNull();
      expect(state.finishedAt).toBeNull();
    });
  });

  describe('startGame', () => {
    it('moves to playing phase and stores settings, secret and start time', () => {
      const state = startGame(createInitialState(), settings, '1234', 1000);
      expect(state.phase).toBe('playing');
      expect(state.settings).toEqual(settings);
      expect(state.secret).toBe('1234');
      expect(state.startedAt).toBe(1000);
      expect(state.finishedAt).toBeNull();
      expect(state.history).toEqual([]);
    });

    it('does not mutate the previous state', () => {
      const initial = createInitialState();
      startGame(initial, settings, '1234', 1000);
      expect(initial.phase).toBe('settings');
      expect(initial.secret).toBeNull();
    });
  });

  describe('addGuess', () => {
    it('appends a guess entry immutably', () => {
      const playing = startGame(createInitialState(), settings, '1234', 0);
      const next = addGuess(playing, '5678', { bulls: 0, cows: 0 });

      expect(next.history).toHaveLength(1);
      expect(next.history[0]).toEqual({ guess: '5678', result: { bulls: 0, cows: 0 } });
      expect(playing.history).toHaveLength(0);
    });

    it('creates a new history array instead of mutating the old one', () => {
      const playing = startGame(createInitialState(), settings, '1234', 0);
      const first = addGuess(playing, '5678', { bulls: 0, cows: 0 });
      const second = addGuess(first, '1234', { bulls: 4, cows: 0 });

      expect(second.history).not.toBe(first.history);
      expect(first.history).toHaveLength(1);
      expect(second.history).toHaveLength(2);
    });

    it('does not add a duplicate guess to history', () => {
      const playing = startGame(createInitialState(), settings, '1234', 0);
      const first = addGuess(playing, '5678', { bulls: 0, cows: 0 });
      const second = addGuess(first, '5678', { bulls: 0, cows: 0 });

      expect(second).toBe(first);
      expect(second.history).toHaveLength(1);
    });

    it('moves to result phase when bulls equal length', () => {
      const playing = startGame(createInitialState(), settings, '1234', 0);
      const next = addGuess(playing, '1234', { bulls: 4, cows: 0 });

      expect(next.phase).toBe('result');
      expect(next.finishedAt).not.toBeNull();
    });

    it('stays in playing phase when guess is not winning', () => {
      const playing = startGame(createInitialState(), settings, '1234', 0);
      const next = addGuess(playing, '5678', { bulls: 0, cows: 0 });

      expect(next.phase).toBe('playing');
      expect(next.finishedAt).toBeNull();
    });
  });

  describe('resetGame', () => {
    it('returns to settings phase and clears game data', () => {
      const playing = startGame(createInitialState(), settings, '1234', 0);
      const reset = resetGame(playing);

      expect(reset.phase).toBe('settings');
      expect(reset.secret).toBeNull();
      expect(reset.settings).toBeNull();
      expect(reset.history).toEqual([]);
      expect(reset.startedAt).toBeNull();
      expect(reset.finishedAt).toBeNull();
    });
  });
});
