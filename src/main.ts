import { el } from './ui/dom';

const app = document.getElementById('app');
if (app) {
  app.append(el('h1', { text: 'Bulls and Cows' }));
}
