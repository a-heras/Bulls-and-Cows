import { formatTime } from './format.js';
import { el } from './dom.js';
const MEDALS = ['🥇', '🥈', '🥉'];
export const renderRecords = (records) => {
    const items = records.map((record, index) => el('li', {
        children: [
            el('span', { className: 'record-medal', text: MEDALS[index] ?? `${index + 1}.` }),
            el('span', {
                className: 'record-main',
                children: [
                    el('span', { text: `${record.attempts} attempts · ${formatTime(record.timeMs)}` }),
                ],
            }),
            el('span', {
                className: 'badge',
                text: `len ${record.length} · base ${record.base}`,
            }),
        ],
    }));
    return el('section', {
        children: [
            el('h2', { text: 'Top records' }),
            records.length === 0
                ? el('div', {
                    className: 'empty',
                    children: [
                        el('div', { className: 'empty-icon', text: '🏆' }),
                        el('p', { className: 'hint', text: 'No records yet — win a game to appear here!' }),
                    ],
                })
                : el('ul', { className: 'records', children: items }),
        ],
    });
};
//# sourceMappingURL=records.js.map