import { evaluateGuess } from './core/evaluateGuess.js';
import { generateSecret } from './core/generateSecret.js';
import { addGuess, createInitialState, resetGame, startGame, } from './core/gameState.js';
import { loadRecords, saveRecord } from './storage/leaderboard.js';
import { clear } from './ui/dom.js';
import { renderGame } from './ui/game.js';
import { renderRecords } from './ui/records.js';
import { renderResult } from './ui/result.js';
import { renderSettings } from './ui/settings.js';
const app = document.getElementById('app');
let state = createInitialState();
let records = loadRecords();
let timerId = null;
let timeLabel = null;
const stopTimer = () => {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }
    timeLabel = null;
};
const updateTimeLabel = () => {
    if (!timeLabel || state.startedAt === null)
        return;
    const elapsed = Date.now() - state.startedAt;
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timeLabel.textContent = `Attempts: ${state.history.length} · Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const startTimer = () => {
    stopTimer();
    timerId = window.setInterval(updateTimeLabel, 1000);
};
const startRound = (settings) => {
    const secret = generateSecret(settings.length, settings.base);
    state = startGame(state, settings, secret, Date.now());
    render();
    startTimer();
};
const handleGuess = (guess) => {
    if (state.secret === null || state.settings === null)
        return;
    const settings = state.settings;
    const result = evaluateGuess(state.secret, guess);
    state = addGuess(state, guess, result);
    if (state.phase === 'result') {
        stopTimer();
        const elapsed = state.finishedAt !== null && state.startedAt !== null
            ? state.finishedAt - state.startedAt
            : 0;
        const record = {
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
const handleMenu = () => {
    stopTimer();
    state = resetGame(state);
    render();
};
const handlePlayAgain = () => {
    if (state.settings === null)
        return;
    const settings = state.settings;
    stopTimer();
    startRound(settings);
};
const render = () => {
    if (!app)
        return;
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
    timeLabel = game.querySelector('[data-role="time"]');
    app.append(game);
};
render();
//# sourceMappingURL=main.js.map