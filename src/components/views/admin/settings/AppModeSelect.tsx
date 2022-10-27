import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, FormLabel, Stack } from '@mui/material';

import { AppMode } from '../../../../config/appSettingsTypes';
import {
  APP_MODE_COLLABORATE_BUTTON_CY,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
} from '../../../../config/selectors';
import { useAppMode } from '../../../context/AppModeContext';

type RadioButtonProps = {
  value: AppMode;
  label: string;
  dataCy: string;
};

const RadioButton: FC<RadioButtonProps> = ({ dataCy, value, label }) => {
  const radioGroup = useAppMode();

  return (
    <Button
      data-cy={dataCy}
      onClick={() => radioGroup.onChange(value)}
      variant={radioGroup?.appMode === value ? 'contained' : 'outlined'}
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
    <>
      <FormLabel>Choose the Mode</FormLabel>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="start"
        alignItems="stretch"
      >
        <RadioButton
          dataCy={APP_MODE_EXECUTE_BUTTON_CY}
          value={AppMode.Execute}
          label={t('Execute Code')}
        />
        <RadioButton
          dataCy={APP_MODE_REVIEW_BUTTON_CY}
          value={AppMode.Review}
          label={t('Review Code')}
        />
        <RadioButton
          dataCy={APP_MODE_COLLABORATE_BUTTON_CY}
          value={AppMode.Collaborate}
          label={t('Collaborate on Code')}
        />
      </Stack>
    </>
  );
};
export default AppModeSelect;
