import { readFileSync } from 'fs';
import { replaceImports as replaceES6Imports } from './es6ToScythe.js';

const mainJSFile = process.argv[2];

const code = readFileSync(mainJSFile, 'utf8');
const out = await replaceES6Imports(code, mainJSFile);

console.log(`\n\n${code}`, `\n\n${out}`);