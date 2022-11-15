import { FC, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppSetting,
  TokenContext,
  useLocalContext,
} from '@graasp/apps-query-client';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { UploadResult } from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { DragDrop, useUppy } from '@uppy/react';

import { DataFile } from '../../../../config/appSettingsTypes';
import { MUTATION_KEYS, useMutation } from '../../../../config/queryClient';
import { SUPPORTED_FORMATS, createUppy } from '../../../../utils/uppy';

type Props = {
  open: boolean;
  onFinish: (data: DataFile[]) => void;
  onClose: () => void;
};

const UppyDialog: FC<Props> = ({ open, onFinish, onClose }) => {
  const { t } = useTranslation();
  const context = useLocalContext();
  const apiHost = context?.get('apiHost');
  const itemId = context?.get('itemId');
  const standalone = context?.get('standalone');
  const token = useContext(TokenContext);

  const { mutate: onFileUploadComplete } = useMutation<
    unknown,
    unknown,
    { id: string; data: unknown }
  >(MUTATION_KEYS.APP_SETTING_FILE_UPLOAD);

  const onComplete = (res: UploadResult): void => {
    const result = res.successful;
    if (result) {
      const fileInfos: {
        name: string;
        responseBody: AppSetting;
      }[] = result
        .filter(({ response }) => response)
        .map(({ name, response }) => ({
          name,
          responseBody: response?.body[0] as AppSetting,
        }));

      // tell query-client that the file was uploaded
      onFileUploadComplete({
        id: itemId,
        data: result.map(({ response }) => response?.body?.[0]).filter(Boolean),
      });

      const fileData = [
        // map new files to an object
        ...fileInfos.map((f) => ({
          appSettingId: f.responseBody.id,
          fileName: f.name,
          virtualPath: f.name,
        })),
      ];
      onFinish(fileData);
    }
  };
  // hook to instantiate Uppy
  const uppy = useUppy(() =>
    createUppy({ apiHost, itemId, token, standalone, onComplete, t }),
  );

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle>{t('Upload Data Files')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('Supported formats', { formats: SUPPORTED_FORMATS.join(', ') })}
        </DialogContentText>
        <DragDrop height="200px" width="100%" uppy={uppy} />
      </DialogContent>
    </Dialog>
  );
};
export default UppyDialog;
