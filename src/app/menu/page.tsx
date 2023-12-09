import { ClientMenuSide } from "./ClientSide";
import {
  cachedGetCategoryList,
  cachedGetMenuList,
} from "@/database/coffeebean/get";
import Category from "./Category";
import styles from "./page.module.css";

export default async function Menu() {
  const categoryList = await cachedGetCategoryList();
  const data = await cachedGetMenuList();
  if (!data || data.length === 0) {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.menu_container}>
      <Category key={"menu-category"} categoryList={categoryList} />
      <ClientMenuSide data={data} />
    </div>
  );
}
