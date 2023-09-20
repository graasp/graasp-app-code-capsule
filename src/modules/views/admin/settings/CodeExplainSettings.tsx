import { useEffect, useState } from 'react';

import { Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormLabel,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import { convertJs } from '@graasp/sdk';

import { t } from 'i18next';
import isEqual from 'lodash.isequal';

import { DIFF_VIEW_SETTINGS_NAME } from '@/config/appSettingsTypes';
import {
  ProgrammingLanguagesType,
  programmingLanguageSelect,
} from '@/config/programmingLanguages';
import {
  DIFF_VIEW_LANGUAGE_SELECT_CYPRESS,
  EXPLAIN_MODE_SETTINGS_KEY,
  SETTING_DIFF_VIEW_NEW_CODE_CY,
  SETTING_DIFF_VIEW_OLD_CODE_CY,
} from '@/config/selectors';
import { DEFAULT_DIFF_VIEW_SETTINGS } from '@/config/settings';
import { DiffViewSettingsKeys } from '@/interfaces/settings';
import SubmitButtons from '@/modules/common/settings/SubmitButtons';
import { useSettings } from '@/modules/context/SettingsContext';
import DiffView from '@/modules/diffView/DiffView';
import CustomSelect from '@/modules/layout/CustomSelect';
import CodeEditor from '@/modules/repl/CodeEditor';

const CodeExplainSettings = (): JSX.Element => {
  const {
    [DIFF_VIEW_SETTINGS_NAME]: diffViewSetting = DEFAULT_DIFF_VIEW_SETTINGS,
    saveSettings,
  } = useSettings();
  const [diffViewLocalSetting, setDiffViewLocalSetting] = useState(
    diffViewSetting.toJS(),
  );
  // modal variables
  const [openDiffPreview, setOpenDiffPreview] = useState(false);

  const unsavedDiffViewChanges = !isEqual(
    diffViewLocalSetting,
    diffViewSetting.toJS(),
  );

  // update diffViewLocalSetting value when setting changes
  useEffect(
    () => setDiffViewLocalSetting(diffViewSetting.toJS()),
    [diffViewSetting],
  );

  return (
    <Stack spacing={1}>
      <CustomSelect
        dataCy={DIFF_VIEW_LANGUAGE_SELECT_CYPRESS}
        onChange={(newLanguage: ProgrammingLanguagesType) =>
          setDiffViewLocalSetting((prevSetting) => ({
            ...prevSetting,
            [DiffViewSettingsKeys.Language]: newLanguage,
          }))
        }
        value={diffViewLocalSetting[DiffViewSettingsKeys.Language]}
        label={t('Programming Language')}
        values={programmingLanguageSelect}
      />
      <FormLabel>{t('Line Offset')}</FormLabel>
      <Stack direction="row" justifyContent="space-between" alignItems="end">
        <TextField
          type="number"
          inputProps={{ min: 0 }}
          value={diffViewLocalSetting[DiffViewSettingsKeys.LinesOffset]}
          onChange={({ target }) =>
            setDiffViewLocalSetting((prevSetting) => ({
              ...prevSetting,
              [DiffViewSettingsKeys.LinesOffset]: parseInt(target.value, 10),
            }))
          }
        />
        <Box>
          <Tooltip
            title={
              unsavedDiffViewChanges
                ? t('Save Setting to Preview')
                : t('Show Preview')
            }
          >
            <span>
              <Button
                startIcon={<Visibility />}
                disabled={unsavedDiffViewChanges}
                onClick={() => setOpenDiffPreview(true)}
              >
                {t('Preview')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Stack flex={1} width="50%">
          <FormLabel>{t('Old Code')}</FormLabel>
          <CodeEditor
            id={SETTING_DIFF_VIEW_OLD_CODE_CY}
            languageSupport={[
              diffViewLocalSetting[DiffViewSettingsKeys.Language],
            ]}
            value={diffViewLocalSetting[DiffViewSettingsKeys.OldCode]}
            setValue={(newValue) =>
              setDiffViewLocalSetting((prevSetting) => ({
                ...prevSetting,
                [DiffViewSettingsKeys.OldCode]: newValue,
              }))
            }
          />
        </Stack>
        <Stack flex={1} width="50%">
          <FormLabel>{t('New Code')}</FormLabel>
          <CodeEditor
            id={SETTING_DIFF_VIEW_NEW_CODE_CY}
            languageSupport={[
              diffViewLocalSetting[DiffViewSettingsKeys.Language],
            ]}
            value={diffViewLocalSetting[DiffViewSettingsKeys.NewCode]}
            setValue={(newValue) =>
              setDiffViewLocalSetting((prevSetting) => ({
                ...prevSetting,
                [DiffViewSettingsKeys.NewCode]: newValue,
              }))
            }
          />
        </Stack>
      </Stack>
      <Dialog
        maxWidth="xl"
        fullWidth
        open={openDiffPreview}
        onClose={() => setOpenDiffPreview(false)}
      >
        <DialogContent>
          <DiffView />
        </DialogContent>
      </Dialog>

      <SubmitButtons
        onCancel={() => setDiffViewLocalSetting(diffViewSetting)}
        onSave={() =>
          saveSettings(DIFF_VIEW_SETTINGS_NAME, convertJs(diffViewLocalSetting))
        }
        settingKey={EXPLAIN_MODE_SETTINGS_KEY}
        unsavedChanges={unsavedDiffViewChanges}
      />
    </Stack>
  );
};
export default CodeExplainSettings;
