import fs from 'fs';
import path from 'path';
import { expect, test } from 'vitest';
import { API_VER, generate } from '../src/generate';

const readDirRecursive = (dirPath: string): string[] =>
  fs
    .readdirSync(dirPath, { withFileTypes: true })
    .flatMap((file) =>
      file.isDirectory()
        ? readDirRecursive(path.join(dirPath, file.name))
        : [path.join(dirPath, file.name)],
    );

test('generate', async () => {
  const dirPath = 'docs/api';
  await generate(`_${dirPath}`);

  for (const filePath of readDirRecursive(`${dirPath}/${API_VER}`)) {
    expect(fs.readFileSync(`_${filePath}`, 'utf8')).toBe(
      fs.readFileSync(filePath, 'utf8').replace(/\r/g, ''),
    );
  }

  await fs.promises.rm('_docs', { recursive: true });
}, 300000);
