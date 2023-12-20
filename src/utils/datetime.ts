import { Locale, formatDistance } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import { fr } from 'date-fns/locale/fr';

// to add a new language to the dates
const locales: { [key: string]: Locale } = {
  fr,
  en: enGB,
};

export const NO_DATE_PLACEHOLDER = 'N.D.';

const getFormattedTime = (time: Date, lang: string): string =>
  Number.isNaN(time)
    ? NO_DATE_PLACEHOLDER
    : formatDistance(time, new Date(), {
        includeSeconds: true,
        addSuffix: true, // adds "ago" at the end
        locale: locales[lang], // provides localization
      });

export { getFormattedTime };
