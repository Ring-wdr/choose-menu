import { MongoServerClosedError } from "mongodb";
import client from "@/database";
import { ClientMenuSide, ClientNameSide } from "./ClientSide";
import { MenuContentsProps } from "@/crawling";
import { COFFEEBEAN } from "@/database/coffeebean";
import { MOCK } from "@/crawling/mock";
import { getUserName } from "../util/server";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

async function getSavedMenu() {
  // prevent call Database without purpose
  if (process.env.NODE_ENV === "development") return MOCK.MENULIST;
  const db = (await client).db(COFFEEBEAN.DB_NAME);
  const menuCollection = db.collection<MenuContentsProps>(
    COFFEEBEAN.COLLECTION.MENU
  );
  const menuList = await menuCollection.find().toArray();
  return menuList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
}

export default async function Menu() {
  try {
    const userName = getUserName();
    if (!userName) {
      throw new Error("redirect to main page");
    }
    const data = await getSavedMenu();
    if (!data || data.length === 0) {
      return <div>현재 메뉴를 불러올 수 없습니다.</div>;
    }
    return (
      <div className={styles.client}>
        <ClientNameSide userName={userName.value} />
        <ClientMenuSide data={data} />
      </div>
    );
  } catch (e) {
    if (e instanceof MongoServerClosedError)
      return <div>DB 내용을 불러올 수 없습니다.</div>;
    if (e instanceof Error) {
      console.log(e);
      redirect("/");
    }
    return <div>메뉴가 없습니다.</div>;
  }
}
