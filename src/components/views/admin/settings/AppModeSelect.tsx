import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, FormLabel, Stack } from '@mui/material';

import {
  AppMode,
  AppModeProvider,
  useAppMode,
} from '../../../context/AppModeContext';

type RadioButtonProps = {
  value: AppMode;
  label: string;
};

const RadioButton: FC<RadioButtonProps> = ({ value, label }) => {
  const radioGroup = useAppMode();

  return (
    <Button
      onClick={() => radioGroup.onChange(value)}
      variant={radioGroup?.value === value ? 'contained' : 'outlined'}
    >
      {label}
    </Button>
  );
};

type Props = {
  // appMode: AppMode;
  // setMode: (mode: AppMode) => void;
};

const AppModeSelect: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <AppModeProvider>
      <FormLabel>Choose the Mode</FormLabel>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="start"
        alignItems="stretch"
      >
        <RadioButton value={AppMode.Execute} label={t('Execute Code')} />
        <RadioButton value={AppMode.Review} label={t('Review Code')} />
        <RadioButton
          value={AppMode.Collaborate}
          label={t('Collaborate on Code')}
        />
      </Stack>
    </AppModeProvider>
  );
};
export default AppModeSelect;
