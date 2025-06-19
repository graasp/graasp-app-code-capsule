enum APP_DATA_TYPES {
  COMMENT = 'comment',
  TEACHER_COMMENT = 'teacher_comment',
  BOT_COMMENT = 'bot_comment',
  CODE = 'code',
  LIVE_CODE = 'live_code',
  FLAG = 'flag',
}

export const COMMENT_APP_DATA_TYPES: string[] = [
  APP_DATA_TYPES.TEACHER_COMMENT,
  APP_DATA_TYPES.COMMENT,
  APP_DATA_TYPES.BOT_COMMENT,
];

export { APP_DATA_TYPES };
