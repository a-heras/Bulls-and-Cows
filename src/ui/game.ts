import { createDigitValidator } from '../core/digitValidator';
import { isValidGuess } from '../core/isValidGuess';
import type { GameSettings, GameState, GuessEntry } from '../core/gameState';
import { el } from './dom';

export interface GameHandlers {
  onGuess: (guess: string) => void;
  onNewGame: () => void;
}

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const renderHistoryEntry = (entry: GuessEntry): HTMLElement =>
  el('li', {
    text: `${entry.guess.toUpperCase()} — bulls: ${entry.result.bulls}, cows: ${entry.result.cows}`,
  });

export const renderGame = (state: GameState, now: number, handlers: GameHandlers): HTMLElement => {
  const settings: GameSettings = state.settings ?? { length: 4, base: 10 };
  const isDigit = createDigitValidator(settings.base);

  const input = el('input', {
    attrs: {
      type: 'text',
      inputmode: 'text',
      autocomplete: 'off',
      maxlength: String(settings.length),
      'aria-label': 'Your guess',
      placeholder: `${settings.length} digits, base ${settings.base}`,
    },
  });

  const errorMessage = el('p', { className: 'hint' });

  input.addEventListener('input', () => {
    const filtered = input.value
      .toLowerCase()
      .split('')
      .filter((char) => isDigit(char))
      .join('')
      .slice(0, settings.length);
    if (input.value !== filtered) input.value = filtered;

    const valid = isValidGuess(filtered, settings.length, settings.base);
    errorMessage.textContent =
      filtered.length === settings.length && !valid
        ? 'Digits must be unique and valid for the selected base'
        : '';
  });

  const submit = (): void => {
    const guess = input.value.toLowerCase();
    if (!isValidGuess(guess, settings.length, settings.base)) {
      errorMessage.textContent = 'Invalid guess';
      return;
    }
    handlers.onGuess(guess);
    input.value = '';
    errorMessage.textContent = '';
  };

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit();
  });

  const submitButton = el('button', {
    text: 'Guess',
    attrs: { type: 'button' },
    on: { click: submit },
  });

  const elapsed = state.startedAt !== null ? now - state.startedAt : 0;
  const isWon = state.phase === 'won';

  const historyList = el('ul', {
    className: 'history',
    children: state.history.map(renderHistoryEntry),
  });

  const newGameButton = el('button', {
    text: 'New game',
    attrs: { type: 'button' },
    on: { click: () => handlers.onNewGame() },
  });

  const controls = isWon
    ? [el('p', { text: `You won in ${state.history.length} attempts!` }), newGameButton]
    : [
        el('div', {
          className: 'row',
          children: [input, submitButton],
        }),
        errorMessage,
      ];

  return el('section', {
    children: [
      el('h2', { text: `Guess the ${settings.length}-digit secret (base ${settings.base})` }),
      el('p', {
        className: 'hint',
        text: `Attempts: ${state.history.length} · Time: ${formatTime(elapsed)}`,
      }),
      ...controls,
      el('h2', { text: 'History' }),
      state.history.length === 0
        ? el('p', { className: 'hint', text: 'No guesses yet' })
        : historyList,
    ],
  });
};
