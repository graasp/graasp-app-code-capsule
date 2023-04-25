import React, {
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import { AppMode } from '../../config/appSettingsTypes';
import { DEFAULT_APP_MODE } from '../../config/settings';

type AppModeContextType = {
  appMode?: AppMode;
  onChange: (newValue: AppMode) => void;
};

const AppModeContext = React.createContext<AppModeContextType>({
  appMode: DEFAULT_APP_MODE,
  onChange: () => null,
});

export const AppModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<AppMode | undefined>();
  const contextValue = useMemo(
    () => ({
      appMode: value,
      onChange: (newValue: AppMode) => setValue(newValue),
    }),
    [value],
  );
  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = (): AppModeContextType => useContext(AppModeContext);
