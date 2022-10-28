import { FC } from 'react';

import { PyodideStatus } from '@graasp/pyodide';

import { Check, Edit, ErrorOutline, HourglassEmpty } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';

import { REPL_STATUS_INDICATOR_CY } from '../../config/selectors';

type Props = {
  status: PyodideStatus;
};

const ReplStatusIndicator: FC<Props> = ({ status }) => {
  let style;
  let icon;
  switch (status) {
    case PyodideStatus.READY:
      style = {
        borderColor: 'success.main',
        color: 'success.main',
      };
      icon = <Check />;
      break;
    case PyodideStatus.LOADING_PYODIDE:
    case PyodideStatus.LOADING_MODULE:
    case PyodideStatus.INSTALLING:
    case PyodideStatus.RUNNING:
      style = {
        borderColor: 'warning.main',
        color: 'warning.main',
      };
      icon = <HourglassEmpty />;
      break;
    case PyodideStatus.ERROR:
    case PyodideStatus.TIMEOUT:
      style = {
        borderColor: 'error.main',
        color: 'error.main',
      };
      icon = <ErrorOutline />;
      break;
    case PyodideStatus.WAIT_INPUT:
      style = {
        borderColor: 'info.main',
        color: 'info.main',
      };
      icon = <Edit />;
      break;
    case PyodideStatus.UNKNOWN_STATUS:
      break;
    default:
      break;
  }

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
      {icon}
      <Typography variant="button">{status}</Typography>
    </Paper>
  );
};

export default ReplStatusIndicator;
