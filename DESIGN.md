# DESIGN.md

## Структуры данных и алгоритмы

**Состояние игры** (`src/core/gameState.ts`) — иммутабельный объект `GameState`:

- `phase: 'settings' | 'playing' | 'result'` — одно поле вместо флагов, исключает невозможные состояния.
- `secret: string` — строка, а не число: `0123` как число стало бы `123` (потерян ведущий ноль).
- `history: readonly GuessEntry[]` — массив, попытки добавляются через `[...state.history, entry]`, не `push`. Порядок ввода важен, старые записи не меняются.

**`evaluateGuess`** (`src/core/evaluateGuess.ts`): нормализуем обе строки к нижнему регистру, считаем bulls через `filter` по совпадению позиций. Затем строим пулы из позиций без bulls и считаем cows через `reduce`: для каждой цифры guess ищем её в пуле secret, нашли — `+1` и удаляем из пула (повторная цифра не считается дважды). HOF вместо `for` — требование задания.

**`countPossibleSecrets`** (`src/core/countPossibleSecrets.ts`): перестановки без повторений, рекурсивно `P(n, b) = b * P(n - 1, b - 1)`, база `P(0, b) = 1`, при `length > base` → `0`. Мемоизация: `Map<string, number>` на уровне модуля, ключ `${length}:${base}`. Проверка `cached !== undefined` — потому что `0` валидный результат.

## Сложность (Big O)

| Функция                | Время            | Обоснование                                                                      |
| ---------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `generateSecret`       | O(length²)       | На каждом шаге рекурсии `filter` копирует пул; `length ≤ base ≤ 16` — константа. |
| `evaluateGuess`        | O(n²)            | `reduce` с `indexOf`/`slice` по пулу; при `n ≤ 6` — константа.                   |
| `isValidGuess`         | O(n)             | Один проход по символам для валидации + один для `Set`.                          |
| `countPossibleSecrets` | O(length) / O(1) | O(length) при первом вызове (глубина рекурсии), O(1) при повторном (кеш).        |

## Принципы чистого кода

- **Чистые функции** — `src/core/*.ts`. `generateSecret(length, base, random)` принимает `random` параметром — тестируется детерминированно.
- **Иммутабельность** — `addGuess` (`[...state.history, entry]`), `generateSecret` (`filter` вместо `splice`), `sortRecords` (`[...records].sort`).
- **HOF** — `evaluateGuess` (`filter`/`reduce`), `isValidGuess` (`every`/`map`), `history.map(renderHistoryEntry)`.
- **Каррирование** — `createDigitValidator(base) => (char) => boolean` (`src/core/digitValidator.ts`), используется в `isValidGuess` и `game.ts` (фильтрация ввода).
- **Мемоизация** — `countPossibleSecrets` (`Map<string, number>`).
- **Рекурсия** — `generateSecret` (`pick`), `countPossibleSecrets` (`countRecursive`).
- **Разделение ответственности** — `core/` (логика без DOM), `storage/` (localStorage), `ui/` (рендер), `main.ts` (оркестрация).
- **Без `innerHTML`** — разметка через `el` (`src/ui/dom.ts`).
- **Обработка ошибок** — `try/catch` в `loadRecords`/`saveRecord`, `throw` в `generateSecret`.
