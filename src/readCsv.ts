import { parse } from 'csv-parse'
import iconv from 'iconv-lite'
import fs from 'fs'
import type { Row } from './type'

export const readCsv = (input: string) =>
  new Promise<Row[]>(resolve => {
    fs.createReadStream(input)
      .pipe(iconv.decodeStream('Shift_JIS'))
      .pipe(
        parse((_, data: string[][]) => {
          resolve(
            data.map(row => ({
              code: row[2],
              address: [
                { kana: row[3], kanji: row[6] },
                { kana: row[4], kanji: row[7] },
                row[8] === '以下に掲載がない場合' ||
                row[8].endsWith('の次に番地がくる場合') ||
                row[8].endsWith('一円')
                  ? null
                  : { kana: row[5].split('(')[0], kanji: row[8].split('（')[0] }
              ]
            }))
          )
        })
      )
  })
