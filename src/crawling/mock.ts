import { Category, initialIngredient, MenuProps, OrderItem } from "../type";

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
    { kor: "카푸치노", eng: "Cappuccino" },
    { kor: "카페라떼", eng: "Cafe Latte" },
    { kor: "카페모카", eng: "Cafe Moca" },
    { kor: "플랫화이트", eng: "Flat White" },
    { kor: "콜드브루", eng: "Cold Brew" },
    { kor: "카페수아", eng: "Cafe Sua" },
  ].map((name) => ({
    _id: name.kor,
    photo:
      "https://www.coffeebeankorea.com/data/menu/에스프레소-피넛-초콜릿-라떼_1.jpg",
    name,
    description: name.kor,
    info: initialIngredient,
    category: "13",
    ...(Math.random() < 0.5 &&
      ({ only: Math.random() < 0.5 ? "ice" : "hot" } as const)),
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
    _id: name.kor,
    photo: "https://www.coffeebeankorea.com/data/menu/뱅쇼.jpg",
    name,
    description: name.kor,
    info: initialIngredient,
    category: "18",
    ...(Math.random() < 0.5 &&
      ({ only: Math.random() < 0.5 ? "ice" : "hot" } as const)),
  })),
];

const ORDER = {
  userName: "김만중",
  menuName: "아메리카노",
  decaf: null,
  size: "S",
  temperature: "HOT",
} satisfies OrderItem;

const randUserName = ["윤선비", "김윤아", "이유리", "박연주", "클로이"];

const ORDER_LIST = Array.from(
  { length: Math.floor(Math.random() * 10) + 5 },
  (_, idx) => ({
    userName: randUserName[idx % 5] + (Math.floor(idx / 5) + 1),
    menuName: MENULIST[Math.floor(Math.random() * MENULIST.length)].name.kor,
    size: Math.random() > 0.5 ? "S" : "L",
    temperature: Math.random() > 0.5 ? "HOT" : "ICE",
    decaf: Math.random() > 0.5 ? "on" : null,
  })
) satisfies OrderItem[];

export const MOCK = {
  CATEGORY_LIST,
  MENULIST,
  ORDER_LIST,
  ORDER,
} as const;
