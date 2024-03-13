import React from 'react';

import { Box, Modal, styled } from '@mui/material';

import { CodeVersionType } from '@/interfaces/codeVersions';
import Repl from '@/modules/repl/Repl';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  codeVersion: CodeVersionType;
}

const RunView = ({ open, handleClose, codeVersion }: Props): JSX.Element => (
  <Modal open={open} onClose={handleClose}>
    <StyledBox>
      <Repl seedValue={codeVersion} onClose={handleClose} />
    </StyledBox>
  </Modal>
);

export default RunView;
