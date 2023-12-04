import clientPromise from "..";
import { getMenu } from "@/crawling";
import { COFFEEBEAN } from ".";
import { OrderItem } from "@/type";

export async function crawlAndSaveMenu() {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection(COFFEEBEAN.COLLECTION.MENU);
  menuCollection.deleteMany({});
  const menuList = await getMenu(
    "https://www.coffeebeankorea.com/menu/list.asp"
  );
  return menuCollection.insertMany(menuList);
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
