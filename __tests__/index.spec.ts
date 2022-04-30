import fs from 'fs'
import { parseAll, parseAllWithKana } from '../src'

test('parse', () => {
  expect(JSON.stringify(parseAll(), null, 2)).toBe(fs.readFileSync('__tests__/all.json', 'utf8'))
  expect(JSON.stringify(parseAllWithKana(), null, 2)).toBe(
    fs.readFileSync('__tests__/allWithKana.json', 'utf8')
  )
})
