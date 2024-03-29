export const GRAASP_LOGO_HEADER_HEIGHT = 40;
export const BUTTON_LOADER_SIZE = 24;

// Admin view constants
export const NB_COL_TABLE_VIEW_TABLE = 4;

// reset timeout in ms for settings dialog
export const CLOSE_SETTINGS_TIMEOUT = 500;

// commit message truncation length
export const DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH = 15;

export const MAX_INITIALS_AVATAR = 2;

export const DEFAULT_REPL_INPUT_VALUE = '';

export const ANONYMOUS_USER = 'Anonymous';
export const INSTRUCTOR_CODE_NAME = 'Default';

export const INSTRUCTOR_CODE_ID = 'instructor';

export const REVIEW_MODE_INDIVIDUAL = 'individual';
export const REVIEW_MODE_COLLABORATIVE = 'collaborative';

export const VISIBILITY_MEMBER = 'member';
export const VISIBILITY_ITEM = 'item';

export const REVIEW_MODES = [
  {
    label: 'Individual - Each student works in isolation',
    value: REVIEW_MODE_INDIVIDUAL,
  },
  {
    label: 'Collaborative - Students see other students work',
    value: REVIEW_MODE_COLLABORATIVE,
  },
] as const;

export const DEFAULT_BOT_USERNAME = 'Graasp Bot';

export const DEFAULT_CHATBOT_PROMPT_APP_DATA = { chatbotPromptSettingId: '' };

export const CHAT_BOT_ERROR_MESSAGE = 'Sorry, an error occurred.';
