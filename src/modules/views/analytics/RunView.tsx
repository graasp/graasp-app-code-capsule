import React from 'react';

import { Dialog, DialogContent } from '@mui/material';

import { CodeVersionType } from '@/interfaces/codeVersions';
import Repl from '@/modules/repl/Repl';

type Props = {
  open: boolean;
  handleClose: () => void;
  codeVersion: CodeVersionType;
};

const RunView = ({ open, handleClose, codeVersion }: Props): JSX.Element => (
  <Dialog
    open={open}
    onClose={handleClose}
    maxWidth="lg"
    PaperProps={{ sx: { width: '80vw' } }}
  >
    <DialogContent>
      <Repl seedValue={codeVersion} onClose={handleClose} />
    </DialogContent>
  </Dialog>
);

export default RunView;
