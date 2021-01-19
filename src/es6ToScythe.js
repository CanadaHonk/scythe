import { join, sep } from 'path';

const importReplacing = /import (.*) from (.*)/g;

async function replaceAsync(str, regex, asyncFn) { // https://stackoverflow.com/a/48032528
  const promises = [];
  str.replace(regex, (match, ...args) => {
      const promise = asyncFn(match, ...args);
      promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export const replaceImports = async (code, pathToCodeFile) => {
  const chdir = pathToCodeFile.split(sep).slice(0, -1).join(sep);

  return await replaceAsync(code, importReplacing, async (_full, uImports, uLocalPath) => {
    const localPath = uLocalPath.match(/['"](.*)['"]/)[1];
    const fullPath = join(chdir, localPath);

    const mod = await import(join(process.cwd(), fullPath));

    const imports = uImports.match(/[A-Za-z0-9]*(,)?/g).filter((val, ind, arr) => val.length !== 0 && arr.indexOf(val) == ind);

    let codeToAdd = '';

    for (const i of imports) {
      const moduleFn = mod[i];
      console.log(i, moduleFn.toString());

      codeToAdd += `const ${i} = ${moduleFn.toString()};`;
    }

    console.log(_full, `${' '.repeat(5)}->${' '.repeat(5)}`, codeToAdd);

    return codeToAdd;
  });
};