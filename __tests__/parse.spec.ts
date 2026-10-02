import { parse } from '../src/parse';

describe('parse', () => {
  test('reads quoted fields, commas, escaped quotes and empty fields', () => {
    expect(parse('001,"東京都","町,丁目","施設""名",,""\r\n')).toEqual([
      ['001', '東京都', '町,丁目', '施設"名', '', ''],
    ]);
  });

  test('preserves line breaks inside quoted fields', () => {
    expect(parse('"一行目\r\n二行目",123\r\n')).toEqual([['一行目\r\n二行目', '123']]);
  });

  test('reads LF and CRLF records with or without a final line break', () => {
    expect(parse('a,b\nc,d\r\ne,')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
      ['e', ''],
    ]);
    expect(parse('a,b\n')).toEqual([['a', 'b']]);
    expect(parse('')).toEqual([]);
    expect(parse('""')).toEqual([['']]);
  });
});
