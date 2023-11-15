import { APP_DATA_TYPES } from '@/config/appDataTypes';

export interface ThreadMessage {
  type: APP_DATA_TYPES.BOT_COMMENT | APP_DATA_TYPES.COMMENT;
  data: {
    content: string;
  };
}
