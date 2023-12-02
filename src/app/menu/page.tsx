import { cookies } from "next/headers";
import { MongoServerClosedError } from "mongodb";
import ClientSide from "./ClientSide";
import { MenuContentsProps } from "@/crawling";
import client from "@/database";
import { COFFEEBEAN } from "@/database/coffeebean";

async function getSavedMenu() {
  try {
    const db = (await client).db(COFFEEBEAN.DB_NAME);
    const menuCollection = db.collection<MenuContentsProps>(
      COFFEEBEAN.COLLECTION.MENU
    );
    const menuList = await menuCollection.find().toArray();
    return menuList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
  } catch (e) {
    console.log(e);
  }
}

export default async function Menu() {
  try {
    const userName = cookies().get("userName")?.value || "사용자";
    const data = await getSavedMenu();
    if (!data || data.length === 0) {
      return <div>현재 메뉴를 불러올 수 없습니다.</div>;
    }
    return (
      <div>
        <p>{userName}님, 메뉴를 고르세요</p>
        <ClientSide data={data} />
      </div>
    );
  } catch (e) {
    if (e instanceof MongoServerClosedError)
      return <div>현재 메뉴를 불러올 수 없습니다.</div>;
    return <div>메뉴가 없습니다.</div>;
  }
}
