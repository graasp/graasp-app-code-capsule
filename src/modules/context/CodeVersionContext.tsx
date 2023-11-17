import React, {
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
} from 'react';

import { Member } from '@graasp/sdk';

import type { Dictionary } from 'lodash';
import groupBy from 'lodash.groupby';

import { INSTRUCTOR_CODE_VERSION_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  INSTRUCTOR_CODE_ID,
  INSTRUCTOR_CODE_NAME,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS } from '../../config/settings';
import {
  CodeVersionSelectType,
  CodeVersionType,
} from '../../interfaces/codeVersions';
import { useAppDataContext } from './AppDataContext';

type CodeVersionContextType = {
  codeVersionResource: CodeVersionSelectType;
  codeVersion: CodeVersionType;
  groupedVersions: Dictionary<CodeVersionSelectType[]>;
  codeId: string; // id of the appData with the current code
  setCodeId: (id: string) => void;
};

const defaultCodeVersion = {
  id: INSTRUCTOR_CODE_ID,
  data: DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
  creator: { id: INSTRUCTOR_CODE_ID, name: INSTRUCTOR_CODE_NAME } as Member,
  updatedAt: new Date().toISOString(),
} as CodeVersionSelectType;

const defaultContextValue: CodeVersionContextType = {
  codeVersionResource: defaultCodeVersion,
  codeVersion: defaultCodeVersion.data,
  groupedVersions: {},
  codeId: INSTRUCTOR_CODE_ID,
  setCodeId: () => {
    // do nothing
  },
};

const CodeVersionContext =
  createContext<CodeVersionContextType>(defaultContextValue);

// eslint-disable-next-line @typescript-eslint/ban-types
type Prop = {};

export const CodeVersionProvider: FC<PropsWithChildren<Prop>> = ({
  children,
}) => {
  const [codeId, setCodeId] = useState(INSTRUCTOR_CODE_ID);
  const appSettings = hooks.useAppSettings();
  const { codeAppData } = useAppDataContext();
  const codeVersions = codeAppData?.map(({ id, data, creator, updatedAt }) => ({
    id,
    data,
    creator,
    updatedAt,
  })) as CodeVersionSelectType[];
  const instructorCodeVersionSetting = appSettings.data?.find(
    (s) => s.name === INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  );

  const contextValue = useMemo(() => {
    // todo: refactor this
    const instructorCodeVersion: CodeVersionSelectType = {
      ...defaultCodeVersion,
      data:
        (instructorCodeVersionSetting?.data as CodeVersionSelectType['data']) ||
        DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
      updatedAt: instructorCodeVersionSetting
        ? instructorCodeVersionSetting?.updatedAt
        : defaultCodeVersion.updatedAt,
    };
    const allCodeVersions = [...codeVersions, instructorCodeVersion];

    const groupedVersions = groupBy(codeVersions, (c) => c.creator.id);
    groupedVersions[INSTRUCTOR_CODE_ID] = [instructorCodeVersion];

    const codeVersionResource =
      allCodeVersions?.find((c) => c.id === codeId) || instructorCodeVersion;

    const value: CodeVersionContextType = {
      codeVersionResource,
      codeVersion: codeVersionResource.data,
      // compile all versions and put teacher version first
      groupedVersions,
      codeId,
      setCodeId: (id: string) => {
        setCodeId(id);
      },
    };

    return value;
  }, [codeId, codeVersions, instructorCodeVersionSetting]);

  return (
    <CodeVersionContext.Provider value={contextValue}>
      {children}
    </CodeVersionContext.Provider>
  );
};
export const useCodeVersionContext = (): CodeVersionContextType =>
  React.useContext<CodeVersionContextType>(CodeVersionContext);
