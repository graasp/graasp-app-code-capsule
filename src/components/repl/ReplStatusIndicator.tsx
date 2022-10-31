import { FC } from 'react';

import { PyodideStatus } from '@graasp/pyodide';

import { Check, Edit, ErrorOutline, HourglassEmpty } from '@mui/icons-material';
import { Paper, Typography, useMediaQuery, useTheme } from '@mui/material';

import { REPL_STATUS_INDICATOR_CY } from '../../config/selectors';

type Props = {
  status: PyodideStatus;
};

const ReplStatusIndicator: FC<Props> = ({ status }) => {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  let style;
  let Icon = ErrorOutline;
  switch (status) {
    case PyodideStatus.READY:
      style = {
        borderColor: 'success.main',
        color: 'success.main',
      };
      Icon = Check;
      break;
    case PyodideStatus.LOADING_PYODIDE:
    case PyodideStatus.LOADING_MODULE:
    case PyodideStatus.INSTALLING:
    case PyodideStatus.RUNNING:
      style = {
        borderColor: 'warning.main',
        color: 'warning.main',
      };
      Icon = HourglassEmpty;
      break;
    case PyodideStatus.ERROR:
    case PyodideStatus.TIMEOUT:
      style = {
        borderColor: 'error.main',
        color: 'error.main',
      };
      Icon = ErrorOutline;
      break;
    case PyodideStatus.WAIT_INPUT:
      style = {
        borderColor: 'info.main',
        color: 'info.main',
      };
      Icon = Edit;
      break;
    case PyodideStatus.UNKNOWN_STATUS:
      break;
    default:
      break;
  }
  if (bigScreen) {
    return (
      <Paper
        data-cy={REPL_STATUS_INDICATOR_CY}
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 1,
          ...style,
        }}
        variant="outlined"
      >
        {Icon && <Icon />}
        <Typography variant="button">{status}</Typography>
      </Paper>
    );
  }
  return (
    <Icon
      data-cy={REPL_STATUS_INDICATOR_CY}
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: style?.color,
      }}
    />
  );
};

export default ReplStatusIndicator;
