import React from 'react';
import { useTranslation } from 'react-i18next';

import { AccessTime, People, RunCircleSharp, Save } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

import sumBy from 'lodash.sumby';

import { GeneralMemberStatistic } from '@/interfaces/analytics';
import { formatSeconds } from '@/utils/chart';

import StatisticCard from './StatisticCard';

const AccessTimeIcon = <AccessTime fontSize="large" color="primary" />;
const PeopleIcon = <People fontSize="large" color="primary" />;
const SaveIcon = <Save fontSize="large" color="primary" />;
const RunIcon = <RunCircleSharp fontSize="large" color="primary" />;

interface Props {
  generalStatistics: GeneralMemberStatistic[];
}

const GeneralStatistics = ({ generalStatistics }: Props): JSX.Element => {
  const { t } = useTranslation();
  const savedVersions = sumBy(generalStatistics, 'savedVersions');
  const runningVersions = sumBy(generalStatistics, 'runningVersions');

  const averageTime = generalStatistics.reduce(
    (acc, curr) => acc + curr.spentTimeInSeconds,
    0,
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
          stat={formatSeconds(averageTime / generalStatistics.length) || 0}
          key="timeSpent"
        />
        <StatisticCard
          icon={PeopleIcon}
          title={t('Total Users')}
          stat={generalStatistics.length}
          key="totalUsers"
        />
        <StatisticCard
          icon={SaveIcon}
          title={t('Average Saved Versions')}
          stat={(savedVersions / generalStatistics.length || 0).toFixed()}
          key="savedVersions"
        />
        <StatisticCard
          icon={RunIcon}
          title={t('Average Running Versions')}
          stat={(runningVersions / generalStatistics.length || 0).toFixed()}
          key="runningVersions"
        />
      </Grid>
    </Box>
  );
};

export default GeneralStatistics;
