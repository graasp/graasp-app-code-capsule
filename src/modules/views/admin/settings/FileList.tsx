import { FC } from 'react';

import { Close, TextSnippet as FileIcon } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { AppSetting } from '@graasp/sdk';

import { hooks, mutations } from '../../../../config/queryClient';

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
  // todo: use the file content when showing a preview
  const { isLoading, isSuccess } = hooks.useAppSettingFile({
    appSettingId: appSetting.id,
  });
  const { mutate: deleteAppSettingFile } = mutations.useDeleteAppSetting();
  if (isLoading || !isSuccess) {
    return <p>Loading</p>;
  }

  return (
    <ListItem
      secondaryAction={
        <>
          {/* <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => {
              // todo: implement
              // eslint-disable-next-line no-console
              console.log('want to edit');
            }}
          >
            <Edit />
          </IconButton> */}
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
