import { FC, ReactElement, useRef, useState } from 'react';
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

import { useLocalContext } from '@graasp/apps-query-client';

import i18n from '@/config/i18n';
import { getFormattedTime } from '@/utils/datetime';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import { ANONYMOUS_USER, DEFAULT_BOT_USERNAME } from '../../config/constants';
import { BIG_BORDER_RADIUS } from '../../config/layout';
import { mutations } from '../../config/queryClient';
import { buildCommentContainerDataCy } from '../../config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import { CommentType } from '../../interfaces/comment';
import { GeneralSettingsKeys } from '../../interfaces/settings';
import ChatbotAvatar from '../chatbot/ChatbotAvatar';
import { useMembersContext } from '../context/MembersContext';
import { useSettings } from '../context/SettingsContext';
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
  const { t } = useTranslation();
  const members = useMembersContext();
  const { [GENERAL_SETTINGS_NAME]: settings = DEFAULT_GENERAL_SETTINGS } =
    useSettings();
  const currentMemberId = useLocalContext().accountId;
  const { mutate: postAppData } = mutations.usePostAppData();

  const allowCommentReporting =
    settings[GeneralSettingsKeys.AllowCommentsReporting];
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openActionsMenu, setOpenActionsMenu] = useState(false);
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  const member = members.find((u) => u.id === comment.account.id);
  const userName = member?.name ?? ANONYMOUS_USER;

  const isBot = comment.type === APP_DATA_TYPES.BOT_COMMENT;

  const isEditable = (): boolean => currentMemberId === comment.creator?.id;
  const isDeletable = (): boolean => isEditable();

  const sendCommentReport = (reason: string): void => {
    postAppData({
      data: { reason, commentId: comment.id },
      type: APP_DATA_TYPES.FLAG,
    });
  };

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
        showEdit={isEditable()}
        showDelete={isDeletable()}
        showFlag={allowCommentReporting}
        onClickFlag={() => setOpenFlagDialog(true)}
        onClose={() => {
          setMenuAnchorEl(null);
          setOpenActionsMenu(false);
        }}
      />
      <ReportCommentDialog
        open={openFlagDialog}
        setOpen={setOpenFlagDialog}
        onSendReport={sendCommentReport}
        commentRef={commentRef}
      />
    </>
  );
  return (
    <CustomCard
      data-cy={buildCommentContainerDataCy(comment.id)}
      elevation={0}
      ref={commentRef}
    >
      <CardHeader
        title={isBot ? DEFAULT_BOT_USERNAME : userName}
        subheader={getFormattedTime(new Date(comment.updatedAt), i18n.language)}
        avatar={isBot ? <ChatbotAvatar /> : <CustomAvatar member={member} />}
        action={renderCommentActions()}
      />
      <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
        <CommentBody>{comment.data.content}</CommentBody>
      </CardContent>
    </CustomCard>
  );
};

export default Comment;
