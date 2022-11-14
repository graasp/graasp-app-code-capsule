import { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppSetting,
  TokenContext,
  useLocalContext,
} from '@graasp/apps-query-client';

import { Box, List, Stack, TextField } from '@mui/material';

import { UploadResult } from '@uppy/core';
import '@uppy/drag-drop/dist/style.css';
import { DragDrop, useUppy } from '@uppy/react';

import { DATA_FILE_LIST_SETTINGS_NAME } from '../../../../config/appSettingsTypes';
import { MUTATION_KEYS, useMutation } from '../../../../config/queryClient';
import { DEFAULT_DATA_FILE_LIST_SETTINGS } from '../../../../config/settings';
import { DataFileListSettingsKeys } from '../../../../interfaces/settings';
import { createUppy, dataFileSettingName } from '../../../../utils/uppy';
import { useSettings } from '../../../context/SettingsContext';
import FileList from './FileList';

const DataFileUpload: FC = () => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const apiHost = context?.get('apiHost');
  const itemId = context?.get('itemId');
  const standalone = context?.get('standalone');
  const token = useContext(TokenContext);
  const [filePath, setFilePath] = useState('');
  const {
    [DATA_FILE_LIST_SETTINGS_NAME]:
      dataFileListSetting = DEFAULT_DATA_FILE_LIST_SETTINGS,
    dataFileSettings,
    saveSettings,
  } = useSettings();
  const { mutate: onFileUploadComplete } = useMutation(
    MUTATION_KEYS.APP_SETTING_FILE_UPLOAD,
  );

  const handleFileDelete = (appSettingIdToDelete: string): void => {
    saveSettings(DATA_FILE_LIST_SETTINGS_NAME, {
      [DataFileListSettingsKeys.Files]: dataFileListSetting[
        DataFileListSettingsKeys.Files
      ].filter(({ appSettingId }) => appSettingId !== appSettingIdToDelete),
    });
  };

  const onComplete = (res: UploadResult): void => {
    const result = res.successful;
    if (result) {
      // eslint-disable-next-line no-console
      console.log(result);
      // tell query-client that the file was uploaded
      onFileUploadComplete();
      const fileInfos: {
        name: string;
        responseBody: AppSetting;
      }[] = result
        .filter(({ response }) => response)
        .map(({ name, response }) => ({
          name,
          responseBody: response?.body[0] as AppSetting,
        }));
      // eslint-disable-next-line no-console
      console.log('file infos', fileInfos);

      // todo: update setting listing dataFileSetting names
      saveSettings(DATA_FILE_LIST_SETTINGS_NAME, {
        [DataFileListSettingsKeys.Files]: [
          ...dataFileListSetting[DataFileListSettingsKeys.Files],
          // map new files to an object
          ...fileInfos.map((f) => ({
            appSettingId: f.responseBody.id,
            settingName: dataFileSettingName(f.name),
            virtualPath: f.name,
          })),
        ],
      });
    }
  };

  // hook to instantiate Uppy
  const uppy = useUppy(() =>
    createUppy({ apiHost, itemId, token, standalone, onComplete, t }),
  );

  return (
    <Stack direction="column" spacing={1}>
      <TextField
        value={filePath}
        onChange={({ target: { value } }: { target: { value: string } }) =>
          setFilePath(value)
        }
      />
      <Stack direction="row">
        <Box flex={1}>
          <DragDrop height="200px" uppy={uppy} />
        </Box>
        <Box flex={1}>
          <List dense>
            {dataFileListSetting[DataFileListSettingsKeys.Files].map(
              ({ settingName, virtualPath }) => {
                // eslint-disable-next-line no-console
                console.log(dataFileSettings.toJS());
                const appSetting = dataFileSettings.find(
                  (s) => s.name === settingName,
                );
                // eslint-disable-next-line no-console
                console.log(settingName);
                if (!appSetting) {
                  return <p key={settingName}>Waiting for settings</p>;
                }
                return (
                  <FileList
                    key={settingName}
                    appSetting={appSetting}
                    settingName={settingName}
                    virtualPath={virtualPath}
                    onDelete={handleFileDelete}
                  />
                );
              },
            )}
          </List>
        </Box>
      </Stack>
    </Stack>
  );
};
export default DataFileUpload;
