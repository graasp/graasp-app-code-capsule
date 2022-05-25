import React, { FC } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { useSettings } from '../../context/SettingsContext';

type Props = {
  settingKey: string;
  label: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  disabled?: boolean;
  dataCy?: string;
};

const SettingsSwitch: FC<Props> = ({
  settingKey,
  label,
  labelPlacement = 'end',
  disabled = false,
  dataCy,
}) => {
  const { settings, changeSetting } = useSettings();
  const value = settings[settingKey] as boolean;
  const switchControl = (
    <Switch
      color="primary"
      checked={value}
      onChange={({ target }) => changeSetting(settingKey, target.checked)}
      disabled={disabled}
      data-cy={dataCy}
    />
  );
  return (
    <FormControlLabel
      control={switchControl}
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default SettingsSwitch;
