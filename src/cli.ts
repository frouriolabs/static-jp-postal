import minimist from 'minimist'
import { generate } from './generate'

export const run = (args: string[]) => {
  const argv = minimist(args, {
    string: ['version', 'input', 'outputDir'],
    alias: { v: 'version', i: 'input', o: 'outputDir' }
  })

  // eslint-disable-next-line no-unused-expressions
  argv.version !== undefined
    ? console.log(`v${require('../package.json').version}`)
    : generate(argv.outputDir, argv.input)
}
