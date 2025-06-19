import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Edit,
  PlayArrow,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Stack, Tooltip, styled } from '@mui/material';

import { Member, UUID } from '@graasp/sdk';

import { TFunction } from 'i18next';
import { InfoIcon } from 'lucide-react';

import { LodashGroupByDict, flattenDictionary } from '@/utils/utils';

import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  ANONYMOUS_USER,
  DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH,
  INSTRUCTOR_CODE_ID,
  INSTRUCTOR_CODE_NAME,
} from '../../config/constants';
import { AppView } from '../../config/layout';
import { SUPPORTED_EXECUTABLE_LANGUAGES } from '../../config/programmingLanguages';
import {
  CODE_REVIEW_TOOLBAR_CYPRESS,
  COMMIT_INFO_DIALOG_CYPRESS,
  TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
  TOOLBAR_RUN_CODE_BUTTON_CYPRESS,
  TOOLBAR_USER_SELECT_CYPRESS,
  TOOLBAR_VERSION_SELECT_CYPRESS,
  TOOLBAR_VISIBILITY_BUTTON_CYPRESS,
} from '../../config/selectors';
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_LINE_HIDDEN_STATE,
} from '../../config/settings';
import { CodeVersionSelectType } from '../../interfaces/codeVersions';
import { GeneralSettingsKeys } from '../../interfaces/settings';
import { NO_DATE_PLACEHOLDER, getFormattedTime } from '../../utils/datetime';
import CommitInfo from '../common/CommitInfo';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { useSettings } from '../context/SettingsContext';
import { useVisibilityContext } from '../context/VisibilityContext';
import CustomDialog from '../layout/CustomDialog';
import CustomSelect from '../layout/CustomSelect';
import ToolbarButton from '../layout/ToolbarButton';

// generate the labels
const getVersionLabel = (
  { data, updatedAt }: CodeVersionSelectType,
  t: TFunction,
  lang: string,
): string => {
  const { commitMessage } = data;
  let msg = commitMessage || t('No Commit Message');
  // if message is too long: truncate and add ellipsis
  if (msg.length > DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH) {
    msg = `${commitMessage.slice(
      0,
      DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH,
    )}…`;
  }
  // format updatedAt date
  // a placeholder is used if the property does not exist (fake API)
  const date = updatedAt
    ? getFormattedTime(new Date(updatedAt), lang)
    : NO_DATE_PLACEHOLDER;
  return `${msg} - ${date}`;
};

const StyledStack = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

type Props = {
  setView?: (view: AppView) => void;
};

