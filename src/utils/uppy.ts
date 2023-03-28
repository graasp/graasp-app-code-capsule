import { API_ROUTES } from '@graasp/apps-query-client';
import { MAX_FILE_SIZE } from '@graasp/sdk';

import Uppy, { UploadResult } from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { TFunction } from 'i18next';

import { DATA_FILE_SETTINGS_NAME } from '../config/appSettingsTypes';
import { showErrorToast, showSuccessToast } from './toast';

const { buildUploadAppSettingFilesRoute } = API_ROUTES;

export const SUPPORTED_FORMATS = ['.txt', '.json', '.csv', '.tsv'];

export const dataFileSettingName = (fileName: string): string =>
  `${DATA_FILE_SETTINGS_NAME}-${fileName}`;

export const createUppy = ({
  apiHost,
  itemId,
  token,
  standalone = false,
  onComplete,
  t,
}: {
  apiHost: string;
  itemId: string;
  token: string;
  standalone?: boolean;
  onComplete: (res: UploadResult) => void;
  t: TFunction;
}): Uppy => {
  const uppyInstance = new Uppy({
    restrictions: {
      maxFileSize: MAX_FILE_SIZE,
      allowedFileTypes: SUPPORTED_FORMATS,
    },
    autoProceed: true,
  })
    // endpoint
    .use(XHRUpload, {
      // on standalone flag upload should fail
      endpoint: `${apiHost}/${buildUploadAppSettingFilesRoute(itemId)}`,
      withCredentials: true,
      formData: true,
      allowedMetaFields: ['name'],
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  uppyInstance.on('file-added', (file) => {
    // set name of the settings alongside the file
    showSuccessToast(t('File added'));
    uppyInstance.setFileMeta(file.id, {
      size: file.size,
      name: dataFileSettingName(file.name),
    });
  });

  uppyInstance.on('complete', async (result) => {
    showSuccessToast(t('Upload complete'));
    // run mutation to invalidate app setting key
    onComplete(result);
  });

  uppyInstance.on('error', (error) => {
    if (standalone) {
      showErrorToast(t('This is just a preview. No files can be uploaded.'));
    } else {
      showErrorToast(error);
    }
  });

  uppyInstance.on('upload-error', (_file, _error, response) => {
    if (standalone) {
      showErrorToast(t('This is just a preview. No files can be uploaded.'));
    } else {
      showErrorToast(response?.body);
    }
  });

  uppyInstance.on('restriction-failed', (file, error) => {
    if (standalone) {
      showErrorToast(t('This is just a preview. No files can be uploaded.'));
    } else {
      showErrorToast(error);
    }
  });

  return uppyInstance;
};
