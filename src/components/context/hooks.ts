import { useTokenContext } from './TokenContext';
import { useContextContext } from './ContextContext';
import { hooks } from '../../config/queryClient';

export const useAppData = (): any => {
  const { itemId } = useContextContext();
  const token = useTokenContext();
  const query = hooks.useAppData({ token, itemId });
  return query;
};

export const useAppSettings = (): any => {
  const { itemId } = useContextContext();
  const token = useTokenContext();
  const query = hooks.useAppSettings({ token, itemId });
  return query;
};

export const useAppContext = (): any => {
  const { itemId } = useContextContext();
  const token = useTokenContext();
  const query = hooks.useAppContext({ token, itemId });
  return query;
};
