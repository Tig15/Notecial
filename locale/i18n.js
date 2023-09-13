import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import sp from './sp.json';

const resources = {
  en: {
    translation: en,
  },
  sp: {
    translation: sp,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'sp',
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});
