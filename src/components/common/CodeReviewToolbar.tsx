import { i18n as i18nType } from 'i18next';

import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Edit,
  PlayArrow,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Stack, Tooltip, styled } from '@mui/material';

import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
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
import { DEFAULT_LINE_HIDDEN_STATE } from '../../config/settings';
import { CodeVersionSelectType } from '../../interfaces/codeVersions';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import { NO_DATE_PLACEHOLDER, getFormattedTime } from '../../utils/datetime';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { useSettings } from '../context/SettingsContext';
import { useVisibilityContext } from '../context/VisibilityContext';
import CustomDialog from '../layout/CustomDialog';
import CustomSelect from '../layout/CustomSelect';
import ToolbarButton from '../layout/ToolbarButton';
import CommitInfo from './CommitInfo';

// generate the labels
const getVersionLabel = (
  { data, updatedAt }: CodeVersionSelectType,
  i18n: i18nType,
): string => {
  const { commitMessage } = data;
  let msg = commitMessage || i18n.t('noCommitMessage');
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
    ? getFormattedTime(updatedAt, i18n.language)
    : NO_DATE_PLACEHOLDER;
  return `${msg} - ${date}`;
};

const StyledStack = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

type Props = {
  setView: (view: AppView) => void;
};

const CodeReviewToolbar: FC<Props> = ({ setView }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const { toggleAll } = useVisibilityContext();
  const {
    groupedVersions,
    setCodeId,
    codeVersion,
    codeId,
    codeVersionResource,
  } = useCodeVersionContext();
  const showToolbar = settings[SETTINGS_KEYS.SHOW_TOOLBAR];
  const showEditButton = settings[SETTINGS_KEYS.SHOW_EDIT_BUTTON];
  const showVisibilityToggle = settings[SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON];
  const showCommitInfo = settings[SETTINGS_KEYS.SHOW_VERSION_NAVIGATION];
  const isExecutable = SUPPORTED_EXECUTABLE_LANGUAGES.includes(
    codeVersion.language,
  );
  const [isOpenCommitInfo, setIsOpenCommitInfo] = useState(false);
  const [isHidden, setIsHidden] = useState(DEFAULT_LINE_HIDDEN_STATE);
  const [selectedUser, setSelectedUser] = useState(
    groupedVersions[0].user.value,
  );

  const getFormattedVersionOptions = (
    versions: CodeVersionSelectType[],
  ): { label: string; value: string }[] =>
    versions.map((v) => ({
      label: getVersionLabel(v, i18n),
      value: v.id,
    })) || [{ label: INSTRUCTOR_CODE_NAME, value: INSTRUCTOR_CODE_ID }];

  const [userOptions, setUserOptions] = useState(
    groupedVersions.map((r) => r.user),
  );

  const [versionOptions, setVersionOptions] = useState(
    getFormattedVersionOptions(groupedVersions[0].versions),
  );

  const [selectedVersion, setSelectedVersion] = useState(
    versionOptions[0].value,
  );

  // called when the user changes
  // only sets the new codeId and not the select value directly
  const resetVersionSelect = (userId: string): void => {
    const newVersionOptions = groupedVersions.find(
      (a) => a.user.value === userId,
    );
    if (!newVersionOptions) {
      return;
    }
    const defaultId = newVersionOptions.versions[0].id;
    setCodeId(defaultId);
  };

  // update the values when the codeId changes
  useEffect(
    () => {
      const version = groupedVersions.find((a) =>
        a.versions.find((b) => b.id === codeId),
      );
      if (!version) {
        return;
      }
      const newUser = version.user.value;
      const newVersionOptions = getFormattedVersionOptions(version.versions);

      setUserOptions(groupedVersions.map((r) => r.user));
      setVersionOptions(newVersionOptions);
      setSelectedVersion(codeId);
      setSelectedUser(newUser);
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
        setSelectedUser(id);
        resetVersionSelect(id);
      }}
      label={t('User')}
      value={selectedUser}
      values={userOptions}
    />
  );

  const versionSelect = (
    <CustomSelect
      dataCy={TOOLBAR_VERSION_SELECT_CYPRESS}
      onChange={(id) => {
        setCodeId(id);
      }}
      label={t('Version')}
      value={selectedVersion}
      values={versionOptions}
    />
  );

  const executeCodeButton = (
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
        <FontAwesomeIcon width={14} fontSize="inherit" icon={faInfo} />
      </ToolbarButton>
    </Tooltip>
  );

  const editButton = (
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
          {isExecutable && executeCodeButton}
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
