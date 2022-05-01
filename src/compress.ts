import fs from 'fs'
import { readCsv } from './readCsv'
import type { Row } from './type'

const compress = (rows: Row[]) => {
  const results: {
    pref: string
    kana: string
    cities: { city: string; kana: string; codes: { code: number; town?: [string, string] }[] }[]
  }[] = []
  rows.forEach(({ code, address }) => {
    const pref = address[0].kanji
    const prefKana = address[0].kana
    const city = address[1].kanji
    const cityKana = address[1].kana

    let prefObj = results.find(r => r.pref === pref)
    if (!prefObj) {
      prefObj = { pref, kana: prefKana, cities: [] }
      results.push(prefObj)
    }

    let cityObj = prefObj.cities.find(c => c.city === city && c.kana === cityKana)
    if (!cityObj) {
      cityObj = { city, kana: cityKana, codes: [] }
      prefObj.cities.push(cityObj)
    }

    cityObj.codes.push(
      address[2] ? { code: +code, town: [address[2].kanji, address[2].kana] } : { code: +code }
    )
  })

  return results.map(pref => {
    const textArr = [pref.pref]
    const kanaArr = [pref.kana]
    pref.cities.forEach(city => {
      let text = city.city
      const tmpArr: string[] = []
      tmpArr.push(city.kana)
      city.codes.forEach(code => {
        text += code.town ? `${code.code}${code.town[0]}` : `${code.code},`
        tmpArr.push(code.town?.[1] ?? '')
      })
      textArr.push(text)
      kanaArr.push(tmpArr.join(','))
    })
    return { text: textArr.join('\n'), kana: kanaArr.join('\n') }
  })
}

;(async () => {
  if (!fs.existsSync('src/data')) fs.mkdirSync('src/data')

  const csv = await readCsv('assets/KEN_ALL.CSV')
  const { data, kana } = compress(csv).reduce(
    (dict, { text, kana }, i) => ({
      data: [...dict.data, `export const DATA${i} = \`${text}\` as Types.Data${i}`],
      kana: [...dict.kana, `export const KANA${i} = \`${kana}\` as Types.Kana${i}`]
    }),
    { data: [] as string[], kana: [] as string[] }
  )
  console.log(Buffer.byteLength(data.join('') + kana.join(''), 'utf8'))
  fs.writeFileSync(
    `src/data/data.ts`,
    `import type * as Types from '../type'

${data.join('\n\n')}\n`,
    'utf8'
  )
  fs.writeFileSync(
    `src/data/kana.ts`,
    `import type * as Types from '../type'

${kana.join('\n\n')}\n`,
    'utf8'
  )
})()
