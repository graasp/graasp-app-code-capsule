import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Typography,
} from '@mui/material';

import { AppAction } from '@graasp/sdk';

import { format } from 'date-fns';
import groupBy from 'lodash.groupby';

import { CodeVersionType } from '@/interfaces/codeVersions';

import MemberListItem from './MemberListItem';
import VersionsDisplay from './VersionsDisplay';

/*
  - use slider instead of progress (done)
  - show number of version (done)
  - move search input to the left (done)
  - github-diff
  - add a button to run the code with a popup view
  - have a list instead of buttons view
*/
interface Props {
  runningVersions: AppAction<CodeVersionType>[];
}

const UsersRunningCodeVersions = ({ runningVersions }: Props): JSX.Element => {
  const { t } = useTranslation();

  const codeRunningByMember = useMemo(
    () => groupBy(runningVersions, 'member.id'),
    [runningVersions],
  );

  const members = useMemo(
    () =>
      Object.keys(codeRunningByMember).map(
        (ele) => codeRunningByMember[ele][0].member, // get member objects
      ),
    [codeRunningByMember],
  );
  const [memberNameSearchText, setMemberNameSearchText] = useState('');

  const searchMembers = useMemo(
    () =>
      members.filter((ele) =>
        ele.name.toLowerCase().includes(memberNameSearchText),
      ),
    [members, memberNameSearchText],
  );

  const handleSearchInput = (event: ChangeEvent<{ value: string }>): void => {
    const text = event.target.value;
    setMemberNameSearchText(text.toLowerCase());
  };
  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    // Update selectedMemberId when searchMembers changes, selecting the first item by default
    setSelectedMemberId(searchMembers[0]?.id);
  }, [searchMembers]);
  return (
    <Box>
      <Typography variant="h6" align="center">
        {t('Statistics for running code')}
      </Typography>
      <TextField
        onChange={handleSearchInput}
        value={memberNameSearchText}
        placeholder={t('Search by member name')}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),

          endAdornment: memberNameSearchText && (
            <IconButton onClick={() => setMemberNameSearchText('')}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
      <Grid container spacing={2} marginTop={1} sx={{ height: '450px' }}>
        <Grid item xs={4} sx={{ height: '100%', overflow: 'auto' }}>
          <List sx={{ width: '100%', height: '100%' }}>
            {searchMembers.map((member) => (
              <MemberListItem
                member={member}
                key={member.id}
                isMemberSelected={selectedMemberId === member.id}
                onClick={() => setSelectedMemberId(member.id)}
                totalVersion={codeRunningByMember[member.id].length}
                timeOfLastVersion={format(
                  codeRunningByMember[member.id][
                    codeRunningByMember[member.id].length - 1
                  ].createdAt,
                  'MMM/dd/yyyy HH:mm',
                )}
              />
            ))}
          </List>
        </Grid>
        <Grid item xs={8}>
          {codeRunningByMember[selectedMemberId] ? (
            <VersionsDisplay
              versions={codeRunningByMember[selectedMemberId]
                ?.slice()
                .reverse()}
            />
          ) : (
            t('No Results Match Member')
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsersRunningCodeVersions;
