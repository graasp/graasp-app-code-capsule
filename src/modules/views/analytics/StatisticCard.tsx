import { Grid, Paper, Stack, Typography } from '@mui/material';

import { buildStatisticCardID } from '@/config/selectors';

type Props = {
  icon: JSX.Element;
  title: string;
  stat: number | string;
  cardId: string;
};

const StatisticCard = ({ icon, title, stat, cardId }: Props): JSX.Element => (
  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
    <Stack
      height="100%"
      component={Paper}
      p={2}
      variant="outlined"
      direction="row"
      alignItems="center"
    >
      {icon}
      <Stack flexGrow={1} direction="column" alignItems="center">
        <Typography align="center">{title}</Typography>
        <Typography
          variant="h5"
          component="div"
          id={buildStatisticCardID(cardId)}
        >
          {stat}
        </Typography>
      </Stack>
    </Stack>
  </Grid>
);
export default StatisticCard;
