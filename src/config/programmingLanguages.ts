export const JAVASCRIPT = 'javascript' as const;
export const TYPESCRIPT = 'typescript' as const;
export const TYPESCRIPT_WITH_JSX = 'tsx' as const;
export const JAVA = 'java' as const;
export const PYTHON = 'python' as const;
export const MATLAB = 'matlab' as const;
export const JSON_LANG = 'json' as const;

export const PROGRAMMING_LANGUAGES = [
  JAVASCRIPT,
  TYPESCRIPT,
  JAVA,
  PYTHON,
  MATLAB,
  JSON_LANG,
];

export type ProgrammingLanguagesType =
  `${(typeof PROGRAMMING_LANGUAGES)[number]}`;

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
  [TYPESCRIPT]: {
    label: 'TypeScript',
    tabSize: 2,
  },
  [TYPESCRIPT_WITH_JSX]: {
    label: 'TypeScript (with JSX)',
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
  value: o[0] as ProgrammingLanguagesType,
}));

export const SUPPORTED_EXECUTABLE_LANGUAGES: ProgrammingLanguagesType[] = [
  PYTHON,
];
