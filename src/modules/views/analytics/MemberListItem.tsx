import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import {
  Box,
  Divider,
  ListItem,
  ListItemText,
  Typography,
  alpha,
  styled,
} from '@mui/material';

import { Member } from '@graasp/sdk';

interface Props {
  member: Member;
  isMemberSelected: boolean;
  onClick: () => void;
  totalVersion: number;
  timeOfLastVersion: string;
  actionsPerIntervals: { [key: string]: number };
}

const StyledListItem = styled(ListItem)<{ isMemberSelected: boolean }>(
  ({ isMemberSelected, theme }) => ({
    cursor: 'pointer',
    background: isMemberSelected
      ? ` ${alpha(theme.palette.primary.main, 0.07)}`
      : '',
  }),
);

const MemberListItem = ({
  member,
  totalVersion,
  isMemberSelected,
  onClick,
  timeOfLastVersion,
  actionsPerIntervals,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <StyledListItem
        alignItems="flex-start"
        onClick={onClick}
        isMemberSelected={isMemberSelected}
      >
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography
                variant="body2"
                color="text.primary"
                textTransform="capitalize"
              >
                {member.name}
              </Typography>
              <Typography variant="body2" color="text.primary" component="span">
                {`${totalVersion} ${t('versions')}`}
              </Typography>
            </Box>
          }
          secondary={
            <Box display="flex" justifyContent="space-between" alignItems="end">
              <Typography variant="caption" component="span">
                {t('Last version')} : {timeOfLastVersion}
              </Typography>
              <Box sx={{ width: '50%' }}>
                <Sparklines
                  data={Object.values(actionsPerIntervals)}
                  limit={5}
                  height={20}
                >
                  <SparklinesLine
                    color="#5050d2"
                    style={{ fill: 'none', opacity: 1 }}
                  />
                </Sparklines>
              </Box>
            </Box>
          }
        />
      </StyledListItem>
      <Divider variant="middle" component="li" />
    </>
  );
};

export default MemberListItem;
