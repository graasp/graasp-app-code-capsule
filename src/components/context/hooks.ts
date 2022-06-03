import { List, Map } from 'immutable';
import { hooks } from '../../config/queryClient';

type useAppDataType = {
  data?: List<unknown>;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

type useAppSettingsType = {
  data?: List<unknown>;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

type useAppContextType = {
  data?: Map<unknown, unknown>;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAppData = () => hooks.useAppData();

export const useAppSettings = (): useAppSettingsType => hooks.useAppSettings();

export const useAppContext = (): useAppContextType => hooks.useAppContext();
