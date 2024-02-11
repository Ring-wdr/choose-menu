'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

import { getCategories, getMenuFromPages } from '@/crawling';
import { MenuProps, MenuPropsWithId, OrderItem } from '@/type';

import clientPromise from '..';

import { COFFEEBEAN } from '.';

export async function crawlAndSaveCategory() {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const categoryCollection = db.collection(COFFEEBEAN.COLLECTION.CATEGORY);
  categoryCollection.deleteMany({});
  const categoryList = await getCategories(
    'https://www.coffeebeankorea.com/menu/list.asp',
  );
  const response = categoryCollection.insertMany(categoryList);
  return {
    categoryList,
    response,
  };
}

/** this function will be back on cron job */
// export async function crawlAndSaveMenu() {
//   const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
//   const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);
//   menuCollection.deleteMany({});
//   const categoryList = await getCategoryList();
//   const menuList: MenuProps[] = [];
//   for await (const { category } of categoryList) {
//     await new Promise((res) => setTimeout(res, 500));
//     const menu = await getMenuFromPages(
//       `https://www.coffeebeankorea.com/menu/list.asp?category=${category}`,
//     );
//     menuList.push(...menu);
//   }
//   const response = menuCollection.insertMany(menuList);
//   revalidatePath('/menu', 'page');
//   return {
//     menuList,
//     response,
//   };
// }

export async function crawlAndSaveMenuByCategory(category: string) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  const [dbMenuList, crawledMenuList] = await Promise.all([
    menuCollection.find({ category }).toArray(),
    getMenuFromPages(
      `https://www.coffeebeankorea.com/menu/list.asp?category=${category}`,
    ),
  ]);
  /** 신메뉴 */
  const newMenuList = crawledMenuList.filter(
    ({ name }) => !dbMenuList.find((menu) => menu.name.kor === name.kor),
  );
  /** 품절/삭제된 메뉴 */
  const removedMenuList = dbMenuList.filter(
    ({ name }) => !crawledMenuList.find((menu) => menu.name.kor === name.kor),
  );
  /** 신메뉴 insert에 대한 응답 */
  const insertResponse =
    newMenuList.length > 0 ? menuCollection.insertMany(newMenuList) : null;
  /** 품절/삭제된 메뉴에 대한 응답 */
  const deleteResponse =
    removedMenuList.length > 0
      ? menuCollection.updateMany(
          {
            category,
            'name.kor': { $in: removedMenuList.map((menu) => menu.name.kor) },
          },
          { $set: { soldOut: true } },
        )
      : null;
  revalidatePath('/menu', 'page');
  return { insertResponse, deleteResponse };
}

export async function postContentsOfSelectedMenu(props: OrderItem) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection(COFFEEBEAN.COLLECTION.ORDER);
  return orderCollection.insertOne(props);
}

export async function mutateMenudata({
  _id,
  ...props
}: Omit<MenuPropsWithId, 'photo' | 'description' | 'info'>) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);

  const response = await menuCollection.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: props },
    { upsert: true },
  );
  return response;
}

export async function deleteMenudata({ _id }: Pick<MenuPropsWithId, '_id'>) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);
  const response = await menuCollection.deleteOne({ _id: new ObjectId(_id) });
  return response;
}
