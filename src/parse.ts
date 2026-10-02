export const parse = (csv: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i]

    if (char === '"') {
      if (quoted && csv[i + 1] === '"') {
        field += '"'
        i++
      } else {
        quoted = !quoted
      }
    } else if (!quoted && char === ',') {
      row.push(field)
      field = ''
    } else if (!quoted && (char === '\r' || char === '\n')) {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      if (char === '\r' && csv[i + 1] === '\n') i++
    } else {
      field += char
    }
  }

  if (row.length || field || csv.endsWith('"')) {
    row.push(field)
    rows.push(row)
  }

  return rows
}
