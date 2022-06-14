import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CommentType } from '../../interfaces/comment';
import CommentActions from './CommentActions';
import ReportCommentDialog from './ReportCommentDialog';
import { useMembersContext } from '../context/MembersContext';
import { ANONYMOUS_USER } from '../../config/constants';
import CommentBody from './CommentBody';
import { getFormattedTime } from '../../utils/datetime';
import { COMMENT_CONTAINER_CYPRESS } from '../../config/selectors';

const CustomCard = styled(Card)<CardProps>(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

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

  const userName =
    members.find((u) => u.id === comment.memberId)?.name || ANONYMOUS_USER;

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
        avatar={
          <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Logo_wikibot.svg/240px-Logo_wikibot.svg.png" />
        }
        action={renderCommentActions()}
      />
      <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
        <CommentBody>{comment.data.content}</CommentBody>
      </CardContent>
    </CustomCard>
  );
};

export default Comment;
