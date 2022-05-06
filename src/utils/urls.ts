import qs from 'qs';

export const getitemIdFromQueryString = (): string | undefined => {
  const res = qs.parse(window.location.search, { ignoreQueryPrefix: true }) as {
    itemId?: string;
  };
  return res?.itemId;
};
