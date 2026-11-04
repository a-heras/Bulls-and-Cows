import type { GameState } from '../core/gameState.js';
import { formatTime } from './format.js';
import { el } from './dom.js';

export type ResultHandlers = {
  onPlayAgain: () => void;
  onMenu: () => void;
};

const CONFETTI_COLORS = ['#6366f1', '#34d399', '#fbbf24', '#f472b6', '#60a5fa'];

const createConfetti = (): HTMLElement => {
  const container = el('div', { className: 'confetti', attrs: { 'aria-hidden': 'true' } });
  for (let i = 0; i < 40; i += 1) {
    const piece = el('span', { className: 'confetti-piece' });
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#6366f1';
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    container.append(piece);
  }
  window.setTimeout(() => container.remove(), 5000);
  return container;
};

export const renderResult = (state: GameState, handlers: ResultHandlers): HTMLElement => {
  const elapsed =
    state.startedAt !== null && state.finishedAt !== null ? state.finishedAt - state.startedAt : 0;

  const settings = state.settings ?? { length: 4, base: 10 };

  if (!document.querySelector('.confetti')) {
    document.body.append(createConfetti());
  }

  return el('section', {
    children: [
      el('h2', { text: 'You won!' }),
      el('p', {
        className: 'hint',
        text: `Secret: ${(state.secret ?? '').toUpperCase()} · ${settings.length} digits · base ${settings.base}`,
      }),
      el('div', {
        className: 'result-stats',
        children: [
          el('div', {
            className: 'stat',
            children: [
              el('span', { text: String(state.history.length) }),
              el('small', { text: 'attempts' }),
            ],
          }),
          el('div', {
            className: 'stat',
            children: [el('span', { text: formatTime(elapsed) }), el('small', { text: 'time' })],
          }),
        ],
      }),
      el('div', {
        className: 'row',
        children: [
          el('button', {
            text: 'Play again',
            attrs: { type: 'button' },
            on: { click: () => handlers.onPlayAgain() },
          }),
          el('button', {
            text: 'Menu',
            attrs: { type: 'button' },
            className: 'ghost',
            on: { click: () => handlers.onMenu() },
          }),
        ],
      }),
    ],
  });
};
