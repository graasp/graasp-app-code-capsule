import { FC } from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from '@mui/material';

type Prop = {
  onChange: (value: string) => void;
  label: string;
  value?: string;
  values: { value: string; label: string }[];
  dataCy?: string;
};

const StyledSelect = styled(Select)(({ theme }) => ({
  div: {
    padding: theme.spacing(1, 2),
  },
}));

const CustomSelect: FC<Prop> = ({ onChange, label, value, values, dataCy }) => (
  <FormControl sx={{ pt: 1 }}>
    <InputLabel sx={{ pt: 1 }}>{label}</InputLabel>
    <StyledSelect
      data-cy={dataCy}
      label={label}
      value={value}
      onChange={({ target }) => onChange(target.value as string)}
    >
      {values.map((v) => (
        <MenuItem key={v.value} value={v.value}>
          {v.label}
        </MenuItem>
      ))}
    </StyledSelect>
  </FormControl>
);

export default CustomSelect;
