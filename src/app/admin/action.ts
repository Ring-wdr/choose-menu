"use server";

import { getMenu } from "@/crawling";
import client from "@/database";

const dbname = "coffeebean";
const collectionName = "menu";

export const crawlDataFromExternal = async (_: string[], data: FormData) => {
  const { masterKey } = Object.fromEntries(data);
  if (masterKey !== "admin123") return ["크롤링 권한이 없습니다."];
  try {
    await client.connect();
    const db = client.db(dbname);
    const menuCollection = db.collection(collectionName);
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
