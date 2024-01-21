import { revalidatePath } from "next/cache";
import clientPromise from "..";
import { COFFEEBEAN } from ".";
import { getCategories, getMenuFromPages } from "@/crawling";
import { MenuProps, MenuPropsWithId, OrderItem } from "@/type";
import { getCategoryList } from "./get";
import { ObjectId } from "mongodb";

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
  revalidatePath("/menu", "page");
  return {
    menuList,
    response,
  };
}

export async function postContentsOfSelectedMenu(props: OrderItem) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection(COFFEEBEAN.COLLECTION.ORDER);
  return orderCollection.insertOne(props);
}

export async function mutateMenudata({
  name,
  _id,
  ...props
}: Omit<MenuPropsWithId, "photo" | "description" | "info">) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);

  const response = await menuCollection.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: props },
    { upsert: true }
  );
  return response;
}

export async function deleteMenudata({ _id }: Pick<MenuPropsWithId, "_id">) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);
  const response = await menuCollection.deleteOne({ _id: new ObjectId(_id) });
  return response;
}
