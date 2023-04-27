import React, { FC, useEffect, useRef } from 'react';

import { styled } from '@mui/material';

import { REPL_OUTPUT_CONSOLE_CY } from '../../config/selectors';

const StyledTextArea = styled('textarea')({
  fontFamily: 'monospace',
  width: '100%',
  resize: 'none',
  height: '100%',
  borderWidth: '0px',
  color: 'inherit',
  backgroundColor: 'inherit',
  '&:focus-visible': {
    outline: 'none',
  },
});

type Props = {
  output: string;
};

const OutputConsole: FC<Props> = ({ output }) => {
  const containerRef = useRef<HTMLTextAreaElement | null>(null);

  // scroll in output window to bottom
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [output]);

  return (
    <StyledTextArea
      ref={containerRef}
      data-cy={REPL_OUTPUT_CONSOLE_CY}
      readOnly
      value={output}
    />
  );
};

export default OutputConsole;
