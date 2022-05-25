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

export const useAppData = (): useAppDataType => hooks.useAppData();

export const useAppSettings = (): useAppSettingsType => hooks.useAppSettings();

export const useAppContext = (): useAppContextType => hooks.useAppContext();
