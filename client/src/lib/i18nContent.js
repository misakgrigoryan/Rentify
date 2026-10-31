// Returns the title or description in the chosen language.
// Falls back to the original text when no translation was saved.
export function localized(listing, field, lang) {
  if (lang === "hy" && listing[`${field}Hy`]) return listing[`${field}Hy`];
  if (lang === "ru" && listing[`${field}Ru`]) return listing[`${field}Ru`];
  return listing[field];
}
