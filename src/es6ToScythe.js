import { SSL_OP_MICROSOFT_SESS_ID_BUG } from 'constants';
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
    if (!uLocalPath.includes('/')) {
      return _full;
    }

    const localPath = uLocalPath.match(/['"](.*)['"]/)[1];
    const fullPath = join(chdir, localPath);

    const mod = await import(join(process.cwd(), fullPath));

    const importAllMatch = uImports.match(/\* as (.*)/);

    let imports = !uImports.includes('{') ?
      importAllMatch ? [] :
      ['default'] :
      uImports.match(/[^{} ]*(,)?/g).filter((val, ind, arr) => val.length !== 0 && arr.indexOf(val) == ind);

    const importsToSplice = [];

    imports = imports.map((val, ind) => {
      if (ind > 1 && imports[ind - 1] == 'as') {
        const moduleName = imports[ind - 2];
        const importedName = val;

        console.log({moduleName, importedName});

        importsToSplice.push(ind - 2);

        return [moduleName, importedName];
      }

      return val;
    });

    for (const toSplice of importsToSplice) {
      imports.splice(toSplice - 3, 2);
    }

    console.log(imports);

    let codeToAdd = '';

    if (importAllMatch) {
      // const modAsObj = {};
      codeToAdd += `const ${importAllMatch[1]} = {`;

      for (const key of Object.keys(mod)) {
        codeToAdd += `'${key}': ${mod[key].toString()},`;
        // modAsObj[key] = mod[key];
      }

      codeToAdd += '};';

      // console.log(modAsObj);

      // codeToAdd += `const ${importAllMatch[1]} = {}`
    }

    for (const i of imports) {
      const isAsImport = Array.isArray(i);

      const moduleFn = mod[isAsImport ? i[0] : i];
      // console.log(i, moduleFn.toString());

      codeToAdd += `const ${isAsImport ? i[1] : i === 'default' ? uImports : i} = ${moduleFn.toString()};`;
    }

    // console.log(_full, `->`, codeToAdd);

    return codeToAdd;
  });
};