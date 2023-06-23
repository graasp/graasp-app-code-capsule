import React, {
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
} from 'react';

import { Member, convertJs } from '@graasp/sdk';

import { List, Map } from 'immutable';

import { INSTRUCTOR_CODE_VERSION_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  INSTRUCTOR_CODE_ID,
  INSTRUCTOR_CODE_NAME,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS } from '../../config/settings';
import {
  CodeVersionSelectType,
  CodeVersionSelectTypeRecord,
  CodeVersionTypeRecord,
} from '../../interfaces/codeVersions';
import { useAppDataContext } from './AppDataContext';

type CodeVersionContextType = {
  codeVersionResource: CodeVersionSelectTypeRecord;
  codeVersion: CodeVersionTypeRecord;
  groupedVersions: Map<string, List<CodeVersionSelectTypeRecord>>;
  codeId: string; // id of the appData with the current code
  setCodeId: (id: string) => void;
};

const defaultCodeVersion = convertJs({
  id: INSTRUCTOR_CODE_ID,
  data: DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS.toJS(),
  creator: { id: INSTRUCTOR_CODE_ID, name: INSTRUCTOR_CODE_NAME } as Member,
  updatedAt: new Date(),
}) as CodeVersionSelectTypeRecord;

const defaultContextValue: CodeVersionContextType = {
  codeVersionResource: defaultCodeVersion,
  codeVersion: defaultCodeVersion.data,
  groupedVersions: Map(),
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
  const codeVersions =
    (codeAppData?.map(({ id, data, creator, updatedAt }) => ({
      id,
      data,
      creator,
      updatedAt,
    })) as List<CodeVersionSelectTypeRecord>) ?? List();
  const instructorCodeVersionSetting = appSettings.data?.find(
    (s) => s.name === INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  );

  const contextValue = useMemo(() => {
    // todo: refactor this
    const instructorCodeVersion: CodeVersionSelectTypeRecord = convertJs({
      ...defaultCodeVersion.toJS(),
      data:
        (instructorCodeVersionSetting?.data.toJS() as CodeVersionSelectType['data']) ||
        DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS.toJS(),
      updatedAt:
        instructorCodeVersionSetting?.updatedAt || defaultCodeVersion.updatedAt,
    });
    const allCodeVersions = codeVersions.push(instructorCodeVersion);

    const groupedVersions = codeVersions
      .groupBy((c) => c.creator.id)
      .set(INSTRUCTOR_CODE_ID, List([instructorCodeVersion])) as Map<
      string,
      List<CodeVersionSelectTypeRecord>
    >;

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
