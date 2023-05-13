import fs from 'fs'
import path from 'path'
import { readCsv } from './readCsv'

export const API_VER = 'v0.2'

export const generate = async (outputDir = 'api', inputDir = path.join(__dirname, '../assets')) => {
  const csv = await readCsv(inputDir)
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
  }, {} as Record<string, Record<string, { pref: string; address1: string; address2?: string }[]>>)

  const baseDir = path.join(outputDir, API_VER)

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  } else if (fs.readdirSync(baseDir).length) {
    console.log(
      `fatal: destination path '${baseDir}' already exists and is not an empty directory.`
    )
    return
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
