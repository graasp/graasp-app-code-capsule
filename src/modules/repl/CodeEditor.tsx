import { useTheme } from '@mui/material';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

import {
  JAVA,
  JAVASCRIPT,
  JSON_LANG,
  MATLAB,
  PYTHON,
  TYPESCRIPT,
  TYPESCRIPT_WITH_JSX,
} from '@/config/programmingLanguages';

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
      basicSetup
      extensions={languageSupport.map((k) => SUPPORTED_LANGUAGES[k])}
    />
  );
};
export default CodeEditor;
