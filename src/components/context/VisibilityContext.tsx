import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_LINE_HIDDEN_STATE } from '../../config/settings';
import { useCodeVersionContext } from './CodeVersionContext';

type VisibilityContextType = {
  lineHiddenState: boolean[];
  toggleLineVisibility: (lineIndex: number) => void;
  toggleAll: (value: boolean) => void;
};
// eslint-disable-next-line @typescript-eslint/ban-types
type Prop = {};

const defaultContextValue: VisibilityContextType = {
  lineHiddenState: [],
  toggleLineVisibility: (lineIndex: number) =>
    // eslint-disable-next-line no-console
    console.log(`Toggling line index ${lineIndex}`),
  toggleAll: (value: boolean) =>
    // eslint-disable-next-line no-console
    console.log(`toggled line visibility to ${value}`),
};

const VisibilityContext =
  createContext<VisibilityContextType>(defaultContextValue);

export const VisibilityProvider: FC<PropsWithChildren<Prop>> = ({
  children,
}) => {
  // todo: add code from codeVersions and compute the number of lines
  const { codeVersion } = useCodeVersionContext();

  const numberOfLines = codeVersion.code.split('\n').length;

  const defaultValue = Array.from(
    { length: numberOfLines },
    () => DEFAULT_LINE_HIDDEN_STATE,
  );

  const [lineHiddenState, setLineHiddenState] = useState(defaultValue);

  useEffect(
    () => {
      setLineHiddenState(defaultValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [numberOfLines],
  );

  const toggleLineVisibility = (lineIndex: number): void => {
    setLineHiddenState((prevLineHiddenState) =>
      prevLineHiddenState.map((lineState, i) =>
        i === lineIndex ? !lineState : lineState,
      ),
    );
  };
  const toggleAll = (value: boolean): void => {
    const newlineHiddenState = Array.from(
      { length: numberOfLines },
      () => value,
    );
    setLineHiddenState(newlineHiddenState);
  };

  const contextValue = useMemo(
    () => ({
      lineHiddenState,
      toggleLineVisibility,
      toggleAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineHiddenState],
  );

  return (
    <VisibilityContext.Provider value={contextValue}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibilityContext = (): VisibilityContextType =>
  useContext<VisibilityContextType>(VisibilityContext);
