import { AppData } from '@graasp/sdk';

import type { Dictionary } from 'lodash';

export const buildCodeRowKey = (
  line: { content: string }[],
  index: number,
): string => `row #${index} ${line.map((l) => l.content).join(' ')}`;

export const sortAppDataFromNewest = <T extends AppData>(appData: T[]): T[] =>
  appData.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

/**
 * Flattens a dictionary of arrays into a single array.
 * @param dict - The dictionary to be flattened.
 * @returns An array containing all the values from the input dictionary.
 */
export function flattenDictionary<T>(dict: Dictionary<T[]>): T[] {
  return Object.values(dict).flatMap((value) => value);
}
