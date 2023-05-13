import fs from 'fs'
import path from 'path'
import { API_VER, generate } from '../src/generate'

jest.setTimeout(100000)

const readDirRecursive = (dirPath: string): string[] =>
  fs
    .readdirSync(dirPath, { withFileTypes: true })
    .flatMap(file =>
      file.isDirectory()
        ? readDirRecursive(path.join(dirPath, file.name))
        : [path.join(dirPath, file.name)]
    )

describe('cli test', () => {
  const dirPath = 'docs/api'
  afterAll(() => fs.promises.rmdir('_docs', { recursive: true }))

  test('main', async () => {
    await generate(`_${dirPath}`)

    for (const filePath of readDirRecursive(`docs/api/${API_VER}`)) {
      expect(fs.readFileSync(`_${filePath}`, 'utf8')).toBe(
        fs.readFileSync(filePath, 'utf8').replace(/\r/g, '')
      )
    }
  })
})
