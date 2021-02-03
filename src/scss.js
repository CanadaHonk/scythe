const variableReplacing = /\$(.*): (.*);\n*/g;

export const scssToCss = async (scss) => {
  let out = scss;

  const variables = [];

  out = out.replace(variableReplacing, (_, name, value) => {
    variables.push([name.trim(), value.trim()]);
    return '';
  });

  for (const v of variables) {
    console.log(v);
    out = out.replace(new RegExp(`\\$${v[0]}`, 'g'), v[1]);
  }

  return out;
};