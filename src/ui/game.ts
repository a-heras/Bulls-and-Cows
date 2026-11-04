import { createDigitValidator } from '../core/digitValidator.js';
import { isValidGuess } from '../core/isValidGuess.js';
import type { GameSettings, GameState, GuessEntry } from '../core/gameState.js';
import { formatTime } from './format.js';
import { el } from './dom.js';

export type GameHandlers = {
  onGuess: (guess: string) => void;
  onMenu: () => void;
};

const renderHistoryEntry = (entry: GuessEntry): HTMLElement =>
  el('li', {
    children: [
      el('span', { className: 'guess-text', text: entry.guess.toUpperCase() }),
      el('span', {
        className: 'badge bulls',
        text: `${entry.result.bulls} bulls`,
      }),
      el('span', {
        className: 'badge cows',
        text: `${entry.result.cows} cows`,
      }),
    ],
  });

export const renderGame = (state: GameState, now: number, handlers: GameHandlers): HTMLElement => {
  const settings: GameSettings = state.settings ?? { length: 4, base: 10 };
  const isDigit = createDigitValidator(settings.base);

  let currentGuess = '';

  const cellsRow = el('div', {
    className: 'cells',
    attrs: { role: 'group', 'aria-label': 'Your guess' },
  });

  const renderCells = (): void => {
    cellsRow.replaceChildren(
      ...Array.from({ length: settings.length }, (_, index) => {
        const char = currentGuess[index] ?? '';
        const isActive = index === currentGuess.length;
        return el('span', {
          className: `cell${char ? ' filled' : ''}${isActive ? ' active' : ''}`,
          text: char.toUpperCase(),
        });
      }),
    );
  };

  const hiddenInput = el('input', {
    className: 'hidden-input',
    attrs: {
      type: 'text',
      inputmode: 'text',
      autocomplete: 'off',
      'aria-label': 'Type your guess',
    },
  });

  const errorMessage = el('p', { className: 'hint' });

  const setMessage = (text: string, isError: boolean): void => {
    errorMessage.textContent = text;
    errorMessage.className = isError ? 'error' : 'hint';
    if (isError) {
      cellsRow.classList.add('shake');
      window.setTimeout(() => cellsRow.classList.remove('shake'), 320);
    }
  };

  const syncFromHidden = (): void => {
    currentGuess = hiddenInput.value
      .toLowerCase()
      .split('')
      .filter((char) => isDigit(char))
      .join('')
      .slice(0, settings.length);
    hiddenInput.value = currentGuess;
    renderCells();

    const valid = isValidGuess(currentGuess, settings.length, settings.base);
    if (currentGuess.length === settings.length && !valid) {
      setMessage('Digits must be unique and valid for the selected base', true);
    } else {
      setMessage('', false);
    }
  };

  hiddenInput.addEventListener('input', syncFromHidden);

  const submit = (): void => {
    if (!isValidGuess(currentGuess, settings.length, settings.base)) {
      setMessage('Invalid guess', true);
      return;
    }
    handlers.onGuess(currentGuess);
    currentGuess = '';
    hiddenInput.value = '';
    renderCells();
    setMessage('', false);
  };

  hiddenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit();
  });

  cellsRow.addEventListener('click', () => hiddenInput.focus());

  const submitButton = el('button', {
    text: 'Guess',
    attrs: { type: 'button' },
    on: { click: submit },
  });

  const elapsed = state.startedAt !== null ? now - state.startedAt : 0;

  const historyList = el('ul', {
    className: 'history',
    children: state.history.map(renderHistoryEntry),
  });

  const menuButton = el('button', {
    text: 'Menu',
    attrs: { type: 'button' },
    className: 'ghost',
    on: { click: () => handlers.onMenu() },
  });

  const section = el('section', {
    children: [
      el('div', {
        className: 'game-header',
        children: [
          el('h2', { text: `Guess the ${settings.length}-digit secret (base ${settings.base})` }),
          menuButton,
        ],
      }),
      el('p', {
        className: 'hint',
        text: `Attempts: ${state.history.length} · Time: ${formatTime(elapsed)}`,
        attrs: { 'data-role': 'time' },
      }),
      el('div', {
        className: 'cells-wrap',
        children: [cellsRow, hiddenInput],
      }),
      errorMessage,
      el('div', { className: 'row', children: [submitButton] }),
      el('h2', { text: 'History' }),
      state.history.length === 0
        ? el('div', {
            className: 'empty',
            children: [
              el('div', { className: 'empty-icon', text: '🎯' }),
              el('p', { className: 'hint', text: 'No guesses yet — make your first try!' }),
            ],
          })
        : historyList,
    ],
  });

  renderCells();
  window.setTimeout(() => hiddenInput.focus(), 0);
  return section;
};
