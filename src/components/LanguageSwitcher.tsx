"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n"; // Import your i18n config

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
    setSelectedLang(savedLang);
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setSelectedLang(lang);
  };

  const langs = [
    { lang: "rw", name: "Kinyarwanda" },
    { lang: "en", name: "English" },
    { lang: "tz", name: "Kiswahili " },
    { lang: "fr", name: "Français" },
  ];

  return (
    <div className="text-center">
      <label className="font-bold">{t("language")}: </label>
      <div className="flex justify-center space-x-2 px-4 pb-4">
        {langs.map((lng) => (
          <label
            key={lng.lang}
            onClick={() => handleLanguageChange(lng.lang)}
            className={`cursor-pointer text-sm px-3 py-1 rounded ${
              selectedLang === lng.lang ? " text-[#e5b77f]" : ""
            }`}
          >
            {lng.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
