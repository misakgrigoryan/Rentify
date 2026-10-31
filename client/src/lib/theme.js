// Remembers the chosen theme and adds or removes the "dark" class on <html>
const KEY = "rentify_theme";

export function getTheme() {
  return localStorage.getItem(KEY) || "light";
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

// Runs once when the app loads, so the saved theme is applied right away
applyTheme(getTheme());
