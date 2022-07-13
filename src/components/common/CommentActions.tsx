import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Delete, Edit, Flag } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { useAppDataContext } from '../context/AppDataContext';
import { useCommentContext } from '../context/CommentContext';
import { useReviewContext } from '../context/ReviewContext';

type Props = {
  open: boolean;
  menuAnchorEl: null | HTMLElement;
  onClose: () => void;
  onClickFlag?: () => void;
  showDelete?: boolean;
  showEdit?: boolean;
  showFlag?: boolean;
};

const CommentActions: FC<Props> = ({
  open,
  menuAnchorEl,
  onClose,
  onClickFlag,
  showDelete = true,
  showEdit = true,
  showFlag = true,
}) => {
  const { t } = useTranslation();
  const comment = useCommentContext();
  const { editComment } = useReviewContext();
  const { deleteAppData } = useAppDataContext();

  return (
    <Menu
      MenuListProps={{ dense: true }}
      open={open}
      anchorEl={menuAnchorEl}
      // center the popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={() => onClose()}
    >
      {showEdit && (
        <MenuItem
          onClick={() => {
            editComment(comment.id);
            onClose();
          }}
        >
          <ListItemIcon>
            <Edit color="primary" />
          </ListItemIcon>
          <ListItemText>{t('Edit')}</ListItemText>
        </MenuItem>
      )}
      {showDelete && (
        <MenuItem
          onClick={() => {
            deleteAppData({ id: comment.id });
            onClose();
          }}
        >
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>{t('Delete')}</ListItemText>
        </MenuItem>
      )}
      {showFlag && (
        <MenuItem
          onClick={() => {
            onClickFlag?.();
            onClose();
          }}
        >
          <ListItemIcon>
            <Flag color="warning" />
          </ListItemIcon>
          <ListItemText>{t('Report')}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};

export default CommentActions;
