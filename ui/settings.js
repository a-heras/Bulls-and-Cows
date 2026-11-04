import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import { el } from './dom.js';
const BASES = [
    { id: 'bin', label: 'Binary (2)', value: 2 },
    { id: 'oct', label: 'Octal (8)', value: 8 },
    { id: 'dec', label: 'Decimal (10)', value: 10 },
    { id: 'hex', label: 'Hex (16)', value: 16 },
];
const LENGTHS = [2, 3, 4, 5, 6];
export const renderSettings = (handlers) => {
    let selectedBase = 10;
    let selectedLength = 4;
    const baseSelect = el('select', {
        attrs: { 'aria-label': 'Numeral system' },
        children: BASES.map((base) => el('option', {
            text: base.label,
            attrs: {
                value: String(base.value),
                ...(base.value === selectedBase ? { selected: '' } : {}),
            },
        })),
    });
    const lengthSelect = el('select', {
        attrs: { 'aria-label': 'Secret length' },
        children: LENGTHS.map((length) => el('option', {
            text: String(length),
            attrs: { value: String(length), ...(length === selectedLength ? { selected: '' } : {}) },
        })),
    });
    baseSelect.value = String(selectedBase);
    lengthSelect.value = String(selectedLength);
    const possibleHint = el('p', { className: 'hint' });
    const updateLengthAvailability = () => {
        for (const option of Array.from(lengthSelect.options)) {
            const length = Number(option.value);
            option.disabled = length > selectedBase;
        }
        if (selectedLength > selectedBase) {
            selectedLength = selectedBase;
        }
        lengthSelect.value = String(selectedLength);
        possibleHint.textContent = `Possible secrets: ${countPossibleSecrets(selectedLength, selectedBase)}`;
    };
    baseSelect.addEventListener('change', () => {
        selectedBase = Number(baseSelect.value);
        updateLengthAvailability();
    });
    lengthSelect.addEventListener('change', () => {
        selectedLength = Number(lengthSelect.value);
        updateLengthAvailability();
    });
    updateLengthAvailability();
    const startButton = el('button', {
        text: 'Start game',
        attrs: { type: 'button' },
        on: {
            click: () => handlers.onStart({ length: selectedLength, base: selectedBase }),
        },
    });
    return el('section', {
        children: [
            el('h1', { text: 'Bulls and Cows' }),
            el('div', {
                className: 'row',
                children: [
                    el('label', {
                        children: [el('span', { text: 'Numeral system' }), baseSelect],
                    }),
                    el('label', {
                        children: [el('span', { text: 'Secret length' }), lengthSelect],
                    }),
                ],
            }),
            possibleHint,
            startButton,
        ],
    });
};
//# sourceMappingURL=settings.js.map