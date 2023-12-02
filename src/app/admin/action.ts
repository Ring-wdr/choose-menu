"use server";

import client from "@/database";
import { getMenu } from "@/crawling";
import { dbname, menu, order } from "@/database/coffeebean";
import { OrderItem } from "@/type";

export const crawlDataFromExternal = async (_: string[], data: FormData) => {
  const { masterKey } = Object.fromEntries(data);
  if (masterKey !== "admin123") return ["크롤링 권한이 없습니다."];
  try {
    await client.connect();
    const db = client.db(dbname);
    const menuCollection = db.collection(menu);
    menuCollection.deleteMany({});
    const data = await getMenu("https://www.coffeebeankorea.com/menu/list.asp");
    const res = await menuCollection.insertMany(data);
    return Object.entries(res.insertedIds).map(([_, value]) =>
      value.toString()
    );
  } finally {
    client.close();
  }
};

export const getOrderedList = async () => {
  try {
    await client.connect();
    const db = client.db(dbname);
    const orderCollection = db.collection<OrderItem>(order);
    const orders = await orderCollection.find().toArray();
    return orders.map((order) => ({ ...order, _id: order._id.toString() }));
  } finally {
    client.close();
  }
};
