import { parseArgs } from 'node:util'
import { generate } from './generate'

export const run = (args: string[]) => {
  const { values } = parseArgs({
    args,
    options: {
      version: { type: 'string', short: 'v' },
      inputDir: { type: 'string', short: 'i' },
      outputDir: { type: 'string', short: 'o' }
    }
  })

  values.version !== undefined
    ? console.log(`v${require('../package.json').version}`)
    : generate(values.outputDir, values.inputDir)
}
