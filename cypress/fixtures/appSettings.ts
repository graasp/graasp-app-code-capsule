import { v4 } from 'uuid';

import { GENERAL_SETTINGS_KEY } from '../../src/config/appSettingsTypes';
import { DEFAULT_GENERAL_SETTINGS } from '../../src/config/settings';

export const MOCK_CODE_SAMPLE = `# my sample code in python

age = input('What is your age ?')
print(f'Your age is {age}')

# ask another question
print('wait a bit')
''' and here starts a
multiline comment 
that continues here also
'''
for i in range(10000):
    pass

print('Done!')
print('See you !')
`;

export const MOCK_GENERAL_SETTINGS = {
  id: v4(),
  name: GENERAL_SETTINGS_KEY,
  data: {
    ...DEFAULT_GENERAL_SETTINGS,
    code: MOCK_CODE_SAMPLE,
  },
};
export const MOCK_APP_SETTINGS = [
  {
    id: v4(),
    name: GENERAL_SETTINGS_KEY,
    data: {
      ...DEFAULT_GENERAL_SETTINGS,
      code: MOCK_CODE_SAMPLE,
    },
  },
];
