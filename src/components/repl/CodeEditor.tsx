import { FC } from 'react';

import { useTheme } from '@mui/material';

import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

type Props = {
  id: string;
  value: string;
  setValue: (v: string) => void;
};

const CodeEditor: FC<Props> = ({ value, setValue, id }) => {
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
      extensions={[python()]}
    />
  );
};
export default CodeEditor;
