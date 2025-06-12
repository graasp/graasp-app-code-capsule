import { useTranslation } from 'react-i18next';

import { Alert, Box, CircularProgress } from '@mui/material';

import { AppAction } from '@graasp/sdk';

import { differenceInSeconds } from 'date-fns';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { APP_ACTIONS_TYPES } from '@/config/appActionsTypes';
import { hooks } from '@/config/queryClient';
import { CodeVersionType } from '@/interfaces/codeVersions';

import { ANALYTICS_VIEW_CY } from '../../../config/selectors';
import GeneralStatistics from './GeneralStatistics';
import UsersRunningCodeVersions from './UsersRunningCodeVersions';

const AnalyticsView = (): JSX.Element => {
  const { data, isLoading } = hooks.useAppActions();

  const { t } = useTranslation();

  if (data) {
    const actionsOrdersByCreatedDate = orderBy(data, 'createdAt');
    const actionsByType = groupBy(actionsOrdersByCreatedDate, 'type');
    const actionsByMember = groupBy(actionsOrdersByCreatedDate, 'account.id');

    const generalStatistic = Object.entries(actionsByMember).map(
      ([accountId, memberActions]) => {
        const startTime = memberActions[0].createdAt;
        const endTime = memberActions[memberActions.length - 1].createdAt;
        return {
          accountId,
          endTime,
          startTime,
          memberName: memberActions[0].account.name,
          savedVersions: memberActions.filter(
            (version) => version.type === APP_ACTIONS_TYPES.SAVE_CODE,
          ).length,
          runningVersions: memberActions.filter(
            (version) => version.type === APP_ACTIONS_TYPES.RUN_CODE,
          ).length,
          spentTimeInSeconds: differenceInSeconds(endTime, startTime),
        };
      },
    );

    return (
      <div data-cy={ANALYTICS_VIEW_CY}>
        <GeneralStatistics generalStatistics={generalStatistic} />
        <UsersRunningCodeVersions
          runningVersions={
            actionsByType[
              APP_ACTIONS_TYPES.RUN_CODE
            ] as AppAction<CodeVersionType>[]
          }
          generalStatistics={generalStatistic}
        />
      </div>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box pl={2} pr={2} mb={2} flexGrow={1}>
      <Alert severity="error">{t('GET_ITEM_ERROR')}</Alert>
    </Box>
  );
};

export default AnalyticsView;
