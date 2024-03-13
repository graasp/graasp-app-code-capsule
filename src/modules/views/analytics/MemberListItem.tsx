import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Divider,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import { Member } from '@graasp/sdk';

interface Props {
  member: Member;
  isMemberSelected: boolean;
  onClick: () => void;
  totalVersion: number;
  timeOfLastVersion: string;
}
const MemberListItem = ({
  member,
  totalVersion,
  isMemberSelected,
  onClick,
  timeOfLastVersion,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          transform: isMemberSelected ? `scale(1)` : `scale(0.9)`,
          boxShadow: isMemberSelected
            ? `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`
            : '',
        }}
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
          secondary={`${t('Last version')} : ${timeOfLastVersion}`}
        />
      </ListItem>
      <Divider variant="middle" component="li" />
    </>
  );
};

export default MemberListItem;
