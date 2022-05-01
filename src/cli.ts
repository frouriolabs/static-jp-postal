import minimist from 'minimist'
import { readCsv } from './readCsv'
import { Word } from './type'
import fs from 'fs'
import path from 'path'

const API_VER = 'v0.1'

const generate = async (
  input = path.join(__dirname, '../assets/KEN_ALL.CSV'),
  outputDir = 'api'
) => {
  const csv = await readCsv(input)
  const data = csv.reduce((dist, row) => {
    return {
      ...dist,
      [row.code.slice(0, 3)]: {
        ...dist[row.code.slice(0, 3)],
        [row.code.slice(3)]: [
          ...(dist[row.code.slice(0, 3)]?.[row.code.slice(3)] ?? []),
          {
            pref: row.address[0],
            address1: row.address[1],
            ...(row.address[2] ? { address2: row.address[2] } : {})
          }
        ]
      }
    }
  }, {} as Record<string, Record<string, { pref: Word; address1: Word; address2?: Word }[]>>)

  const baseDir = path.join(outputDir, API_VER)

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  Object.keys(data).forEach(head => {
    if (!fs.existsSync(`${baseDir}/${head}`)) {
      fs.mkdirSync(`${baseDir}/${head}`)
    }

    Object.keys(data[head]).forEach(postfix => {
      fs.writeFileSync(
        `${baseDir}/${head}/${postfix}.json`,
        JSON.stringify(data[head][postfix]),
        'utf8'
      )
    })
  })
}

export const run = (args: string[]) => {
  const argv = minimist(args, {
    string: ['version', 'input', 'outputDir'],
    alias: { v: 'version', i: 'input', o: 'outputDir' }
  })

  // eslint-disable-next-line no-unused-expressions
  argv.version !== undefined
    ? console.log(`v${require('../package.json').version}`)
    : generate(argv.input, argv.outputDir)
}
