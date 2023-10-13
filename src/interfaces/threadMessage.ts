import { APP_DATA_TYPES } from '@/config/appDataTypes';

export interface ThreadMessage {
  type: APP_DATA_TYPES;
  data: {
    content: string;
  };
}
