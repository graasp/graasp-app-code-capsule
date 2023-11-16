import { AppData } from '@graasp/sdk';

export const buildCodeRowKey = (
  line: { content: string }[],
  index: number,
): string => `row #${index} ${line.map((l) => l.content).join(' ')}`;

export const sortAppDataFromNewest = <T extends AppData>(appData: T[]): T[] =>
  appData.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

// TODO: move it to SDK ?
// TODO: check if it is better to return a Map ?
export class GroupBy {
  public static toRecord<T, K extends string | number | symbol>(
    list: T[],
    getKey: (item: T) => K,
  ): Record<K, T[]> {
    return list.reduce(
      (acc, item) => {
        const key = getKey(item);

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(item);

        return acc;
      },
      {} as Record<K, T[]>,
    );
  }

  public static toMap<T, K>(list: T[], getKey: (item: T) => K): Map<K, T[]> {
    return list.reduce((entryMap, e) => {
      const key = getKey(e);
      return entryMap.set(key, [...(entryMap.get(key) || []), e]);
    }, new Map());
  }
}

// TODO: export this too ?
export function flattenMap<K, V>(map: Map<K, V>): V[] {
  return Array.from(map.values()).flatMap((value) => value);
}