const CodeReviewToolbar: FC<Props> = ({ setView }) => {
  const { t, i18n } = useTranslation();
  const { [GENERAL_SETTINGS_NAME]: settings = DEFAULT_GENERAL_SETTINGS } =
    useSettings();
  const { toggleAll } = useVisibilityContext();
  const {
    groupedVersions,
    setCodeId,
    codeVersion,
    codeId,
    codeVersionResource,
  } = useCodeVersionContext();
  const showToolbar = settings[GeneralSettingsKeys.ShowToolbar];
  const showEditButton = settings[GeneralSettingsKeys.ShowEditButton];
  const showRunButton = settings[GeneralSettingsKeys.ShowRunButton];
  const showVisibilityToggle =
    settings[GeneralSettingsKeys.ShowVisibilityButton];
  const showCommitInfo = settings[GeneralSettingsKeys.ShowVersionNavigation];
  const isExecutable = SUPPORTED_EXECUTABLE_LANGUAGES.includes(
    codeVersion.language,
  );
  const [isOpenCommitInfo, setIsOpenCommitInfo] = useState(false);
  const [isHidden, setIsHidden] = useState(DEFAULT_LINE_HIDDEN_STATE);

  const getFormattedVersionOptions = (
    versions?: CodeVersionSelectType[],
  ): { label: string; value: string }[] =>
    versions?.map((v) => ({
      label: getVersionLabel(v, t, i18n.language),
      value: v.id,
    })) || [{ label: INSTRUCTOR_CODE_NAME, value: INSTRUCTOR_CODE_ID }];

  const [selectedUserId, setSelectedUserId] = useState<UUID>();

  // extract distinct authors from grouped comments by author
  const getUsersFromVersions = (
    versions: LodashGroupByDict<CodeVersionSelectType[]>,
  ): Member[] =>
    Object.values(versions)
      .map((v) => v[0]?.creator)
      .filter(Boolean) as Member[];

  const [userOptions, setUserOptions] = useState<Member[]>(
    getUsersFromVersions(groupedVersions),
  );

  const [versionOptions, setVersionOptions] =
    useState<CodeVersionSelectType[]>();
  // getFormattedVersionOptions(groupedVersions.keySeq()?.first()?.versions),

  const [selectedVersionId, setSelectedVersionId] = useState<UUID>();
  // called when the user changes
  // only sets the new codeId and not the select value directly
  const resetVersionSelect = (userId: string): void => {
    const newVersionOptions = groupedVersions[userId];
    if (!newVersionOptions) {
      return;
    }
    const defaultId = newVersionOptions[0]?.id;
    if (!defaultId) {
      return;
    }
    setCodeId(defaultId);
  };

  // update the values when the codeId changes
  useEffect(
    () => {
      const flatGroupedVersions = flattenDictionary(groupedVersions);
      const versions = flatGroupedVersions.flat();
      const version = versions.find((v) => v.id === codeId);

      if (!version) {
        return;
      }
      const newUser = version.creator;
      const newVersionOptions = groupedVersions[newUser.id];

      setUserOptions(getUsersFromVersions(groupedVersions));
      setVersionOptions(newVersionOptions);
      setSelectedVersionId(version.id);
      setSelectedUserId(newUser.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [codeId, groupedVersions, i18n.language],
  );

  if (!showToolbar) {
    return null;
  }

  const handleToggleVisibility = (): void => {
    setIsHidden(!isHidden);
    toggleAll(!isHidden);
  };

  const userSelect = (
    <CustomSelect
      dataCy={TOOLBAR_USER_SELECT_CYPRESS}
      onChange={(id) => {
        setSelectedUserId(id);
        resetVersionSelect(id);
      }}
      label={t('User')}
      value={selectedUserId}
      values={userOptions.map(({ id, name }) => ({
        value: id,
        label: name ?? ANONYMOUS_USER,
      }))}
    />
  );

  const versionSelect = (
    <CustomSelect
      dataCy={TOOLBAR_VERSION_SELECT_CYPRESS}
      onChange={(id) => {
        setCodeId(id);
      }}
      label={t('Version')}
      value={selectedVersionId}
      values={getFormattedVersionOptions(versionOptions)}
    />
  );

  const executeCodeButton = setView && (
    <Tooltip title={t('Run')}>
      <span>
        <ToolbarButton
          dataCy={TOOLBAR_RUN_CODE_BUTTON_CYPRESS}
          onClick={() => setView(AppView.CodeExecution)}
        >
          <PlayArrow fontSize="inherit" />
        </ToolbarButton>
      </span>
    </Tooltip>
  );

  const infoButton = (
    <Tooltip title={t('Commit Info')}>
      <ToolbarButton
        dataCy={TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS}
        onClick={() => setIsOpenCommitInfo(true)}
      >
        <InfoIcon width={14} fontSize="inherit" />
      </ToolbarButton>
    </Tooltip>
  );

  const editButton = setView && (
    <Tooltip title={t('Edit')}>
      <ToolbarButton
        dataCy={TOOLBAR_EDIT_CODE_BUTTON_CYPRESS}
        onClick={() => setView(AppView.CodeEditor)}
      >
        <Edit fontSize="inherit" />
      </ToolbarButton>
    </Tooltip>
  );

  const toggleVisibilityButton = (
    <Tooltip title={t('Toggle Visibility')}>
      <ToolbarButton
        dataCy={TOOLBAR_VISIBILITY_BUTTON_CYPRESS}
        onClick={handleToggleVisibility}
      >
        {isHidden ? (
          <Visibility fontSize="inherit" />
        ) : (
          <VisibilityOff fontSize="inherit" />
        )}
      </ToolbarButton>
    </Tooltip>
  );

  return (
    <>
      <StyledStack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        data-cy={CODE_REVIEW_TOOLBAR_CYPRESS}
        spacing={1}
      >
        {showCommitInfo ? (
          <Stack direction="row" spacing={1} maxWidth="70%">
            {userSelect}
            {versionSelect}
          </Stack>
        ) : (
          <span />
        )}
        <Stack direction="row" spacing={1}>
          {showCommitInfo && infoButton}
          {showEditButton && editButton}
          {showRunButton && isExecutable && executeCodeButton}
          {showVisibilityToggle && toggleVisibilityButton}
        </Stack>
      </StyledStack>
      <CustomDialog
        dataCy={COMMIT_INFO_DIALOG_CYPRESS}
        title={t('Commit Info')}
        open={isOpenCommitInfo}
        onClose={() => setIsOpenCommitInfo(false)}
        content={<CommitInfo commitResource={codeVersionResource} />}
      />
    </>
  );
};

export default CodeReviewToolbar;
