export type Word = { kana: string; kanji: string }
export type Row = { code: string; address: [Word, Word, Word | null] }
