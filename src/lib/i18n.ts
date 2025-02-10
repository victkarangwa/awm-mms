import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import rw from "@/locales/rw.json";

i18n
  // .use(LanguageDetector) // Auto-detect user language
  .use(initReactI18next)
  .init({
    resources: {
      rw: { translation: rw },
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "rw", // Default language
    interpolation: { escapeValue: false },
  });

export default i18n;
