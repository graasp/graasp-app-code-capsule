export const GRAASP_LOGO_CYPRESS = 'graasp_logo';
export const TABLE_VIEW_TABLE_CYPRESS = 'table_view_table';
export const TABLE_VIEW_PANE_CYPRESS = 'table_view_pane';
export const SETTINGS_VIEW_PANE_CYPRESS = 'settings_view_pane';
export const PRESET_VIEW_PANE_CYPRESS = 'preset_view_pane_';
export const PLAYER_VIEW_CYPRESS = 'player_view';
export const ANALYZER_VIEW_CYPRESS = 'analyzer_view';
export const TAB_PRESET_VIEW_CYPRESS = 'tab_preset_view';
export const TAB_TABLE_VIEW_CYPRESS = 'tab_table_view';
export const TAB_SETTINGS_VIEW_CYPRESS = 'tab_settings_view';
export const TABLE_ROW_USERS_CYPRESS = 'table_row_users';
export const TABLE_VIEW_BODY_USERS_CYPRESS = 'table_view_body_users';
export const TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS =
  'table_view_open_review_button';
export const TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS =
  'table_view_user_review_dialog';
export const TABLE_VIEW_USERNAME_CELL_CYPRESS = 'table_view_username_cell';
export const TABLE_VIEW_HELP_NEEDED_CELL_CYPRESS =
  'table_view_help_needed_cell';
export const TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS =
  'table_view_nb_comments_cell';
export const TABLE_VIEW_VIEW_COMMENTS_CELL_CYPRESS =
  'table_view_view_comments_cell';
export const TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS =
  'table_view_review_dialog_close_button';

export const CUSTOM_DIALOG_TITLE_CYPRESS = 'custom_dialog_title';

export const NUMBER_OF_COMMENTS_CYPRESS = 'number_of_comments';
export const TABLE_NO_COMMENTS_CYPRESS = 'table_no_comments';
export const SETTINGS_SPEED_FAB_CYPRESS = 'settings_speed_fab';
export const DISPLAY_SETTINGS_FAB_CYPRESS = 'display_settings_fab';
export const CODE_SETTINGS_FAB_CYPRESS = 'code_settings_fab';
export const SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS =
  'settings_dialog_cancel_button';
export const SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS =
  'settings_dialog_save_button';
export const PROGRAMMING_LANGUAGE_SELECT_ID = 'programmingLanguageSelect';
export const PROGRAMMING_LANGUAGE_SELECT_CYPRESS =
  'programming_language_select';
export const SETTINGS_CODE_DIALOG_WINDOW_CYPRESS =
  'settings_code_dialog_window';
export const SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS =
  'settings_display_dialog_window';
export const SHOW_HEADER_SWITCH_CYPRESS = 'show_header_switch';
export const SHOW_TOOLBAR_SWITCH_CYPRESS = 'show_toolbar_switch';
export const SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS =
  'show_version_navigation_switch';
export const SHOW_EDIT_BUTTON_SWITCH_CYPRESS = 'show_edit_button_switch';
export const SHOW_VISIBILITY_SWITCH_CYPRESS = 'show_visibility_switch';
export const ALLOW_COMMENTS_SWITCH_CYPRESS = 'allow_comments_switch';
export const ALLOW_REPLIES_SWITCH_CYPRESS = 'allow_replies_switch';
export const REVIEW_MODES_SELECT_CYPRESS = 'review_modes_select';

export const tableRowUserCypress = (id: string): string =>
  `${TABLE_ROW_USERS_CYPRESS}-${id}`;
export const CODE_REVIEW_CONTAINER_CYPRESS = 'code_review_container';
export const CODE_REVIEW_ADD_BUTTON_CYPRESS = 'code_review_add_button';
export const CODE_REVIEW_LINE_CYPRESS = 'code_review_line';
export const CODE_REVIEW_LINE_CONTENT_CYPRESS = 'code_review_line_content';
export const buildAddButtonDataCy = (index: number): string =>
  `${CODE_REVIEW_ADD_BUTTON_CYPRESS}-${index}`;
export const COMMENT_EDITOR_CYPRESS = 'comment_editor';
export const COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS =
  'comment_editor_cancel_button';
export const COMMENT_EDITOR_SAVE_BUTTON_CYPRESS = 'comment_editor_save_button';
export const COMMENT_EDITOR_BOLD_BUTTON_CYPRESS = 'comment_editor_bold_button';
export const COMMENT_EDITOR_ITALIC_BUTTON_CYPRESS =
  'comment_editor_italic_button';
export const COMMENT_EDITOR_CODE_BUTTON_CYPRESS = 'comment_editor_code_button';
export const COMMENT_EDITOR_LINK_BUTTON_CYPRESS = 'comment_editor_link_button';
export const COMMENT_EDITOR_QUOTE_BUTTON_CYPRESS =
  'comment_editor_quote_button';
export const COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS =
  'comment_editor_line_info_text';
export const COMMENT_EDITOR_TEXTAREA_CYPRESS = 'comment_editor_textarea';
export const CODE_REVIEW_TOOLBAR_CYPRESS = 'comment_review_toolbar';
export const TOOLBAR_USER_SELECT_CYPRESS = 'toolbar_user_select';
export const TOOLBAR_VERSION_SELECT_CYPRESS = 'toolbar_version_select';
export const TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS = 'toolbar_commit_info';
export const TOOLBAR_EDIT_CODE_BUTTON_CYPRESS = 'toolbar_edit_code_button';
export const TOOLBAR_VISIBILITY_BUTTON_CYPRESS = 'toolbar_visibility_button';
export const TOOLBAR_RUN_CODE_BUTTON_CYPRESS = 'toolbar_run_code_button';
export const COMMENT_CONTAINER_CYPRESS = 'comment_container';
export const COMMENT_THREAD_CONTAINER_CYPRESS = 'comment_thread_container';
export const ORPHAN_BUTTON_CYPRESS = 'orphan_button';
export const CODE_EXECUTION_CONTAINER_CYPRESS = 'code_execution_container';
export const CODE_EDITOR_ID_CY = 'code_editor';
export const CODE_EDITOR_CONTAINER_CYPRESS = 'code_editor_container';
export const CODE_EDITOR_LANGUAGE_SELECT_CYPRESS =
  'code_editor_language_select';
export const CODE_EDITOR_COMMIT_MESSAGE_CYPRESS = 'code_editor_commit_message';
export const CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS =
  'code_editor_commit_description';
export const CODE_EDITOR_SUBMIT_BUTTON_CYPRESS = 'code_editor_submit_button';
export const CODE_EDITOR_CANCEL_BUTTON_CYPRESS = 'code_editor_cancel_button';

export const COMMIT_INFO_DIALOG_CYPRESS = 'commit_info_dialog';
export const COMMIT_INFO_FIELD_CYPRESS = 'commit_info_field';
export const buildCommitFieldDataCy = (fieldName: string): string =>
  `${COMMIT_INFO_FIELD_CYPRESS}-${fieldName}`;

export const REPL_CONTAINER_CY = 'repl_container';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
export const buildTableRowCypress = (selector: string): string =>
  `[data-cy=${selector}]`;
export const buildCommitFieldCypress = (selector: string): string =>
  `[data-cy=${selector}]`;

// export const CODE_EDITOR_CY = '.monaco-editor textarea:first';
