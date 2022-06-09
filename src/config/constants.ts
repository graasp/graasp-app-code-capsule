export const GRAASP_LOGO_HEADER_HEIGHT = 40;

// Admin view constants
export const NB_COL_TABLE_VIEW_TABLE = 4;

// reset timeout in ms for settings dialog
export const CLOSE_SETTINGS_TIMEOUT = 500;

export const ANONYMOUS_USER = 'Anonymous';

export const JAVASCRIPT = 'javascript';
export const JAVA = 'java';
export const PYTHON = 'python';
export const MATLAB = 'matlab';
export const JSON_LANG = 'json';

export const REVIEW_MODE_INDIVIDUAL = 'individual';
export const REVIEW_MODE_COLLABORATIVE = 'collaborative';

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
