import { cache } from "react";
import { Category, MenuProps, OrderBlock, OrderItem } from "@/type";
import clientPromise from "@/database";
import { COFFEEBEAN } from ".";
import { MOCK } from "@/crawling/mock";

export const getOrderedList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orders = await orderCollection.find().toArray();
  return orders.map((order) => ({ ...order, _id: order._id.toString() }));
};

export const getCategoryList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const categoryCollection = db.collection<Category>(
    COFFEEBEAN.COLLECTION.CATEGORY
  );
  return categoryCollection.find().toArray();
};

/** cached method */
export const cachedGetCategoryList = cache(async () => {
  if (process.env.NODE_ENV === "development") return MOCK.CATEGORY_LIST;
  const categoryList = await getCategoryList();
  return categoryList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
});

export const getMenuList = async (): Promise<MenuProps[]> => {
  if (process.env.NODE_ENV === "development") return MOCK.MENULIST;
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  return (await menuCollection.find().toArray()).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
};

export const cachedGetMenuList = cache(getMenuList);

export const getMenuListById = async (
  category: string
): Promise<MenuProps[]> => {
  if (process.env.NODE_ENV === "development") {
    const menuById = MOCK.MENULIST.filter((menu) => menu.category === category);
    return menuById;
  }

  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuProps>(COFFEEBEAN.COLLECTION.MENU);
  return (await menuCollection.find({ category }).toArray()).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
};

export const getOrderBlock = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderBlock = db.collection<OrderBlock>(
    COFFEEBEAN.COLLECTION.ORDER_BLOCK
  );
  return orderBlock.findOne();
};
