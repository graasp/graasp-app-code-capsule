import { FC, ReactElement, useState } from 'react';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import InputIcon from '@mui/icons-material/Input';
import { useTranslation } from 'react-i18next';
import { List } from 'immutable';
import {
  NUMBER_OF_COMMENTS_CYPRESS,
  TABLE_NO_COMMENTS_CYPRESS,
  TABLE_VIEW_BODY_USERS_CYPRESS,
  TABLE_VIEW_TABLE_CYPRESS,
  tableRowUserCypress,
} from '../../../config/selectors';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import {
  ANONYMOUS_USER,
  NB_COL_TABLE_VIEW_TABLE,
} from '../../../config/constants';
import CustomDialog from '../../common/CustomDialog';
import OrphanComments from './OrphanComments';
import { useAppDataContext } from '../../context/AppDataContext';
import { useMembersContext } from '../../context/MembersContext';
import { CommentType } from '../../../interfaces/comment';
import { getOrphans } from '../../../utils/comments';

const TableView: FC = () => {
  const { t } = useTranslation();
  const [openCommentView, setOpenCommentView] = useState(false);
  const members = useMembersContext();
  const { appData } = useAppDataContext();

  const comments = appData?.filter(
    (res) => res.type === APP_DATA_TYPES.COMMENT,
  ) as List<CommentType>;

  const renderTableBody = (): ReactElement[] | ReactElement | null => {
    const orphansId = getOrphans(comments).map((c) => c.id);
    const nonOrphanComments = comments?.filter(
      (c) => !orphansId.includes(c.id),
    );
    if (nonOrphanComments?.isEmpty()) {
      // show that there are no comments available
      return (
        <TableRow>
          <TableCell
            colSpan={NB_COL_TABLE_VIEW_TABLE}
            data-cy={TABLE_NO_COMMENTS_CYPRESS}
          >
            {t('No Comments')}
          </TableCell>
        </TableRow>
      );
    }
    const commentsByUsers = nonOrphanComments
      ?.groupBy(({ memberId }) => memberId)
      .toArray();
    return (
      commentsByUsers?.map(([userId, userComments]) => {
        const userName =
          members?.find(({ id }) => id === userId)?.name || ANONYMOUS_USER;
        return (
          <TableRow key={userId} data-cy={tableRowUserCypress(userId)}>
            <TableCell>{userName}</TableCell>
            <TableCell>{false}</TableCell>
            <TableCell data-cy={NUMBER_OF_COMMENTS_CYPRESS}>
              <div>{userComments.count()}</div>
            </TableCell>
            <TableCell>
              <IconButton onClick={() => setOpenCommentView(true)}>
                <InputIcon color="primary" />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      }) || null
    );
  };

  return (
    <>
      <OrphanComments comments={comments} />
      <TableContainer data-cy={TABLE_VIEW_TABLE_CYPRESS}>
        <Table aria-label="student table">
          <TableHead>
            <TableRow>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Help needed')}</TableCell>
              <TableCell>{t('Total Number of comments')}</TableCell>
              <TableCell>{t('View Student comments')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-cy={TABLE_VIEW_BODY_USERS_CYPRESS}>
            {renderTableBody()}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomDialog
        open={openCommentView}
        title={t('Viewing comments from ')}
        content={<span>Code Review</span>}
        onClose={() => setOpenCommentView(false)}
      />
    </>
  );
};

export default TableView;
