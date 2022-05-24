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
export const CODE_EDITOR_SETTINGS_CYPRESS = 'code_editor_settings';
export const SETTINGS_DIALOG_WINDOW_CYPRESS = 'settings_dialog_window';
export const tableRowUserCypress = (id: string): string =>
  `${TABLE_ROW_USERS_CYPRESS}-${id}`;

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
export const buildTableRowCypress = (selector: string): string =>
  `[data-cy=${selector}]`;
