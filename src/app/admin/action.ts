"use server";

import client from "@/database";
import { getMenu } from "@/crawling";
import { dbname, menu, order } from "@/database/coffeebean";
import { OrderItem } from "@/type";

export const crawlDataFromExternal = async (_: string[], data: FormData) => {
  const { masterKey } = Object.fromEntries(data);
  if (masterKey !== process.env.ADMIN_PASSWORD)
    return ["크롤링 권한이 없습니다."];

  const db = (await client).db(dbname);
  const menuCollection = db.collection(menu);
  menuCollection.deleteMany({});
  const menuList = await getMenu(
    "https://www.coffeebeankorea.com/menu/list.asp"
  );
  const res = await menuCollection.insertMany(menuList);
  return Object.entries(res.insertedIds).map(([_, value]) => value.toString());
};

export const getOrderedList = async () => {
  const db = (await client).db(dbname);
  const orderCollection = db.collection<OrderItem>(order);
  const orders = await orderCollection.find().toArray();
  return orders.map((order) => ({ ...order, _id: order._id.toString() }));
};
