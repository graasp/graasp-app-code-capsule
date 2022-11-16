import { FC } from 'react';

import CustomSelect from '../../layout/CustomSelect';

type Prop = {
  settingsKey: string;
  value: string;
  label: string;
  values: { value: string; label: string }[];
  dataCy?: string;
  changeSetting: (settingsKey: string, newSetting: string) => void;
};

const SettingsSelect: FC<Prop> = ({
  settingsKey,
  value,
  label,
  values,
  dataCy,
  changeSetting,
}) => (
  <CustomSelect
    dataCy={dataCy}
    label={label}
    value={value}
    values={values}
    onChange={(newSetting: string) => changeSetting(settingsKey, newSetting)}
  />
);

export default SettingsSelect;
