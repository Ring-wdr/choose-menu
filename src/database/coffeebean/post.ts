import clientPromise from "..";
import { getCategories, getMenuFromPages } from "@/crawling";
import { COFFEEBEAN } from ".";
import { MenuProps, OrderItem } from "@/type";
import { getCategoryList } from "./get";

export async function crawlAndSaveCategory() {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const categoryCollection = db.collection(COFFEEBEAN.COLLECTION.CATEGORY);
  categoryCollection.deleteMany({});
  const categoryList = await getCategories(
    "https://www.coffeebeankorea.com/menu/list.asp"
  );
  const response = categoryCollection.insertMany(categoryList);
  return {
    categoryList,
    response,
  };
}

export async function crawlAndSaveMenu() {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);
  menuCollection.deleteMany({});
  const categoryList = await getCategoryList();
  const menuList: MenuProps[] = [];
  for await (const { category } of categoryList) {
    await new Promise((res) => setTimeout(res, 500));
    const menu = await getMenuFromPages(
      `https://www.coffeebeankorea.com/menu/list.asp?category=${category}`
    );
    menuList.push(...menu);
  }
  const response = menuCollection.insertMany(menuList);
  return {
    menuList,
    response,
  };
}

export async function postContentsOfSelectedMenu({
  userName,
  menuName,
  size,
}: OrderItem) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection(COFFEEBEAN.COLLECTION.ORDER);
  return orderCollection.updateOne(
    { userName },
    { $set: { menuName, size } },
    { upsert: true }
  );
}
