import { ClientMenuSide, ClientNameSide } from "./ClientSide";
import { redirect } from "next/navigation";
import { getUserName } from "@/util/server";
import { cachedGetMenuList } from "@/database/coffeebean/get";
import styles from "./page.module.css";

export default async function Menu() {
  const data = await cachedGetMenuList();
  if (!data || data.length === 0) {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }
  const userName = getUserName();
  if (!userName) {
    redirect("/");
  }
  return (
    <div className={styles.client}>
      <ClientNameSide userName={userName.value} />
      <ClientMenuSide data={data} />
    </div>
  );
}
