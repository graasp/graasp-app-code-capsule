import { FC } from 'react';

import { useSettings } from '../../context/SettingsContext';
import CustomSelect from '../../layout/CustomSelect';

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
    <CustomSelect
      dataCy={dataCy}
      label={label}
      value={value}
      values={values}
      onChange={(newSetting: string) => changeSetting(settingsKey, newSetting)}
    />
  );
};

export default SettingsSelect;
