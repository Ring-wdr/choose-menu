export const ingredientList = [
  { name: 'calories', className: 'bg1' },
  { name: 'saturatedFat', className: 'bg2' },
  { name: 'sodium', className: 'bg3' },
  { name: 'carbohydrate', className: 'bg4' },
  { name: 'sugars', className: 'bg5' },
  { name: 'caffeine', className: 'bg6' },
  { name: 'protain', className: 'bg7' },
] as const;

export const coffeeSize = ['S', 'M', 'L'] as const;
export const temperatures = ['HOT', 'ICE'] as const;

type IngredientKey = (typeof ingredientList)[number]['name'];

export const initialIngredient = ingredientList.reduce(
  (acc, ingredient) => ({ ...acc, [ingredient.name]: 0 }),
  {},
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
  soldOut?: boolean;
  decaf?: boolean;
  only?: 'ice' | 'hot';
  size?: Readonly<Array<(typeof coffeeSize)[number]>>;
};

export type MenuPropsWithId = MenuProps & { _id: string };

export type OrderItem = {
  userName: string;
  menuName: string;
  size: string;
  temperature: string;
  decaf?: 'on' | null;
  sub?: 'on' | null;
  shot?: number;
};

export type OrderWithSubMenu = OrderItem & {
  subMenuName?: string;
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
  absence?: boolean;
  sub?: boolean;
};

export type AwaitedReturn<T> = T extends (...args: any) => Promise<any>
  ? Awaited<ReturnType<T>>
  : never;
