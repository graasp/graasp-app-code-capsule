import { useTokenContext } from './TokenContext';
import { useContextContext } from './ContextContext';
import { hooks } from '../../config/queryClient';

type useAppDataType = {
  data: unknown;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

type useAppSettingsType = {
  data: unknown;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

type useAppContextType = {
  data: unknown;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  error: Error | null;
};

export const useAppData = (): useAppDataType => {
  const { itemId } = useContextContext();
  const token = useTokenContext();
  return hooks.useAppData({ token, itemId });
};

export const useAppSettings = (): useAppSettingsType => {
  const { itemId } = useContextContext();
  const token = useTokenContext();
  return hooks.useAppSettings({ token, itemId });
};

export const useAppContext = (): useAppContextType => {
  const { itemId } = useContextContext();
  const token = useTokenContext();
  return hooks.useAppContext({ token, itemId });
};
