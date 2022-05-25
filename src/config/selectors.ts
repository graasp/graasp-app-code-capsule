export const GRAASP_LOGO_CYPRESS = 'graasp_logo';
export const TABLE_VIEW_TABLE_CYPRESS = 'table_view_table';
export const TABLE_VIEW_PANE_CYPRESS = 'table_view_pane';
export const PRESET_VIEW_PANE_CYPRESS = 'preset_view_pane_';
export const PLAYER_VIEW_CYPRESS = 'player_view';
export const TAB_PRESET_VIEW_CYPRESS = 'tab_preset_view';
export const TAB_TABLE_VIEW_CYPRESS = 'tab_table_view';
export const TABLE_ROW_USERS_CYPRESS = 'table_row_users';
export const TABLE_VIEW_BODY_USERS_CYPRESS = 'table_view_body_users';
export const NUMBER_OF_COMMENTS_CYPRESS = 'number_of_comments';
export const TABLE_NO_COMMENTS_CYPRESS = 'table_no_comments';
export const SETTINGS_FAB_CYPRESS = 'settings_fab';
export const SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS =
  'settings_dialog_cancel_button';
export const SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS =
  'settings_dialog_save_button';
export const PROGRAMMING_LANGUAGE_SELECT_ID = 'programmingLanguageSelect';
export const PROGRAMMING_LANGUAGE_SELECT_CYPRESS =
  'programming_language_select';
export const SETTINGS_DIALOG_WINDOW_CYPRESS = 'settings_dialog_window';
export const SHOW_HEADER_SWITCH_CYPRESS = 'show_header_switch';
export const SHOW_TOOLBAR_SWITCH_CYPRESS = 'show_toolbar_switch';
export const SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS =
  'show_version_navigation_switch';
export const SHOW_EDIT_BUTTON_SWITCH_CYPRESS = 'show_edit_button_switch';
export const SHOW_VISIBILITY_SWITCH_CYPRESS = 'show_visibility_switch';
export const ALLOW_COMMENTS_SWITCH_CYPRESS = 'allow_comments_switch';
export const ALLOW_REPLIES_SWITCH_CYPRESS = 'allow_replies_switch';
export const tableRowUserCypress = (id: string): string =>
  `${TABLE_ROW_USERS_CYPRESS}-${id}`;

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
export const buildTableRowCypress = (selector: string): string =>
  `[data-cy=${selector}]`;
