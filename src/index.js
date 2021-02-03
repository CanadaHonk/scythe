import { readFileSync } from 'fs';
import { replaceImports as replaceES6Imports } from './embedES6.js';

const mainJSFile = process.argv[2];

const code = readFileSync(mainJSFile, 'utf8');
const out = await replaceES6Imports(code, mainJSFile);

console.log(`\n${'-'.repeat(20)} original ${'-'.repeat(20)}
${code}

${'-'.repeat(20)}  output  ${'-'.repeat(20)}
${out}`);