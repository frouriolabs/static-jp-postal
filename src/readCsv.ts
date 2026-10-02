import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { parse } from './parse';
import type { Row } from './type';

export const readCsv = async (inputDir: string) => {
  const kenList: Row[] = parse(
    iconv.decode(await fs.promises.readFile(path.join(inputDir, 'KEN_ALL.CSV')), 'Shift_JIS'),
  ).map((row) => ({
    code: row[2],
    address: [
      row[6],
      row[7],
      row[8] === '以下に掲載がない場合' ||
      row[8].endsWith('の次に番地がくる場合') ||
      row[8].endsWith('一円')
        ? null
        : row[8].split('（')[0],
    ],
  }));

  const jigyosyoList: Row[] = parse(
    iconv.decode(await fs.promises.readFile(path.join(inputDir, 'JIGYOSYO.CSV')), 'Shift_JIS'),
  ).map((row) => ({
    code: row[7],
    address: [row[3], row[4], `${row[5]}${row[6]}`],
  }));

  return [...kenList, ...jigyosyoList];
};
