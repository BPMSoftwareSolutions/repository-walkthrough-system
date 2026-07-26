export interface ObservedMarkdownTable {
  startLine: number;
  endLine: number;
  columnCount: number;
}

export function observesMarkdownTables(text: string): ObservedMarkdownTable[] {
  const lines = text.split(/\r?\n/);
  const tables: ObservedMarkdownTable[] = [];
  for (let index = 1; index < lines.length; index += 1) {
    if (!/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(lines[index])) continue;
    const columnCount = lines[index].split("|").filter((cell) => cell.trim().length > 0).length;
    tables.push({ startLine: index, endLine: index + 1, columnCount });
  }
  return tables;
}
