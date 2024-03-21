import React from 'react';
import { useTranslation } from 'react-i18next';

import { AccessTime, People, RunCircleSharp, Save } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

import { formatDuration } from 'date-fns';
import sumBy from 'lodash.sumby';

import {
  STATISTIC_RUNNING_VERSIONS_KEY,
  STATISTIC_SAVED_VERSIONS_KEY,
  STATISTIC_TIME_SPENT_KEY,
  STATISTIC_TOTAL_USERS_KEY,
} from '@/config/selectors';
import { GeneralMemberStatistic } from '@/interfaces/analytics';
import { formatSeconds } from '@/utils/chart';

import StatisticCard from './StatisticCard';

const AccessTimeIcon = <AccessTime fontSize="large" color="primary" />;
const PeopleIcon = <People fontSize="large" color="primary" />;
const SaveIcon = <Save fontSize="large" color="primary" />;
const RunIcon = <RunCircleSharp fontSize="large" color="primary" />;

type Props = {
  generalStatistics: GeneralMemberStatistic[];
};

const GeneralStatistics = ({ generalStatistics }: Props): JSX.Element => {
  const { t } = useTranslation();
  const savedVersions = sumBy(generalStatistics, 'savedVersions');
  const runningVersions = sumBy(generalStatistics, 'runningVersions');

  const averageTime = generalStatistics.reduce(
    (acc, curr) => acc + curr.spentTimeInSeconds,
    0,
  );

  const { hours, minutes } = formatSeconds(
    averageTime / generalStatistics.length,
  );

  return (
    <Box marginY={4}>
      <Typography variant="h6" align="center">
        {t('General Statistics')}
      </Typography>
      <Grid container spacing={2} marginTop={1} justifyContent="center">
        <StatisticCard
          icon={AccessTimeIcon}
          title={t('Average Time Spent By Users')}
          stat={formatDuration({ hours, minutes })}
          key={STATISTIC_TIME_SPENT_KEY}
          cardId={STATISTIC_TIME_SPENT_KEY}
        />
        <StatisticCard
          icon={PeopleIcon}
          title={t('Total Users')}
          stat={generalStatistics.length}
          key={STATISTIC_TOTAL_USERS_KEY}
          cardId={STATISTIC_TOTAL_USERS_KEY}
        />
        <StatisticCard
          icon={SaveIcon}
          title={t('Average Saved Versions')}
          stat={(savedVersions / generalStatistics.length || 0).toFixed()}
          key={STATISTIC_SAVED_VERSIONS_KEY}
          cardId={STATISTIC_SAVED_VERSIONS_KEY}
        />
        <StatisticCard
          icon={RunIcon}
          title={t('Average Running Versions')}
          stat={(runningVersions / generalStatistics.length || 0).toFixed()}
          key={STATISTIC_RUNNING_VERSIONS_KEY}
          cardId={STATISTIC_RUNNING_VERSIONS_KEY}
        />
      </Grid>
    </Box>
  );
};

export default GeneralStatistics;
