import { cache } from "react";
import { COFFEEBEAN } from ".";
import { MenuContentsProps, OrderItem } from "@/type";
import clientPromise from "..";
import { MOCK } from "@/crawling/mock";

export const getOrderedList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orders = await orderCollection.find().toArray();
  return orders.map((order) => ({ ...order, _id: order._id.toString() }));
};

export const getMenuList = async () => {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuContentsProps>(
    COFFEEBEAN.COLLECTION.MENU
  );
  return menuCollection.find().toArray();
};

/** cached method */
export const cachedGetMenuList = cache(async () => {
  if (process.env.NODE_ENV === "development") return MOCK.MENULIST;
  const menuList = await getMenuList();
  return menuList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
});
