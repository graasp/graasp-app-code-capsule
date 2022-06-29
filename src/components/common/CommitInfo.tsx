import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormLabel, Stack, Typography, styled } from '@mui/material';

import { ANONYMOUS_USER } from '../../config/constants';
import { CodeVersionSelectType } from '../../interfaces/codeVersions';
import { getFormattedTime } from '../../utils/datetime';
import { useMembersContext } from '../context/MembersContext';

enum Fields {
  Author = 'Author',
  Message = 'Message',
  Description = 'Description',
  Created = 'Created',
}

const StyledTypography = styled(Typography)({
  whiteSpace: 'pre-line',
});

type Props = {
  commitResource: CodeVersionSelectType;
};

const CommitInfo: FC<Props> = ({ commitResource }) => {
  const members = useMembersContext();
  const { t, i18n } = useTranslation();
  const commiterName =
    members.find((c) => commitResource.creator === c.id)?.name ||
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
          {/* @ts-ignore */}
          <FormLabel>{t(label)}</FormLabel>
          <StyledTypography variant="body1">{value}</StyledTypography>
        </Stack>
      ))}
    </Stack>
  );
};

export default CommitInfo;
