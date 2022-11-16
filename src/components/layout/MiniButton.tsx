import { FC, ReactElement } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type Props = {
  id?: string;
  dataCy?: string;
  text: string;
  icon: ReactElement;
  disabled?: boolean;
  isLoading?: boolean;
  color?: ButtonProps['color'];
  onClick: () => void;
};

const MiniButton: FC<Props> = ({
  id,
  dataCy,
  text,
  icon,
  disabled = false,
  isLoading = false,
  color = 'primary',
  onClick,
}) => {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

  if (bigScreen) {
    if (isLoading) {
      return (
        <LoadingButton
          loading={isLoading}
          data-cy={dataCy}
          id={id}
          disabled={disabled}
          color={color}
          variant="outlined"
          startIcon={icon}
          onClick={onClick}
        >
          {text}
        </LoadingButton>
      );
    }
    return (
      <Button
        data-cy={dataCy}
        id={id}
        disabled={disabled}
        color={color}
        variant="outlined"
        startIcon={icon}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  }

  return (
    <IconButton
      color={color}
      disabled={disabled || isLoading}
      data-cy={dataCy}
      id={id}
      onClick={onClick}
    >
      {isLoading ? <CircularProgress size={24} /> : icon}
    </IconButton>
  );
};
export default MiniButton;
