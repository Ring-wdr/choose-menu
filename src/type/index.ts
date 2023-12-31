export const ingredientList = [
  { name: "calories", className: "bg1" },
  { name: "saturatedFat", className: "bg2" },
  { name: "sodium", className: "bg3" },
  { name: "carbohydrate", className: "bg4" },
  { name: "sugars", className: "bg5" },
  { name: "caffeine", className: "bg6" },
  { name: "protain", className: "bg7" },
] as const;

type IngredientKey = (typeof ingredientList)[number]["name"];

export const initialIngredient = ingredientList.reduce(
  (acc, ingredient) => ({ ...acc, [ingredient.name]: 0 }),
  {}
) as Readonly<Record<IngredientKey, number>>;

export type MenuContentsProps = {
  category: string;
  list: MenuProps[];
};

export type Category = {
  title: string;
  category: string;
};

export type MenuProps = {
  category: string;
  photo: string;
  name: {
    kor: string;
    eng: string;
  };
  description: string;
  info: typeof initialIngredient;
};

export type OrderItem = {
  userName: string;
  menuName: string;
  size: string;
  temperature: string;
  decaf?: "on" | null;
};

export type OrderBlock = {
  status: boolean;
};

export type ActionByState<T> = NonNullable<
  { [K in keyof T]: { type: K; payload: T[K] } }[keyof T]
>;

export type ReducerByState<T> = (state: T, action: ActionByState<T>) => T;

export type Absence = {
  userName: string;
  absence: boolean;
};

export type AwaitedReturn<T> = T extends (...args: any) => Promise<any>
  ? Awaited<ReturnType<T>>
  : never;
