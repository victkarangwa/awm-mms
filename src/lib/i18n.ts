import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import rw from "@/locales/rw.json";
import tz from "@/locales/tz.json";

// Load language from localStorage or default to English
// first check if localStorage is available in the browser
let savedLanguage = "rw";
if (typeof window !== "undefined")
  savedLanguage = localStorage.getItem("language") || "rw";

i18n
  .use(LanguageDetector) // Auto-detect user language
  .use(initReactI18next)
  .init({
    resources: {
      rw: { translation: rw },
      en: { translation: en },
      fr: { translation: fr },
      tz: { translation: tz },
    },
    lng: savedLanguage, // Set the language from localStorage
    fallbackLng: "rw", // Default language
    interpolation: { escapeValue: false },
  });

// Function to change language and store it in localStorage
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng); // Store language preference
};

export default i18n;
