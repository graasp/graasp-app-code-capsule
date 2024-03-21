import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import ClearIcon from '@mui/icons-material/Clear';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { AppAction } from '@graasp/sdk';

import groupBy from 'lodash.groupby';

import { GeneralMemberStatistic } from '@/interfaces/analytics';
import { CodeVersionType } from '@/interfaces/codeVersions';

import MemberListItem from './MemberListItem';
import VersionsDisplay from './VersionsDisplay';

type Props = {
  runningVersions: AppAction<CodeVersionType>[];
  generalStatistics: GeneralMemberStatistic[];
};

const UsersRunningCodeVersions = ({
  runningVersions,
  generalStatistics,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [memberNameSearchText, setMemberNameSearchText] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const codeRunningByMembers = useMemo(
    () => groupBy(runningVersions, 'member.id'),
    [runningVersions],
  );

  const members = useMemo(
    () =>
      Object.keys(codeRunningByMembers).map(
        (ele) => codeRunningByMembers[ele][0].member, // get member objects
      ),
    [codeRunningByMembers],
  );

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

  useEffect(() => {
    // Update selectedMemberId when searchMembers changes, selecting the first item by default
    setSelectedMemberId(searchMembers[0]?.id);
  }, [searchMembers]);

  const spentTimeInSeconds = generalStatistics.find(
    (ele) => ele.memberId === selectedMemberId,
  )?.spentTimeInSeconds;

  return (
    <Box>
      <Typography variant="h6" align="center">
        {t('Statistics for running code')}
      </Typography>
      {runningVersions?.length ? (
        <>
          <Stack direction="row" gap={2}>
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
            <CSVLink data={generalStatistics}>
              <CloudDownloadIcon fontSize="large" color="primary" />
            </CSVLink>
          </Stack>
          <Grid container spacing={2} marginTop={1} sx={{ height: '450px' }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ maxHeight: '100%', overflow: 'auto' }}
            >
              <List sx={{ width: '100%', maxHeight: '100%' }}>
                {searchMembers.map((member) => (
                  <MemberListItem
                    member={member}
                    key={member.id}
                    isMemberSelected={selectedMemberId === member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    runningVersions={codeRunningByMembers[member.id]}
                  />
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={8}>
              {codeRunningByMembers[selectedMemberId] ? (
                <VersionsDisplay
                  spentTimeInSeconds={spentTimeInSeconds ?? 0}
                  versions={codeRunningByMembers[selectedMemberId]}
                />
              ) : (
                t('No Results Match Member')
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <Box display="flex" justifyContent="center">
          {t('No Records Yet')}
        </Box>
      )}
    </Box>
  );
};

export default UsersRunningCodeVersions;
