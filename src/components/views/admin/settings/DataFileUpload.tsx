import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, List, Stack } from '@mui/material';

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

  const handleFileDelete = (appSettingIdToDelete: string): void => {
    const filesMetaData = dataFileListSetting[DataFileListSettingsKeys.Files];

    saveSettings(DATA_FILE_LIST_SETTINGS_NAME, {
      [DataFileListSettingsKeys.Files]: filesMetaData.filter(
        ({ appSettingId }) => appSettingId !== appSettingIdToDelete,
      ),
    });
  };

  const handleFileUpload = (fileMetaData: DataFile[]): void => {
    saveSettings(DATA_FILE_LIST_SETTINGS_NAME, {
      [DataFileListSettingsKeys.Files]: [
        ...dataFileListSetting[DataFileListSettingsKeys.Files],
        ...fileMetaData,
      ],
    });
    // close modal
    setAddNewFilesOpen(false);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={() => setAddNewFilesOpen(true)}>
        {t('Upload Data Files')}
      </Button>
      <Box flex={1} borderColor="info.main" borderRadius={2} border={1}>
        <List dense>
          {dataFileListSetting[DataFileListSettingsKeys.Files].map(
            ({ appSettingId, fileName, virtualPath }) => {
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
            },
          )}
        </List>
      </Box>
      <UppyDialog open={addNewFilesOpen} onFinish={handleFileUpload} />
    </Stack>
  );
};
export default DataFileUpload;
