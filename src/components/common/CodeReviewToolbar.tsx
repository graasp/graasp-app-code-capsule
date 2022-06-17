import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Edit,
  PlayArrow,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';

import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH,
  INSTRUCTOR_CODE_ID,
  INSTRUCTOR_CODE_NAME,
} from '../../config/constants';
import { AppViews } from '../../config/layout';
import { SUPPORTED_EXECUTABLE_LANGUAGES } from '../../config/programmingLanguages';
import {
  CODE_REVIEW_TOOLBAR_CYPRESS,
  TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
  TOOLBAR_RUN_CODE_BUTTON_CYPRESS,
  TOOLBAR_VISIBILITY_BUTTON_CYPRESS,
} from '../../config/selectors';
import { DEFAULT_LINE_HIDDEN_STATE } from '../../config/settings';
import { CodeVersionSelectType } from '../../interfaces/codeVersions';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import { getFormattedTime } from '../../utils/datetime';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { useSettings } from '../context/SettingsContext';
import { useVisibilityContext } from '../context/VisibilityContext';
import CustomSelect from '../layout/CustomSelect';
import ToolbarButton from '../layout/ToolbarButton';

const getVersionLabel = (
  { data, updatedAt }: CodeVersionSelectType,
  lang: string,
): string => {
  const { commitMessage } = data;
  let msg = commitMessage || INSTRUCTOR_CODE_NAME;
  // if message id too long: truncate and add ellipsis
  if (msg.length > DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH) {
    msg = `${commitMessage.slice(
      0,
      DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH,
    )}...`;
  }
  // format createdAt date
  // a placeholder is used if the property does not exist (fake API)
  const date = updatedAt ? getFormattedTime(updatedAt, lang) : 'N.D.';
  return `${msg} - ${date}`;
};

type Props = {
  setView: (view: AppViews) => void;
};

const CodeReviewToolbar: FC<Props> = ({ setView }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const { toggleAll } = useVisibilityContext();
  const { groupedVersions, setCodeId } = useCodeVersionContext();
  const showToolbar = settings[SETTINGS_KEYS.SHOW_TOOLBAR];
  const showEditButton = settings[SETTINGS_KEYS.SHOW_EDIT_BUTTON];
  const showVisibilityToggle = settings[SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON];
  const showCommitInfo = settings[SETTINGS_KEYS.SHOW_VERSION_NAVIGATION];
  const isExecutable = SUPPORTED_EXECUTABLE_LANGUAGES.includes(
    settings[SETTINGS_KEYS.PROGRAMMING_LANGUAGE],
  );
  const [isHidden, setIsHidden] = useState(DEFAULT_LINE_HIDDEN_STATE);
  const [selectedUser, setSelectedUser] = useState(
    groupedVersions[0].user.value,
  );
  const [selectedVersion, setSelectedVersion] = useState(
    groupedVersions[0].user.value,
  );
  const userOptions = groupedVersions.map((r) => r.user);
  const versionOptions = groupedVersions
    .find((v) => v.user.value === selectedUser)
    ?.versions.map((v) => ({
      label: getVersionLabel(v, i18n.language),
      value: v.id,
    })) || [{ label: INSTRUCTOR_CODE_NAME, value: INSTRUCTOR_CODE_ID }];

  const changeAndShowVersion = (id: string): void => {
    setSelectedVersion(id);
    setCodeId(id);
  };

  useEffect(() => {
    const defaultId = versionOptions[0].value;
    changeAndShowVersion(defaultId);
  }, [selectedUser]);

  if (!showToolbar) {
    return null;
  }

  const handleToggleVisibility = (): void => {
    setIsHidden(!isHidden);
    toggleAll(!isHidden);
  };

  const userSelect = (
    <CustomSelect
      onChange={setSelectedUser}
      label={t('User Select')}
      value={selectedUser}
      values={userOptions}
    />
  );

  const versionSelect = (
    <CustomSelect
      onChange={(id) => {
        setSelectedVersion(id);
        setCodeId(id);
      }}
      label={t('User Select')}
      value={selectedVersion}
      values={versionOptions}
    />
  );

  const executeCodeButton = (
    <Tooltip title={t('Run')}>
      <span>
        <ToolbarButton
          disabled
          dataCy={TOOLBAR_RUN_CODE_BUTTON_CYPRESS}
          onClick={() => setView(AppViews.CodeExecution)}
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
        onClick={() => console.log('info clicked')}
      >
        <FontAwesomeIcon width={14} fontSize="inherit" icon={faInfo} />
      </ToolbarButton>
    </Tooltip>
  );

  const editButton = (
    <Tooltip title={t('Edit')}>
      <ToolbarButton
        dataCy={TOOLBAR_EDIT_CODE_BUTTON_CYPRESS}
        onClick={() => setView(AppViews.CodeEditor)}
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
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      data-cy={CODE_REVIEW_TOOLBAR_CYPRESS}
    >
      <Stack direction="row" spacing={1}>
        {userSelect}
        {versionSelect}
      </Stack>
      <Stack direction="row" spacing={1}>
        <>
          {showCommitInfo && infoButton}
          {showEditButton && editButton}
          {isExecutable && executeCodeButton}
          {showVisibilityToggle && toggleVisibilityButton}
        </>
      </Stack>
    </Stack>
  );
};

export default CodeReviewToolbar;
