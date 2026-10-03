import { parseArgs } from 'node:util';
import { generate } from './generate';

export const run = (args: string[]) => {
  const { values } = parseArgs({
    args,
    options: {
      inputDir: { type: 'string', short: 'i' },
      outputDir: { type: 'string', short: 'o' },
    },
  });

  generate(values.outputDir, values.inputDir);
};
