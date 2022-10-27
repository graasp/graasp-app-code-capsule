import { List } from 'immutable';

import React, {
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
} from 'react';

import { INSTRUCTOR_CODE_VERSION_SETTINGS_NAME } from '../../config/appSettingsTypes';
import { DEFAULT_CODE_VERSION_SETTING } from '../../config/codeVersions';
import {
  ANONYMOUS_USER,
  INSTRUCTOR_CODE_ID,
  INSTRUCTOR_CODE_NAME,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  CodeVersionSelectType,
  CodeVersionType,
} from '../../interfaces/codeVersions';
import { useAppDataContext } from './AppDataContext';
import { useMembersContext } from './MembersContext';

type CodeVersionContextType = {
  codeVersionResource: CodeVersionSelectType;
  codeVersion: CodeVersionType;
  groupedVersions: {
    user: { value: string; label: string };
    versions: CodeVersionSelectType[];
  }[];
  codeId: string; // id of the appData with the current code
  setCodeId: (id: string) => void;
};

const defaultCodeVersion = {
  id: INSTRUCTOR_CODE_ID,
  data: DEFAULT_CODE_VERSION_SETTING,
  creator: INSTRUCTOR_CODE_NAME,
  updatedAt: '',
};

const defaultContextValue = {
  codeVersionResource: defaultCodeVersion,
  codeVersion: defaultCodeVersion.data,
  groupedVersions: [],
  codeId: INSTRUCTOR_CODE_ID,
  setCodeId: () => null,
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
  const members = useMembersContext();
  const { codeAppData } = useAppDataContext();
  const codeVersions = codeAppData?.map(({ id, data, creator, updatedAt }) => ({
    id,
    data,
    creator,
    updatedAt,
  })) as List<CodeVersionSelectType>;

  const instructorCodeVersionSetting = appSettings.data?.find(
    (s) => s.name === INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  );

  const contextValue = useMemo(() => {
    const instructorCodeVersion: CodeVersionSelectType = {
      ...defaultCodeVersion,
      data: (instructorCodeVersionSetting?.data ||
        DEFAULT_CODE_VERSION_SETTING) as CodeVersionType,
      updatedAt:
        instructorCodeVersionSetting?.updatedAt || defaultCodeVersion.updatedAt,
    };
    const allCodeVersions = codeVersions.push(instructorCodeVersion);

    const groupedVersions = codeVersions
      ?.groupBy((c) => c.creator)
      .toArray()
      .map(([creator, versions]) => ({
        user: {
          value: creator,
          label: members.find((m) => m.id === creator)?.name || ANONYMOUS_USER,
        },
        versions: versions.toArray() as CodeVersionSelectType[],
      }));
    const codeVersionResource =
      allCodeVersions?.find((c) => c.id === codeId) || instructorCodeVersion;
    return {
      codeVersionResource,
      codeVersion: codeVersionResource.data,
      // compile all versions and put teacher version first
      groupedVersions: [
        {
          user: { label: INSTRUCTOR_CODE_NAME, value: INSTRUCTOR_CODE_ID },
          versions: [instructorCodeVersion],
        },
        ...groupedVersions,
      ],
      codeId,
      setCodeId: (id: string): void => setCodeId(id),
    };
  }, [codeId, codeVersions, instructorCodeVersionSetting, members]);

  return (
    <CodeVersionContext.Provider value={contextValue}>
      {children}
    </CodeVersionContext.Provider>
  );
};
export const useCodeVersionContext = (): CodeVersionContextType =>
  React.useContext<CodeVersionContextType>(CodeVersionContext);
