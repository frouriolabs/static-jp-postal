import minimist from 'minimist'
import { generate } from './generate'

export const run = (args: string[]) => {
  const argv = minimist(args, {
    string: ['version', 'inputDir', 'outputDir'],
    alias: { v: 'version', i: 'inputDir', o: 'outputDir' }
  })

  argv.version !== undefined
    ? console.log(`v${require('../package.json').version}`)
    : generate(argv.outputDir, argv.inputDir)
}
