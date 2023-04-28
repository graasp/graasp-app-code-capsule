import { useTheme } from '@mui/material';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

import { GENERAL_SETTINGS_NAME } from '@/config/appSettingsTypes';
import {
  JAVA,
  JAVASCRIPT,
  JSON_LANG,
  MATLAB,
  PYTHON,
  TYPESCRIPT,
  TYPESCRIPT_WITH_JSX,
} from '@/config/programmingLanguages';
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_SHOW_LINE_NUMBERS_SETTING,
} from '@/config/settings';
import { GeneralSettingsKeys } from '@/interfaces/settings';

import { useSettings } from '../context/SettingsContext';

const DEFAULT_LANGUAGE = 'text' as const;

const SUPPORTED_LANGUAGES = {
  [DEFAULT_LANGUAGE]: markdown(),
  [PYTHON]: python(),
  [JAVA]: java(),
  [MATLAB]: cpp(),
  [JSON_LANG]: json(),
  [JAVASCRIPT]: javascript(),
  [TYPESCRIPT]: javascript({ typescript: true }),
  [TYPESCRIPT_WITH_JSX]: javascript({ jsx: true, typescript: true }),
};

type Props = {
  id: string;
  value: string;
  setValue: (v: string) => void;
  languageSupport?: (keyof typeof SUPPORTED_LANGUAGES)[];
};
const CodeEditor = ({
  value,
  setValue,
  id,
  languageSupport = [DEFAULT_LANGUAGE],
}: Props): JSX.Element => {
  // Define and get the value of ShowLineNumber from what the user has set from the App settings.
  const { [GENERAL_SETTINGS_NAME]: settings = DEFAULT_GENERAL_SETTINGS } =
    useSettings();
  const showLineNumbers =
    settings[GeneralSettingsKeys.ShowLineNumbers] ??
    DEFAULT_SHOW_LINE_NUMBERS_SETTING;
  const theme = useTheme();
  return (
    <CodeMirror
      id={id}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      height="100%"
      width="100%"
      style={{
        // used to stretch the editor when it does not fill the entire height
        height: '100%',
        width: '100%',
      }}
      theme={theme.palette.mode}
      // Control the visibility of lines' numbers using "lineNumbers" option from "basicSetup" prop.
      basicSetup={{ lineNumbers: showLineNumbers }}
      extensions={languageSupport.map((k) => SUPPORTED_LANGUAGES[k])}
    />
  );
};
export default CodeEditor;
