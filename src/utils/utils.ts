import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

export const buildCodeRowKey = (
  line: { content: string }[],
  index: number,
): string => `row #${index} ${line.map((l) => l.content).join(' ')}`;

export const sortAppDataFromNewest = <T extends AppDataRecord>(
  appData: List<T>,
): List<T> => appData.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
