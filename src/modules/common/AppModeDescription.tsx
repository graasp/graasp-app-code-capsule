import { Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  description?: string;
  dataCy?: string;
};

const AppModeDescription = ({
  title,
  description,
  dataCy,
}: Props): JSX.Element => (
  <Stack direction="column" data-cy={dataCy}>
    <Typography>{title}</Typography>
    {description && <Typography variant="caption">{description}</Typography>}
  </Stack>
);
export default AppModeDescription;
