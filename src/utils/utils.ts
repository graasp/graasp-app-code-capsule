export const buildCodeRowKey = (
  line: { content: string }[],
  index: number,
): string => `row #${index} ${line.map((l) => l.content).join(' ')}`;
