// Extra text for new sections, in all three languages
const TEXT = {
  en: { items: "Items available", cities: "Cities", secure: "Secure bookings", popular: "Popular right now", popularSub: "Swipe or use the arrows to see more", seeAll: "See all" },
  hy: { items: "Հասանելի ապրանքներ", cities: "Քաղաքներ", secure: "Անվտանգ ամրագրումներ", popular: "Այսօր ամենաթեժը", popularSub: "Օգտագործեք սլաքները՝ ավելին տեսնելու համար", seeAll: "Տեսնել բոլորը" },
  ru: { items: "Доступных вещей", cities: "Городов", secure: "Безопасные брони", popular: "Популярно сейчас", popularSub: "Листайте стрелками, чтобы увидеть больше", seeAll: "Смотреть все" },
};

export function extra(key, lang) {
  return (TEXT[lang] || TEXT.en)[key] || TEXT.en[key];
}
