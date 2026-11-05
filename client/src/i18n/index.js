import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hy from "./locales/hy.json";
import ru from "./locales/ru.json";

// Armenian for first-time visitors, then the language the user chose
const saved = localStorage.getItem("rentify_lang") || "hy";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hy: { translation: hy }, ru: { translation: ru } },
  lng: saved,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  // A category typed by a user has no translation, so show it exactly as typed
  parseMissingKeyHandler: (key) => (key.startsWith("categories.") ? key.slice("categories.".length) : key),
});

export default i18n;
