import React, { FC, RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

import { TextField, Typography } from '@mui/material';

import CustomDialog from './CustomDialog';

type Props = {
  commentRef: RefObject<HTMLElement | undefined>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ReportCommentDialog: FC<Props> = ({ commentRef, open, setOpen }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  const reasonInputControl = (
    <TextField onChange={(e) => setReason(e.target.value)} value={reason} />
  );

  return (
    <CustomDialog
      open={open}
      title={t('Report a comment')}
      content={
        <>
          <Typography variant="body1">
            {t('Please provide below the reason for reporting this comment')}
          </Typography>
          {reasonInputControl}
        </>
      }
      onClose={() => {
        setOpen(false);
      }}
      actions={
        <>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
          <Button
            onClick={() => {
              setOpen(false);
              // send the report with the reason
              // eslint-disable-next-line no-console
              console.log(`sending report, ${reason}`);
            }}
          >
            {t('Report')}
          </Button>
          {}
        </>
      }
      anchor={commentRef}
    />
  );
};

export default ReportCommentDialog;
