import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, FormControlLabel } from '@mui/material';

import { UUID } from '@graasp/sdk';

import { ORPHAN_BUTTON_CYPRESS } from '../../../config/selectors';
import { CommentType } from '../../../interfaces/comment';
import {
  getOrphans,
  getThreadIdsFromFirstCommentId,
} from '../../../utils/comments';
import { useAppDataContext } from '../../context/AppDataContext';

type Prop = {
  comments: CommentType[];
};

const OrphanComments: FC<Prop> = ({ comments }) => {
  const { t } = useTranslation();
  const { deleteAppData } = useAppDataContext();

  const getOrphanComments = (allComments: CommentType[]): UUID[][] => {
    const orphans = getOrphans(allComments);
    return orphans.map((o) => getThreadIdsFromFirstCommentId(comments, o.id));
  };

  const handleOnClickRemoveOrphans = (orphanThreads: UUID[][]): void => {
    orphanThreads.forEach((thread) => {
      thread.forEach((id) => {
        deleteAppData({ id });
      });
    });
  };

  const orphanThreads = getOrphanComments(comments);

  if (!orphanThreads.length) {
    return null;
  }

  const buttonControl = (
    <Button
      data-cy={ORPHAN_BUTTON_CYPRESS}
      variant="outlined"
      color="primary"
      onClick={() => handleOnClickRemoveOrphans(orphanThreads)}
      disabled={orphanThreads.length === 0}
    >
      {t('Remove orphans')}
    </Button>
  );
  const totalNumberOfOrphanComments = orphanThreads.reduce(
    (tot, thread) => tot + thread.length,
    0,
  );
  const buttonLabel = t('Number of orphan threads', {
    threads: orphanThreads.length,
    totalComments: totalNumberOfOrphanComments,
  });

  return (
    <FormControlLabel
      sx={{ mr: 1 }}
      control={buttonControl}
      label={buttonLabel}
    />
  );
};

export default OrphanComments;
