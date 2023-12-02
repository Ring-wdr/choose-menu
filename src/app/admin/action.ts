"use server";

import client from "@/database";
import { getMenu } from "@/crawling";
import { OrderItem } from "@/type";
import { COFFEEBEAN } from "@/database/coffeebean";

export const crawlDataFromExternal = async (_: string[], data: FormData) => {
  const { masterKey } = Object.fromEntries(data);
  if (masterKey !== process.env.ADMIN_PASSWORD)
    return ["크롤링 권한이 없습니다."];

  const db = (await client).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);
  menuCollection.deleteMany({});
  const menuList = await getMenu(
    "https://www.coffeebeankorea.com/menu/list.asp"
  );
  const res = await menuCollection.insertMany(menuList);
  return Object.entries(res.insertedIds).map(([_, value]) => value.toString());
};

export const getOrderedList = async () => {
  const db = (await client).db(COFFEEBEAN.DB_NAME);
  const orderCollection = db.collection<OrderItem>(COFFEEBEAN.COLLECTION.ORDER);
  const orders = await orderCollection.find().toArray();
  return orders.map((order) => ({ ...order, _id: order._id.toString() }));
};
