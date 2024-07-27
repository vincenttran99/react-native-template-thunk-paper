import LocalizedStrings from 'react-native-localization';

import en from './locales/en';

/**
 * You can change language with
 * ```
 * languages.setLanguage("en");
 * ```
 */
const languages = new LocalizedStrings({
  en
});

export default languages;
