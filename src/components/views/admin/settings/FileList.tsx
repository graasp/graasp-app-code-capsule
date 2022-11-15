import { FC } from 'react';

import { AppSetting } from '@graasp/apps-query-client';

import { Close, Edit, TextSnippet as FileIcon } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  MUTATION_KEYS,
  hooks,
  useMutation,
} from '../../../../config/queryClient';

type Props = {
  appSetting: AppSetting;
  fileName: string;
  virtualPath: string;
  onDelete: (appSettingIdToDelete: string) => void;
};

const FileList: FC<Props> = ({
  appSetting,
  fileName,
  virtualPath,
  onDelete,
}) => {
  // todo: add a way to set a virtual path
  const {
    data: fileSettings,
    isLoading,
    isSuccess,
  } = hooks.useAppSettingFile({
    appSettingId: appSetting.id,
  });
  const { mutate: deleteAppSettingFile } = useMutation<
    unknown,
    unknown,
    { id: string }
  >(MUTATION_KEYS.DELETE_APP_SETTING);
  if (isLoading || !isSuccess) {
    return <p>Loading</p>;
  }

  // eslint-disable-next-line no-console
  console.log(fileSettings);

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('want to edit');
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              deleteAppSettingFile({ id: appSetting.id });
              onDelete(appSetting.id);
            }}
          >
            <Close />
          </IconButton>
        </>
      }
    >
      <ListItemIcon>
        <FileIcon />
      </ListItemIcon>
      <ListItemText primary={fileName} secondary={virtualPath} />
    </ListItem>
  );
};
export default FileList;
