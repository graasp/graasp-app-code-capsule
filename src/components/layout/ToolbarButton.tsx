import React, { FC, PropsWithChildren } from 'react';
import { Button } from '@mui/material';

type Props = { onClick: () => void };

const ToolbarButton: FC<PropsWithChildren<Props>> = ({ children, onClick }) => (
  <Button
    sx={{ p: 1, minWidth: '0px' }}
    variant="outlined"
    size="medium"
    color="primary"
    onClick={onClick}
  >
    {children}
  </Button>
);

export default ToolbarButton;
