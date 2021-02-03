import { readFileSync } from 'fs';

import { replaceES6Imports } from './embedES6.js';
import { scssToCss } from './scss.js';

const processor = process.argv[2];
const mainFile = process.argv[3];

const code = readFileSync(mainFile, 'utf8');

let out;
switch (processor) {
  case 'es6':
    out = await replaceES6Imports(code, mainFile);
    break;

  case 'scss':
    out = await scssToCss(code);
    break;

  default:
    console.error('Unknown processor (first argument)');
    process.exit();
}

console.log(`\n${'-'.repeat(20)} original ${'-'.repeat(20)}
${code}

${'-'.repeat(20)}  output  ${'-'.repeat(20)}
${out}`);