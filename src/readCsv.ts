import { parse } from 'csv-parse'
import iconv from 'iconv-lite'
import fs from 'fs'
import path from 'path'
import type { Row } from './type'

export const readCsv = async (inputDir: string) => {
  const kenList = await new Promise<Row[]>(resolve => {
    fs.createReadStream(path.join(inputDir, 'KEN_ALL.CSV'))
      .pipe(iconv.decodeStream('Shift_JIS'))
      .pipe(
        parse((_, data: string[][]) => {
          resolve(
            data.map(row => ({
              code: row[2],
              address: [
                row[6],
                row[7],
                row[8] === '以下に掲載がない場合' ||
                row[8].endsWith('の次に番地がくる場合') ||
                row[8].endsWith('一円')
                  ? null
                  : row[8].split('（')[0]
              ]
            }))
          )
        })
      )
  })

  const jigyosyoList = await new Promise<Row[]>(resolve => {
    fs.createReadStream(path.join(inputDir, 'JIGYOSYO.CSV'))
      .pipe(iconv.decodeStream('Shift_JIS'))
      .pipe(
        parse((_, data: string[][]) => {
          resolve(
            data.map(row => ({
              code: row[7],
              address: [row[3], row[4], `${row[5]}${row[6]}`]
            }))
          )
        })
      )
  })

  return [...kenList, ...jigyosyoList]
}
