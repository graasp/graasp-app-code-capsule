import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppSetting,
  TokenContext,
  useLocalContext,
} from '@graasp/apps-query-client';

import { Box, List, Stack } from '@mui/material';

import { UploadResult } from '@uppy/core';
import '@uppy/drag-drop/dist/style.css';
import { DragDrop, useUppy } from '@uppy/react';

import { DATA_FILE_LIST_SETTINGS_NAME } from '../../../../config/appSettingsTypes';
import { MUTATION_KEYS, useMutation } from '../../../../config/queryClient';
import { DEFAULT_DATA_FILE_LIST_SETTINGS } from '../../../../config/settings';
import { DataFileListSettingsKeys } from '../../../../interfaces/settings';
import { createUppy } from '../../../../utils/uppy';
import { useSettings } from '../../../context/SettingsContext';
import FileList from './FileList';

const DataFileUpload: FC = () => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const apiHost = context?.get('apiHost');
  const itemId = context?.get('itemId');
  const standalone = context?.get('standalone');
  const token = useContext(TokenContext);
  const {
    [DATA_FILE_LIST_SETTINGS_NAME]:
      dataFileListSetting = DEFAULT_DATA_FILE_LIST_SETTINGS,
    dataFileSettings,
    saveSettings,
  } = useSettings();
  const { mutate: onFileUploadComplete } = useMutation(
    MUTATION_KEYS.APP_SETTING_FILE_UPLOAD,
  );

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
            fileName: f.name,
            virtualPath: f.name,
          })),
        ],
      });
    }
  };
  // todo: reset uppy to allow
  // hook to instantiate Uppy
  const uppy = useUppy(() =>
    createUppy({ apiHost, itemId, token, standalone, onComplete, t }),
  );

  const handleFileDelete = (appSettingIdToDelete: string): void => {
    const filesMetaData = dataFileListSetting[DataFileListSettingsKeys.Files];
    const fileToDelete = filesMetaData.find(
      ({ appSettingId }) => appSettingId !== appSettingIdToDelete,
    );
    saveSettings(DATA_FILE_LIST_SETTINGS_NAME, {
      [DataFileListSettingsKeys.Files]: filesMetaData.filter(
        ({ appSettingId }) => appSettingId !== appSettingIdToDelete,
      ),
    });
    // tell uppy that we removed this file -> so we can re-upload it

    const uppyFiles = { ...uppy.getState().files };
    const newFiles = Object.fromEntries(
      Object.entries(uppyFiles).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([key, value]) => value.name !== fileToDelete?.fileName,
      ),
    );

    uppy.setState({ files: newFiles });
  };

  return (
    <Stack direction="row" spacing={2}>
      <Box flex={1}>
        <DragDrop height="200px" uppy={uppy} />
      </Box>
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
    </Stack>
  );
};
export default DataFileUpload;
