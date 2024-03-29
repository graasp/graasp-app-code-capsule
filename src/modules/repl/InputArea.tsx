import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { styled } from '@mui/material';

import { DEFAULT_REPL_INPUT_VALUE } from '../../config/constants';
import { REPL_OUTPUT_CONSOLE_CY } from '../../config/selectors';

const StyledTextArea = styled('textarea')({
  fontFamily: 'monospace',
  width: '100%',
  resize: 'none',
  height: 'auto',
  borderWidth: '0px',
  color: 'inherit',
  backgroundColor: 'inherit',
  '&:focus-visible': {
    outline: 'none',
  },
});

type Props = {
  prompt: string;
  readOnly: boolean;
  onValidate: (input: string) => void;
  onCancel: () => void;
};

const InputArea: FC<Props> = ({ prompt, readOnly, onValidate, onCancel }) => {
  const [input, setInput] = useState(DEFAULT_REPL_INPUT_VALUE);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInput(DEFAULT_REPL_INPUT_VALUE);
    if (inputRef?.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;

      inputRef.current.focus();
      inputRef.current.setSelectionRange(prompt.length, prompt.length);
    }
  }, [prompt, readOnly]);

  // scroll in output window to bottom
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [prompt]);

  const onChangeInput = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const newInput = event.target.value.slice(prompt.length);
    setInput(newInput);
  };

  const onKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter') {
      onValidate(input);
      setInput(DEFAULT_REPL_INPUT_VALUE);
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'c') {
      setInput(DEFAULT_REPL_INPUT_VALUE);
      onCancel();
      event.preventDefault();
    }
  };

  return (
    <div ref={containerRef} style={{ overflowY: 'scroll', width: '100%' }}>
      <StyledTextArea
        data-cy={REPL_OUTPUT_CONSOLE_CY}
        readOnly={readOnly}
        ref={inputRef}
        onChange={onChangeInput}
        onKeyDown={onKeyPress}
        value={`${prompt}${input}`}
      />
    </div>
  );
};

export default InputArea;
