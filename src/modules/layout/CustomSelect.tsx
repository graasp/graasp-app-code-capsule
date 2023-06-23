import { ReactNode } from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from '@mui/material';

type Props<T, K> = {
  onChange: (value: T) => void;
  label: string;
  value?: T;
  values: { value: T; label: K; disabled?: boolean }[];
  dataCy?: string;
  renderValue?: (value: unknown) => ReactNode;
};

const StyledSelect = styled(Select)(({ theme }) => ({
  div: {
    padding: theme.spacing(1, 2),
  },
}));

const CustomSelect = <T extends string, K extends ReactNode>({
  onChange,
  label,
  value,
  values,
  dataCy,
  renderValue,
}: Props<T, K>): JSX.Element => (
  <FormControl sx={{ pt: 1 }}>
    <InputLabel sx={{ pt: 1 }}>{label}</InputLabel>
    <StyledSelect
      data-cy={dataCy}
      label={label}
      renderValue={renderValue}
      value={value ?? values[0]?.value}
      onChange={({ target }) => onChange(target.value as T)}
    >
      {values.map((v) => (
        <MenuItem key={v.value} value={v.value} disabled={v.disabled}>
          {v.label}
        </MenuItem>
      ))}
    </StyledSelect>
  </FormControl>
);

export default CustomSelect;
