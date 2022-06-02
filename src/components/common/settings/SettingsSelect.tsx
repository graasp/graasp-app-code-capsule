import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC } from 'react';
import { useSettings } from '../../context/SettingsContext';

type Prop = {
  settingsKey: string;
  label: string;
  values: { value: string; label: string }[];
  dataCy?: string;
};

const SettingsSelect: FC<Prop> = ({ settingsKey, label, values, dataCy }) => {
  const { settings, changeSetting } = useSettings();
  const value = settings[settingsKey] as string;

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        data-cy={dataCy}
        label={label}
        value={value}
        onChange={({ target }) => changeSetting(settingsKey, target.value)}
      >
        {values.map((v) => (
          <MenuItem key={v.value} value={v.value}>
            {v.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SettingsSelect;