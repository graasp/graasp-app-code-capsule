import React from 'react';

import { Slider, styled } from '@mui/material';

export type Mark = {
  value: number;
  label: string;
};
const StyledSlider = styled(Slider)(() => ({
  // Styling the labels
  '& .MuiSlider-markLabel': {
    position: 'absolute',
    transform: 'translate(-50%, 42px) rotate(-45deg)',
    transformOrigin: 'top left',
    fontSize: '0.75rem',
  },
}));

type Props = {
  marks: Mark[];
  handleChange: (event: Event, newValue: number | number[]) => void;
  versionIndex: number;
};

const TimeLineSlider = ({
  marks,
  handleChange,
  versionIndex,
}: Props): JSX.Element => (
  <StyledSlider
    aria-label="Timeline slider"
    min={marks[0].value}
    max={marks[marks.length - 1].value}
    step={null}
    marks={marks}
    value={marks[versionIndex]?.value}
    onChange={handleChange}
  />
);

export default TimeLineSlider;
