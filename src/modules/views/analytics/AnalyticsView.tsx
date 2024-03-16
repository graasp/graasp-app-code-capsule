import { useTranslation } from 'react-i18next';

import { Alert, Box } from '@mui/material';

import { AppAction } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import groupBy from 'lodash.groupby';

import { APP_ACTIONS_TYPES } from '@/config/appActionsTypes';
import { hooks } from '@/config/queryClient';
import { CodeVersionType } from '@/interfaces/codeVersions';
import { getTimeSpentInSeconds } from '@/utils/chart';

import { ANALYTICS_VIEW_CY } from '../../../config/selectors';
import GeneralStatistics from './GeneralStatistics';
import UsersRunningCodeVersions from './UsersRunningCodeVersions';

const AnalyticsView = (): JSX.Element => {
  const { data, isLoading } = hooks.useAppActions();

  const { t } = useTranslation();

  if (data) {
    const actionsByType = groupBy(data, 'type');
    const actionsByMember = groupBy(data, 'member.id');

    const generalStatistic = Object.keys(actionsByMember).map((ele) => {
      const firstMemberAction = actionsByMember[ele][0];
      const lastMemberAction =
        actionsByMember[ele][actionsByMember[ele].length - 1];
      return {
        memberId: ele,
        endTime: firstMemberAction.createdAt,
        startTime: lastMemberAction.createdAt,
        memberName: firstMemberAction.member.name,
        savedVersions: actionsByMember[ele].filter(
          (version) => version.type === APP_ACTIONS_TYPES.SAVE_CODE,
        ).length,
        runningVersions: actionsByMember[ele].filter(
          (version) => version.type === APP_ACTIONS_TYPES.RUN_CODE,
        ).length,
        spentTimeInSeconds: getTimeSpentInSeconds({
          startTime: lastMemberAction.createdAt,
          endTime: firstMemberAction.createdAt,
        }),
      };
    });

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
    return <Loader />;
  }

  return (
    <Box pl={2} pr={2} mb={2} flexGrow={1}>
      <Alert severity="error">{t('GET_ITEM_ERROR')}</Alert>
    </Box>
  );
};

export default AnalyticsView;
