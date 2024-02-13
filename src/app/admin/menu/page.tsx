import { redirect } from 'next/navigation';

import Paginations from '@/components/Pagination';
import {
  cachedGetCategoryList,
  getPaginatedMenuList,
} from '@/database/coffeebean/get';

import MenuAdmin from '../_component/AdminMenu';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
const menuSearchKeys = ['slug', 'category', 'keyword'];

const MenuPaginations = Paginations<'category' | 'keyword'>;

type MenuSearchParam<T extends string | number | symbol = string> = Record<
  T,
  string | string[] | undefined
>;

type ValueType<T extends 'string' | 'number'> = T extends 'string'
  ? string | undefined
  : number | undefined;

const transformValueToType = <T extends 'string' | 'number'>(
  value: string | string[] | undefined,
  type: T,
): ValueType<T> => {
  switch (type) {
    case 'number':
      if (typeof value === 'string') {
        const valueToNumber = Number(value);
        if (!isNaN(valueToNumber)) return valueToNumber as ValueType<T>;
      }
      if (Array.isArray(value)) {
        const firstValueToNumber = Number(value[0]);
        if (!isNaN(firstValueToNumber))
          return firstValueToNumber as ValueType<T>;
      }
    case 'string':
      if (typeof value === 'string') return value as ValueType<T>;
      if (Array.isArray(value)) return value[0] as ValueType<T>;
    default:
      return undefined;
  }
};
export default async function MenuAdminPage({
  searchParams,
}: {
  searchParams: MenuSearchParam;
}) {
  const searchObject: Partial<{ slug: number } & Record<string, string>> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (!menuSearchKeys.includes(key)) continue;
    if (key === 'slug') {
      searchObject[key] = transformValueToType(value, 'number');
    } else {
      searchObject[key] = transformValueToType(value, 'string');
    }
  }
  const { slug, category, keyword } = searchObject;
  const { menuList, totalPage } = await getPaginatedMenuList(searchObject);
  if (searchObject.slug && searchObject.slug > totalPage) {
    const searchParams = new URLSearchParams({
      ...searchObject,
      slug: totalPage.toString(),
    });
    const parsedSearchParams = `?${searchParams.toString()}`;
    redirect(`/admin/menu${parsedSearchParams}`);
  }
  const categories = await cachedGetCategoryList();
  return (
    <div className="flex flex-col justify-center m-auto w-full max-w-3xl h-[calc(100%-var(--header-height))]">
      <MenuAdmin menuList={menuList} categories={categories} />
      <MenuPaginations
        href="/admin/menu"
        slug={slug ?? 1}
        totalPage={totalPage}
        category={category}
        keyword={keyword}
      />
    </div>
  );
}
