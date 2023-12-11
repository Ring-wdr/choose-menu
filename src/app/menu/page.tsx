import { ClientMenuSide, ClientNameSide } from "./ClientSide";
import { cachedGetMenuList } from "@/database/coffeebean/get";
import styles from "./page.module.css";

export default async function Menu() {
  const data = await cachedGetMenuList();
  if (!data || data.length === 0) {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }
  return (
    <div className={styles.client}>
      <ClientNameSide />
      <ClientMenuSide data={data} />
    </div>
  );
}
