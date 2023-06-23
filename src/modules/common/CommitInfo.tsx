import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormLabel, Stack, Typography, styled } from '@mui/material';

import { ANONYMOUS_USER, INSTRUCTOR_CODE_ID } from '../../config/constants';
import { buildCommitFieldDataCy } from '../../config/selectors';
import { CodeVersionSelectTypeRecord } from '../../interfaces/codeVersions';
import { Fields } from '../../interfaces/enums';
import { getFormattedTime } from '../../utils/datetime';
import { useMembersContext } from '../context/MembersContext';

const StyledTypography = styled(Typography)({
  whiteSpace: 'pre-line',
});

type Props = {
  commitResource: CodeVersionSelectTypeRecord;
};

const CommitInfo: FC<Props> = ({ commitResource }) => {
  const members = useMembersContext();
  const { t, i18n } = useTranslation();
  const commiterName =
    commitResource.id === INSTRUCTOR_CODE_ID
      ? INSTRUCTOR_CODE_ID
      : members.find((c) => commitResource.creator.id === c.id)?.name ||
        ANONYMOUS_USER;
  const formattedCreatedAt = getFormattedTime(
    commitResource.updatedAt,
    i18n.language,
  );
  const commitInfo: { label: Fields; value: string }[] = [
    { label: Fields.Author, value: commiterName },
    { label: Fields.Message, value: commitResource.data?.commitMessage },
    {
      label: Fields.Description,
      value: commitResource.data?.commitDescription,
    },
    { label: Fields.Created, value: formattedCreatedAt },
  ];
  return (
    <Stack>
      {commitInfo.map(({ label, value }) => (
        <Stack spacing={2} key={label} direction="row">
          <FormLabel>{t(label)}</FormLabel>
          <StyledTypography
            data-cy={buildCommitFieldDataCy(label)}
            variant="body1"
          >
            {value}
          </StyledTypography>
        </Stack>
      ))}
    </Stack>
  );
};

export default CommitInfo;
