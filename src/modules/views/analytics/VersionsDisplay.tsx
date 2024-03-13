import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import NotStartedTwoToneIcon from '@mui/icons-material/NotStartedTwoTone';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextTwoToneIcon from '@mui/icons-material/SkipNextTwoTone';
import SkipPreviousTwoToneIcon from '@mui/icons-material/SkipPreviousTwoTone';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';

import { AppAction } from '@graasp/sdk';

import { format } from 'date-fns';

import { CodeVersionType } from '@/interfaces/codeVersions';

import RunView from './RunView';
import TimeLineSlider, { Mark } from './TimeLineSlider';

const shapeTimeLineMarker = (
  versions: AppAction<CodeVersionType>[],
): Mark[] => {
  const timestamps = versions.map((item) => ({
    value: Date.parse(item.createdAt),
    label: format(item.createdAt, 'MMM/dd HH:mm'),
  }));

  return timestamps;
};

interface Props {
  versions: AppAction<CodeVersionType>[];
}
const VersionsDisplay = ({ versions }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [versionIndex, setVersionIndex] = useState(0);
  const [stopRunning, setStopRunning] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  const timeLineMarks = useMemo(
    () => shapeTimeLineMarker(versions),
    [versions],
  );

  useEffect(() => {
    let interval: number;
    if (versionIndex < versions.length - 1 && !stopRunning) {
      interval = setInterval(() => {
        setVersionIndex((prev) => prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [versionIndex, versions, stopRunning]);

  useEffect(() => {
    setVersionIndex(0);
    setStopRunning(false);
  }, [versions]);

  const handleSliderChange = (event: Event, value: number | number[]): void => {
    const index = timeLineMarks.findIndex((ele) => ele.value === value);
    setVersionIndex(index);
  };

  return (
    <>
      <Box>
        <SyntaxHighlighter
          language="python"
          style={docco}
          customStyle={{ height: '300px' }}
          showLineNumbers
        >
          {versions[versionIndex]?.data.code}
        </SyntaxHighlighter>
        <Typography variant="caption">
          {`${versions.length} ${t('versions')}`}
        </Typography>
        <Grid container spacing={2} alignItems="start">
          <Grid item xs={8}>
            <TimeLineSlider
              handleChange={handleSliderChange}
              marks={timeLineMarks}
              versionIndex={versionIndex}
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: '10px' }}>
            <IconButton
              aria-label="previous"
              color="primary"
              onClick={() => setVersionIndex(versionIndex - 1)}
              disabled={versionIndex === 0}
            >
              <SkipPreviousTwoToneIcon />
            </IconButton>
            <IconButton
              aria-label="start"
              color="primary"
              onClick={() => setStopRunning((isRunning) => !isRunning)}
            >
              {stopRunning ? <NotStartedTwoToneIcon /> : <PauseCircleIcon />}
            </IconButton>
            <IconButton
              aria-label="next"
              color="primary"
              disabled={versionIndex === versions.length - 1}
              onClick={() => setVersionIndex(versionIndex + 1)}
            >
              <SkipNextTwoToneIcon />
            </IconButton>
            <Button
              color="primary"
              onClick={() => {
                setStopRunning(true);
                setIsRunnerOpen(true);
              }}
            >
              {t('Run Code')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <RunView
        open={isRunnerOpen}
        handleClose={() => setIsRunnerOpen(false)}
        codeVersion={versions[versionIndex]?.data}
      />
    </>
  );
};

export default VersionsDisplay;
