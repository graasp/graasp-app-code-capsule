import React, { FC, ReactElement, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MoreVert } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  IconButton,
  Tooltip,
  styled,
} from '@mui/material';

import { ANONYMOUS_USER } from '../../config/constants';
import { BIG_BORDER_RADIUS } from '../../config/layout';
import { COMMENT_CONTAINER_CYPRESS } from '../../config/selectors';
import { CommentType } from '../../interfaces/comment';
import { getFormattedTime } from '../../utils/datetime';
import { useMembersContext } from '../context/MembersContext';
import CustomAvatar from '../layout/CustomAvatar';
import CommentActions from './CommentActions';
import CommentBody from './CommentBody';
import ReportCommentDialog from './ReportCommentDialog';

const CustomCard = styled(Card)<CardProps>({
  borderRadius: BIG_BORDER_RADIUS,
});

type Props = {
  comment: CommentType;
};

const Comment: FC<Props> = ({ comment }) => {
  const { t, i18n } = useTranslation();
  const members = useMembersContext();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openActionsMenu, setOpenActionsMenu] = useState(false);
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  const member = members.find((u) => u.id === comment.memberId);
  const userName = member?.name || ANONYMOUS_USER;

  const renderCommentActions = (): ReactElement => (
    <>
      <Tooltip title={t('Actions')}>
        <IconButton
          onClick={(e) => {
            setMenuAnchorEl(e.currentTarget);
            setOpenActionsMenu(true);
          }}
        >
          <MoreVert />
        </IconButton>
      </Tooltip>
      <CommentActions
        open={openActionsMenu}
        menuAnchorEl={menuAnchorEl}
        onClose={() => {
          setMenuAnchorEl(null);
          setOpenActionsMenu(false);
        }}
      />
      <ReportCommentDialog
        open={openFlagDialog}
        setOpen={setOpenFlagDialog}
        commentRef={commentRef}
      />
    </>
  );
  return (
    <CustomCard
      data-cy={COMMENT_CONTAINER_CYPRESS}
      elevation={0}
      ref={commentRef}
    >
      <CardHeader
        title={userName}
        subheader={getFormattedTime(comment.updatedAt, i18n.language)}
        avatar={<CustomAvatar member={member} />}
        action={renderCommentActions()}
      />
      <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
        <CommentBody>{comment.data.content}</CommentBody>
      </CardContent>
    </CustomCard>
  );
};

export default Comment;
