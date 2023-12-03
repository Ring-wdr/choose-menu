import { MenuContentsProps, initialIngredient } from ".";

const MENULIST: MenuContentsProps[] = [
  {
    title: "커피",
    list: [
      { kor: "아메리카노", eng: "Americano" },
      { kor: "카페라떼", eng: "Cafe Latte" },
      { kor: "카페모카", eng: "Cafe Moca" },
      { kor: "콜드브루", eng: "Cold Brew" },
    ].map((name) => ({
      photo: "none",
      name,
      description: name.kor,
      info: initialIngredient,
    })),
  },
  {
    title: "티",
    list: [
      {
        kor: "레모네이드",
        eng: "Lemonade",
      },
      {
        kor: "아샷추",
        eng: "Icetea with shot",
      },
    ].map((name) => ({
      photo: "none",
      name,
      description: name.kor,
      info: initialIngredient,
    })),
  },
];

export const MOCK = {
  MENULIST,
} as const;
