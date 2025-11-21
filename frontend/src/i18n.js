import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import frCommon from './locales/fr/common.json';
import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

const resources = {
  fr: {
    common: frCommon
  },
  ar: {
    common: arCommon
  },
  en: {
    common: enCommon
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      checkWhitelist: true
    },
    supportedLngs: ['fr', 'ar', 'en']
  });

export default i18n;
