import React, { FC, MutableRefObject, ReactElement, RefObject } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

type RefType =
  | null
  | MutableRefObject<HTMLElement | undefined>
  | RefObject<HTMLElement | undefined>;

const getPlacedModalStyle = (
  anchor: RefType,
): { [key: string]: string | number } => {
  if (anchor?.current) {
    const { top = 0 } = anchor.current.getBoundingClientRect();
    return {
      position: 'fixed',
      top: top - 50,
    };
  }
  return {};
};

type Props = {
  open: boolean;
  title: string;
  content: ReactElement | string;
  actions?: ReactElement;
  onClose?: () => void;
  dataCy?: string;
  keepMounted?: boolean;
  anchor?: RefType;
};

const CustomDialog: FC<Props> = ({
  open,
  title,
  content,
  actions,
  onClose,
  dataCy,
  keepMounted = true,
  anchor = null,
}) => (
  <Dialog
    keepMounted={keepMounted}
    data-cy={dataCy}
    fullWidth
    open={open}
    onClose={onClose}
    PaperProps={anchor ? { style: getPlacedModalStyle(anchor) } : {}}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>{actions}</DialogActions>
  </Dialog>
);

export default CustomDialog;
