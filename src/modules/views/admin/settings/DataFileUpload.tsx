import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add } from '@mui/icons-material';
import { Box, Button, List, Stack, Typography } from '@mui/material';

import { convertJs } from '@graasp/sdk';

import { List as ImmList } from 'immutable';

import {
  DATA_FILE_LIST_SETTINGS_NAME,
  DataFile,
} from '../../../../config/appSettingsTypes';
import { DEFAULT_DATA_FILE_LIST_SETTINGS } from '../../../../config/settings';
import { DataFileListSettingsKeys } from '../../../../interfaces/settings';
import { useSettings } from '../../../context/SettingsContext';
import FileList from './FileList';
import UppyDialog from './UppyDialog';

const DataFileUpload: FC = () => {
  const { t } = useTranslation();
  const [addNewFilesOpen, setAddNewFilesOpen] = useState(false);
  const {
    [DATA_FILE_LIST_SETTINGS_NAME]:
      dataFileListSetting = DEFAULT_DATA_FILE_LIST_SETTINGS,
    dataFileSettings,
    saveSettings,
  } = useSettings();

  const filesMetaData = dataFileListSetting[DataFileListSettingsKeys.Files];

  const handleFileDelete = (appSettingIdToDelete: string): void => {
    saveSettings(
      DATA_FILE_LIST_SETTINGS_NAME,
      convertJs({
        [DataFileListSettingsKeys.Files]: filesMetaData
          .toJS()
          .filter(({ appSettingId }) => appSettingId !== appSettingIdToDelete),
      }),
    );
  };

  const handleFileUpload = (newFileMetaData: DataFile[]): void => {
    const newData = dataFileListSetting.update(
      DataFileListSettingsKeys.Files,
      (list: ImmList<DataFile>) => list.concat(convertJs(newFileMetaData)),
    );
    saveSettings(DATA_FILE_LIST_SETTINGS_NAME, newData);
    // close modal
    setAddNewFilesOpen(false);
  };

  return (
    <Stack direction="column" spacing={1}>
      <Button startIcon={<Add />} onClick={() => setAddNewFilesOpen(true)}>
        {t('Upload Data Files')}
      </Button>
      <Box flex={1} borderColor="info.main" borderRadius={2} border={1}>
        {filesMetaData.size ? (
          <List dense>
            {filesMetaData.map(({ appSettingId, fileName, virtualPath }) => {
              const appSetting = dataFileSettings.find(
                (s) => s.id === appSettingId,
              );
              if (!appSetting) {
                return <p key={appSettingId}>Waiting for settings</p>;
              }
              return (
                <FileList
                  key={appSettingId}
                  appSetting={appSetting}
                  fileName={fileName}
                  virtualPath={virtualPath}
                  onDelete={handleFileDelete}
                />
              );
            })}
          </List>
        ) : (
          <Typography m={1}>{t('No files')}</Typography>
        )}
      </Box>
      {addNewFilesOpen && (
        <UppyDialog
          open={addNewFilesOpen}
          onFinish={handleFileUpload}
          onClose={() => setAddNewFilesOpen(false)}
        />
      )}
    </Stack>
  );
};
export default DataFileUpload;
