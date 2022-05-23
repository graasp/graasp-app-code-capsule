import { v4 } from 'uuid';
import { AppContext } from '../interfaces/appContext';
import { Database } from '../interfaces/database';
import { GENERAL_SETTINGS_KEY } from '../config/appSettings';
import { DEFAULT_GENERAL_SETTINGS } from '../interfaces/settings';

export const mockContext = {
  permission: 'write',
  context: 'builder',
  itemId: '1234-1234-123456-8123-123456',
};

const buildDatabase = (appContext: Partial<AppContext>): Partial<Database> => ({
  appData: [],
  appActions: [],
  members: [
    {
      id: appContext.memberId || '',
      name: 'mock-member',
    },
  ],
  appSettings: [
    {
      id: v4(),
      name: GENERAL_SETTINGS_KEY,
      data: DEFAULT_GENERAL_SETTINGS,
    },
  ],
});

export default buildDatabase;
