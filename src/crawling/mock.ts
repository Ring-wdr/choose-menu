import { Category, initialIngredient } from "../type";

const CATEGORY_LIST: Array<Category> = [
  {
    title: "커피",
    category: "13",
  },
  {
    title: "티",
    category: "18",
  },
];

const MENULIST = [
  ...[
    { kor: "아메리카노", eng: "Americano" },
    { kor: "카페라떼", eng: "Cafe Latte" },
    { kor: "카페모카", eng: "Cafe Moca" },
    { kor: "콜드브루", eng: "Cold Brew" },
  ].map((name) => ({
    photo:
      "https://www.coffeebeankorea.com/data/menu/에스프레소-피넛-초콜릿-라떼_1.jpg",
    name,
    description: name.kor,
    info: initialIngredient,
    category: "13",
  })),
  ...[
    {
      kor: "레모네이드",
      eng: "Lemonade",
    },
    {
      kor: "캐모마일",
      eng: "chamomile",
    },
    {
      kor: "히비스커스",
      eng: "Hibiscus",
    },
    {
      kor: "녹차",
      eng: "Green tea",
    },
    {
      kor: "아샷추",
      eng: "Icetea with shot",
    },
  ].map((name) => ({
    photo:
      "https://www.coffeebeankorea.com/data/menu/에스프레소-피넛-초콜릿-라떼_1.jpg",
    name,
    description: name.kor,
    info: initialIngredient,
    category: "18",
  })),
];

export const MOCK = {
  CATEGORY_LIST,
  MENULIST,
} as const;
