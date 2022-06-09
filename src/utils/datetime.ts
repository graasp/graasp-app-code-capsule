// known problem with date-fns:
// https://stackoverflow.com/questions/63375527/how-to-set-up-imported-multiple-times-rule-for-date-fns-in-eslint
// eslint-disable-next-line import/no-duplicates
import { formatDistance } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { fr, enGB } from 'date-fns/locale';

// to add a new language to the dates
const locales: { [key: string]: Locale } = {
  fr,
  en: enGB,
};

const getFormattedTime = (time: string, lang: string): string =>
  formatDistance(Date.parse(time), new Date(), {
    addSuffix: true, // adds "ago" at the end
    locale: locales[lang], // provides localization
  });

export { getFormattedTime };
