import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });

const html = await readFile('index.html', 'utf8');
const patched = html.replace('dist/main.js', 'main.js');
await writeFile('dist/index.html', patched);

await copyFile('styles.css', 'dist/styles.css');
console.log('Assets copied to dist/ (index.html patched)');
