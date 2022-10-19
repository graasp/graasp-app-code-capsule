import { FC } from 'react';

import { useTheme } from '@mui/material';

import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

type Props = { setValue: (v: string) => void };

const CodeEditor: FC<Props> = ({ setValue }) => {
  const theme = useTheme();
  return (
    <CodeMirror
      onChange={(value) => setValue(value)}
      height="100%"
      style={{
        height: '100%',
      }}
      theme={theme.palette.mode}
      basicSetup
      extensions={[python()]}
    />
  );
};
export default CodeEditor;
