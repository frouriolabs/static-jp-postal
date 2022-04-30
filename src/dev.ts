import fs from 'fs'
import { parseAll, parseAllWithKana } from '.'

fs.writeFileSync('__tests__/all.json', JSON.stringify(parseAll(), null, 2), 'utf8')
fs.writeFileSync('__tests__/allWithKana.json', JSON.stringify(parseAllWithKana(), null, 2), 'utf8')
