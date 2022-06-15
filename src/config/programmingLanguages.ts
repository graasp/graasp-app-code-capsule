import { JAVA, JAVASCRIPT, MATLAB, PYTHON } from './constants';

type ProgrammingLanguageSettings = {
  label: string;
  tabSize: number;
};

export const programmingLanguageSettings: {
  [key: string]: ProgrammingLanguageSettings;
} = {
  [JAVASCRIPT]: {
    label: 'JavaScript',
    tabSize: 2,
  },
  [JAVA]: {
    label: 'Java',
    tabSize: 2,
  },
  [MATLAB]: {
    label: 'MATLAB',
    tabSize: 4,
  },
  [PYTHON]: {
    label: 'Python',
    tabSize: 4,
  },
};

export const programmingLanguageSelect = Object.entries(
  programmingLanguageSettings,
).map((o) => ({
  label: o[1].label,
  value: o[0],
}));

export const SUPPORTED_EXECUTABLE_LANGUAGES = [PYTHON];
