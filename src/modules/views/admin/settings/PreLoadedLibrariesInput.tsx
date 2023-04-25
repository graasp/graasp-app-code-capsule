import { FC } from 'react';

import { TextField } from '@mui/material';

type Props = {
  setValue: (value: string) => void;
  value: string;
};

const PreLoadedLibrariesInput: FC<Props> = ({ value, setValue }) => (
  <TextField
    fullWidth
    value={value}
    onChange={({ target }) => setValue(target.value)}
  />
);
export default PreLoadedLibrariesInput;
