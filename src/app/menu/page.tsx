import { MenuContentsProps } from "@/crawling";
import ClientSide from "./ClientSide";
import client from "@/database";

const dbname = "coffeebean";
const collectionName = "menu";

async function getSavedMenu() {
  try {
    await client.connect();
    const db = client.db(dbname);
    const menuCollection = db.collection<MenuContentsProps>(collectionName);
    const menuList = await menuCollection.find().toArray();

    return menuList.map((menu) => ({ ...menu, _id: menu._id.toString() }));
  } finally {
    client.close();
  }
}

export default async function Menu({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    const userName = searchParams?.userName || "사용자";
    const data = await getSavedMenu();
    return (
      <div>
        <p>{userName}님, 메뉴를 고르세요</p>
        <ClientSide data={data} userName={userName as string} />
      </div>
    );
  } catch {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }
}
