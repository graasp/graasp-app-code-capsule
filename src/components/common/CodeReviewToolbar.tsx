import React, { FC, useState } from 'react';
import { Stack, Tooltip } from '@mui/material';
import { Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '../context/SettingsContext';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import {
  CODE_REVIEW_TOOLBAR_CYPRESS,
  TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
  TOOLBAR_VISIBILITY_BUTTON_CYPRESS,
} from '../../config/selectors';
import ToolbarButton from '../layout/ToolbarButton';
import { useVisibilityContext } from '../context/VisibilityContext';
import { DEFAULT_LINE_HIDDEN_STATE } from '../../config/settings';

// todo: remove this once there are props
// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

// todo: remove if not needed
// eslint-disable-next-line arrow-body-style
const CodeReviewToolbar: FC<Props> = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const showToolbar = settings[SETTINGS_KEYS.SHOW_TOOLBAR];
  const showEditButton = settings[SETTINGS_KEYS.SHOW_EDIT_BUTTON];
  const showVisibilityToggle = settings[SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON];
  const showCommitInfo = settings[SETTINGS_KEYS.SHOW_VERSION_NAVIGATION];
  const [isHidden, setIsHidden] = useState(DEFAULT_LINE_HIDDEN_STATE);
  const { toggleAll } = useVisibilityContext();

  if (!showToolbar) {
    return null;
  }

  const handleToggleVisibility = (): void => {
    setIsHidden(!isHidden);
    toggleAll(!isHidden);
  };

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
        onClick={() => console.log('edit clicked')}
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
      <div>This is where we will have dropdowns</div>
      <Stack direction="row" spacing={1}>
        <>
          {showCommitInfo && infoButton}
          {showEditButton && editButton}
          {showVisibilityToggle && toggleVisibilityButton}
        </>
      </Stack>
    </Stack>
  );
};

export default CodeReviewToolbar;
