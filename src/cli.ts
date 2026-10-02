import { parseArgs } from 'node:util';
import { generate } from './generate';

export const run = (args: string[]) => {
  const { values } = parseArgs({
    args,
    options: {
      version: { type: 'string', short: 'v' },
      inputDir: { type: 'string', short: 'i' },
      outputDir: { type: 'string', short: 'o' },
    },
  });

  if (values.version !== undefined) {
    console.log(`v${require('../package.json').version}`);
  } else {
    generate(values.outputDir, values.inputDir);
  }
};
