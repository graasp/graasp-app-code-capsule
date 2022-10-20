import React, {
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

export enum AppMode {
  Execute,
  Review,
  Collaborate,
}

type AppModeContextType = {
  value?: AppMode;
  onChange: (newValue: AppMode) => void;
};

const AppModeContext = React.createContext<AppModeContextType>({
  value: undefined,
  onChange: () => null,
});

export const AppModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState<AppMode | undefined>();
  const contextValue = useMemo(
    () => ({ value, onChange: (newValue: AppMode) => setValue(newValue) }),
    [value],
  );
  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = (): AppModeContextType => useContext(AppModeContext);
