import minimist from 'minimist'
import { readCsv } from './readCsv'
import { Word } from './type'
import fs from 'fs'

const log = async (input = 'KEN_ALL.CSV', outputdir = 'api') => {
  const csv = await readCsv(input)
  const data = csv.reduce((dist, row) => {
    return {
      ...dist,
      [row.code.slice(0, 3)]: {
        ...dist[row.code.slice(0, 3)],
        [row.code.slice(3)]: [
          ...(dist[row.code.slice(0, 3)]?.[row.code.slice(3)] ?? []),
          {
            address1: row.address[0],
            address2: row.address[1],
            ...(row.address[2] ? { address3: row.address[2] } : {})
          }
        ]
      }
    }
  }, {} as Record<string, Record<string, { address1: Word; address2: Word; address3?: Word }[]>>)

  if (!fs.existsSync(outputdir)) {
    fs.mkdirSync(outputdir, { recursive: true })
  }

  Object.keys(data).forEach(prefix => {
    if (!fs.existsSync(`${outputdir}/${prefix}`)) {
      fs.mkdirSync(`${outputdir}/${prefix}`)
    }

    Object.keys(data[prefix]).forEach(postfix => {
      fs.writeFileSync(
        `${outputdir}/${prefix}/${postfix}.json`,
        JSON.stringify(data[prefix][postfix]),
        'utf8'
      )
    })
  })
}

export const run = (args: string[]) => {
  const argv = minimist(args, {
    string: ['version', 'input', 'outputdir'],
    alias: { v: 'version', i: 'input', o: 'outputdir' }
  })

  // eslint-disable-next-line no-unused-expressions
  argv.version !== undefined
    ? console.log(`v${require('../package.json').version}`)
    : log(argv.input, argv.outputdir)
}
