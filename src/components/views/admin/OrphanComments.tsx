import { List } from 'immutable';

import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { UUID } from '@graasp/apps-query-client';
import { Button } from '@graasp/ui';

import { FormControlLabel } from '@mui/material';

import { ORPHAN_BUTTON_CYPRESS } from '../../../config/selectors';
import { CommentType } from '../../../interfaces/comment';
import {
  getOrphans,
  getThreadIdsFromFirstCommentId,
} from '../../../utils/comments';
import { useAppDataContext } from '../../context/AppDataContext';

type Prop = {
  comments: List<CommentType>;
};

const OrphanComments: FC<Prop> = ({ comments }) => {
  const { t } = useTranslation();
  const { deleteAppData } = useAppDataContext();

  const getOrphanComments = (allComments: List<CommentType>): List<UUID[]> => {
    const orphans = getOrphans(allComments);
    return orphans.map((o) => getThreadIdsFromFirstCommentId(comments, o.id));
  };

  const handleOnClickRemoveOrphans = (orphanThreads: List<UUID[]>): void => {
    orphanThreads.forEach((thread) => {
      thread.forEach((id) => {
        deleteAppData({ id });
      });
    });
  };

  const orphanThreads = getOrphanComments(comments);

  if (!orphanThreads.size) {
    return null;
  }

  const buttonControl = (
    <Button
      dataCy={ORPHAN_BUTTON_CYPRESS}
      variant="outlined"
      color="primary"
      sx={{ mr: 1 }}
      onClick={() => handleOnClickRemoveOrphans(orphanThreads)}
      disabled={orphanThreads.size === 0}
    >
      {t('Remove orphans')}
    </Button>
  );
  const buttonLabel = `${t('Orphan threads')}: ${
    orphanThreads.size
  } (${orphanThreads
    .map((thread) => thread.length)
    .reduce((tot, length) => tot + length, 0)} ${t('total comments')})`;

  return <FormControlLabel control={buttonControl} label={buttonLabel} />;
};

export default OrphanComments;
