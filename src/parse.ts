import type * as Types from './type'

const parseKana = (kana: string): { pref: string; kanaList: [string, string][] } => {
  const { length } = kana
  let pref = ''
  let city = ''
  let town = ''
  const kanaList: [string, string][] = []
  let mode: 'pref' | 'city' | 'town' = 'pref'

  for (let i = 0; i < length; i += 1) {
    const t = kana.charAt(i)

    switch (mode) {
      case 'pref':
        if (t === '\n') {
          mode = 'city'
        } else {
          pref += t
        }
        break
      case 'city':
        if (t === ',') {
          mode = 'town'
          if (i === length - 1) {
            kanaList.push([city, ''])
          }
        } else {
          city += t
        }
        break
      case 'town':
        if (t === ',') {
          kanaList.push([city, town])
          town = ''
        } else if (t === '\n') {
          kanaList.push([city, town])
          town = ''
          city = ''
          mode = 'city'
        } else {
          town += t
        }
        break
    }
  }

  return { pref, kanaList }
}

const parseData = (
  data: string,
  kana?: string
): (Types.DataRow & Partial<Types.KanaRow & Types.TownData & Types.TownKana>)[] => {
  const kanaData = kana ? parseKana(kana) : undefined
  const { length } = data
  let pref = ''
  let city = ''
  let code = ''
  let town = ''
  const rows: (Types.DataRow & Partial<Types.KanaRow & Types.TownData & Types.TownKana>)[] = []
  let mode: 'pref' | 'city' | 'code' | 'town' = 'pref'

  for (let count = 0; count < length; count += 1) {
    const t = data.charAt(count)

    switch (mode) {
      case 'pref':
        if (t === '\n') {
          mode = 'city'
        } else {
          pref += t
        }
        break
      case 'city':
        if (/^[0-9]$/.test(t)) {
          code = t
          mode = 'code'
        } else {
          city += t
        }
        break
      case 'code':
        if (!/^[0-9]$/.test(t)) {
          if (t === '\n') {
            city = ''
            mode = 'city'
          } else {
            code = `00${code}`.slice(-7)
            if (t === ',') {
              rows.push({
                code,
                pref,
                city,
                ...(kanaData && {
                  prefKana: kanaData.pref,
                  cityKana: kanaData.kanaList[rows.length][0]
                })
              })
              code = ''
            } else {
              town = t
              mode = 'town'
            }
          }
        } else {
          code += t
        }
        break
      case 'town':
        if (/^[0-9\n]$/.test(t)) {
          rows.push({
            code,
            pref,
            city,
            town,
            ...(kanaData && {
              prefKana: kanaData.pref,
              cityKana: kanaData.kanaList[rows.length][0],
              townKana: kanaData.kanaList[rows.length][1]
            })
          })
          if (t === '\n') {
            town = ''
            city = ''
            mode = 'city'
          } else {
            code = t
            mode = 'code'
          }
        } else {
          town += t
        }
        break
    }
  }

  return rows
}

function parse(data: Types.Data): (Types.DataRow & Partial<Types.TownData>)[]
function parse<T>(
  data: Types.Data & T,
  kana: Types.Kana & T
): (Types.DataRow &
  Types.KanaRow &
  ({ town?: undefined; townKana?: undefined } | (Types.TownData & Types.TownKana)))[]
function parse<T>(
  data: Types.Data & T,
  kana?: Types.Kana & T
): (Types.DataRow & Partial<Types.KanaRow & Types.TownData & Types.TownKana>)[] {
  return parseData(data, kana)
}

export { parse }
