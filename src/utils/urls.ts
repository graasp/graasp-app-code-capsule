import qs from 'qs';

export const getItemIdFromQueryString = (): string | undefined => {
  const res = qs.parse(window.location.search, { ignoreQueryPrefix: true }) as {
    itemId?: string;
  };
  return res?.itemId;
};
