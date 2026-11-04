import { evaluateGuess } from './core/evaluateGuess.js';
import { generateSecret } from './core/generateSecret.js';
import {
  addGuess,
  createInitialState,
  resetGame,
  startGame,
  type GameSettings,
  type GameState,
} from './core/gameState.js';
import { loadRecords, saveRecord, type RecordEntry } from './storage/leaderboard.js';
import { clear } from './ui/dom.js';
import { renderGame } from './ui/game.js';
import { renderRecords } from './ui/records.js';
import { renderResult } from './ui/result.js';
import { renderSettings } from './ui/settings.js';

const app = document.getElementById('app');

let state: GameState = createInitialState();
let records: RecordEntry[] = loadRecords();
let timerId: number | null = null;
let timeLabel: HTMLElement | null = null;

const stopTimer = (): void => {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  timeLabel = null;
};

const updateTimeLabel = (): void => {
  if (!timeLabel || state.startedAt === null) return;
  const elapsed = Date.now() - state.startedAt;
  const totalSeconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timeLabel.textContent = `Attempts: ${state.history.length} · Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const startTimer = (): void => {
  stopTimer();
  timerId = window.setInterval(updateTimeLabel, 1000);
};

const startRound = (settings: GameSettings): void => {
  const secret = generateSecret(settings.length, settings.base);
  state = startGame(state, settings, secret, Date.now());
  render();
  startTimer();
};

const handleGuess = (guess: string): void => {
  if (state.secret === null || state.settings === null) return;

  const settings = state.settings;
  const result = evaluateGuess(state.secret, guess);
  state = addGuess(state, guess, result);

  if (state.phase === 'result') {
    stopTimer();
    const elapsed =
      state.finishedAt !== null && state.startedAt !== null
        ? state.finishedAt - state.startedAt
        : 0;
    const record: RecordEntry = {
      length: settings.length,
      base: settings.base,
      attempts: state.history.length,
      timeMs: elapsed,
      date: new Date().toISOString(),
    };
    records = saveRecord(record, records);
  }

  render();
};

const handleMenu = (): void => {
  stopTimer();
  state = resetGame(state);
  render();
};

const handlePlayAgain = (): void => {
  if (state.settings === null) return;
  const settings = state.settings;
  stopTimer();
  startRound(settings);
};

const render = (): void => {
  if (!app) return;
  clear(app);
  timeLabel = null;

  if (state.phase === 'settings') {
    app.append(renderSettings({ onStart: startRound }));
    app.append(renderRecords(records));
    return;
  }

  if (state.phase === 'result') {
    app.append(renderResult(state, { onPlayAgain: handlePlayAgain, onMenu: handleMenu }));
    app.append(renderRecords(records));
    return;
  }

  const game = renderGame(state, Date.now(), { onGuess: handleGuess, onMenu: handleMenu });
  timeLabel = game.querySelector<HTMLElement>('[data-role="time"]');
  app.append(game);
};

render();
