import { FC, ReactElement } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

type Props = {
  open: boolean;
  title: string;
  content: ReactElement | string;
  actions?: ReactElement;
  onClose?: () => void;
  dataCy?: string;
  keepMounted?: boolean;
};

const CustomDialog: FC<Props> = ({
  open,
  title,
  content,
  actions,
  onClose,
  dataCy,
  keepMounted = true,
}) => (
  <Dialog
    keepMounted={keepMounted}
    data-cy={dataCy}
    fullWidth
    open={open}
    onClose={onClose}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>{actions}</DialogActions>
  </Dialog>
);

export default CustomDialog;
