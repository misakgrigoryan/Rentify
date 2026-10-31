import "dotenv/config";
import prisma from "../src/lib/prisma.js";

// Matched by the English title that the seed script saved
const translations = [
  {
    title: "Makita Cordless Drill",
    titleHy: "Makita մարտկոցավոր պտուտակահան",
    titleRu: "Аккумуляторная дрель Makita",
    descriptionHy: "18 Վ մարտկոցավոր պտուտակահան՝ մարտկոցով։ Հարմար է կահույքի հավաքման և տան վերանորոգման համար։",
    descriptionRu: "Аккумуляторная дрель 18 В с аккумулятором. Подходит для сборки мебели и ремонта дома.",
  },
  {
    title: "High-Pressure Washer",
    titleHy: "Բարձր ճնշման լվացքի սարք",
    titleRu: "Мойка высокого давления",
    descriptionHy: "Էլեկտրական լվացքի սարք՝ ջրի խողովակով և փրփուրի արտանետիչով։ Մեքենաների, պատիոների և ցանկապատերի համար։",
    descriptionRu: "Электрическая мойка с шлангом и насадкой для пены. Для машин, террас и заборов.",
  },
  {
    title: "FPV Racing Drone",
    titleHy: "FPV ռեյսինգ դրոն",
    titleRu: "FPV гоночный дрон",
    descriptionHy: "Արագ 5 դյույմանոց դրոն՝ տեսախցիկով։ Ներառում է պահեստային պտուտակներ։ Փորձ խորհուրդ է տրվում։",
    descriptionRu: "Быстрый 5-дюймовый дрон с камерой. В комплекте запасные пропеллеры. Рекомендуется опыт.",
  },
  {
    title: "Portable Projector",
    titleHy: "Շարժական պրոյեկտոր",
    titleRu: "Портативный проектор",
    descriptionHy: "Կոմպակտ տնային պրոյեկտոր՝ ներկառուցված բարձրախոսով։ Հարմար է կինոյի երեկոների և ներկայացումների համար։",
    descriptionRu: "Компактный домашний проектор со встроенной колонкой. Подходит для киновечеров и презентаций.",
  },
  {
    title: "Mountain Bike",
    titleHy: "Լեռնային հեծանիվ",
    titleRu: "Горный велосипед",
    descriptionHy: "Լրիվ ամորտիզացիայով լեռնային հեծանիվ, 29 դյույմանոց անիվներ։ Սաղավարտ՝ խնդրանքով։",
    descriptionRu: "Полноподвесный горный велосипед, колёса 29 дюймов. Шлем по запросу.",
  },
  {
    title: "2-Person Camping Tent",
    titleHy: "2 հոգու վրան",
    titleRu: "Двухместная палатка",
    descriptionHy: "Թեթև գմբեթավոր վրան՝ ցանցավոր դռնով։ Հեշտ է տեղադրել, հարմար է շաբաթավերջի ճանապարհորդությունների համար։",
    descriptionRu: "Лёгкая купольная палатка с сетчатой дверью. Легко ставится, подходит для поездок на выходные.",
  },
];

async function main() {
  let updated = 0;
  for (const t of translations) {
    const { title, ...data } = t;
    const result = await prisma.listing.updateMany({
      where: { title, owner: { email: "demo@rentify.local" } },
      data,
    });
    updated += result.count;
  }
  console.log(`Translations saved to ${updated} listing(s)`);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
