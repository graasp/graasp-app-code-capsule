import React, {
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
} from 'react';
import { Button } from '@mui/material';

type Props = {
  dataCy?: string;
  onClick: () => void;
  disabled?: boolean;
};

const ToolbarButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  PropsWithChildren<Props>
> = (props, ref) => {
  const { dataCy, onClick, disabled } = props;
  return (
    <Button
      ref={ref}
      {...props}
      data-cy={dataCy}
      disabled={disabled}
      sx={{
        p: 1,
        minWidth: '0px',
      }}
      variant="outlined"
      size="medium"
      color="primary"
      onClick={onClick}
    />
  );
};

export default forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  ToolbarButton,
);
