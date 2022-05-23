import { FC, ReactElement } from 'react';
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
import { Loader } from '@graasp/ui';
import { List } from 'immutable';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import { useAppContext, useAppData } from '../../context/hooks';
import { Member } from '../../../interfaces/member';
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

const TableView: FC = () => {
  const { t } = useTranslation();
  const { data: appContext, isLoading: isLoadingAppContext } = useAppContext();
  const { data: appData, isLoading: isLoadingAppData } = useAppData();

  if (isLoadingAppContext || isLoadingAppData) {
    return <Loader />;
  }

  // @ts-ignore
  const members = appContext?.get('members') ?? List();
  const comments =
    // @ts-ignore
    appData.filter(
      (res: { type: string }) => res.type === APP_DATA_TYPES.COMMENT,
    ) ?? List();

  const renderTableBody = (): ReactElement[] | ReactElement => {
    if (comments.isEmpty()) {
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
    const commentsByUsers: [string, List<AppData>][] = comments
      .groupBy(({ memberId }: { memberId: string }) => memberId)
      .toArray();
    return commentsByUsers?.map(([userId, userComments]) => {
      const userName =
        members?.find(({ id }: Member) => id === userId)?.name ||
        ANONYMOUS_USER;
      return (
        <TableRow key={userId} data-cy={tableRowUserCypress(userId)}>
          <TableCell>{userName}</TableCell>
          <TableCell>{false}</TableCell>
          <TableCell data-cy={NUMBER_OF_COMMENTS_CYPRESS}>
            {userComments?.size}
          </TableCell>
          <TableCell>
            <IconButton>
              <InputIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
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
  );
};

export default TableView;
