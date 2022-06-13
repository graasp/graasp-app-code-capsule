import React, { FC, PropsWithChildren } from 'react';
import { Button } from '@mui/material';

type Props = {
  dataCy?: string;
  onClick: () => void;
};

const ToolbarButton: FC<PropsWithChildren<Props>> = ({
  children,
  onClick,
  dataCy,
}) => (
  <Button
    data-cy={dataCy}
    sx={{
      p: 1,
      minWidth: '0px',
    }}
    variant="outlined"
    size="medium"
    color="primary"
    onClick={onClick}
  >
    {children}
  </Button>
);

export default ToolbarButton;
