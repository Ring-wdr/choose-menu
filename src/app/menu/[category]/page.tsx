import {
  cachedGetCategoryList,
  getMenuListById,
} from "@/database/coffeebean/get";
import { ClientMenuSide } from "../ClientSide";
import Category from "../Category";
import styles from "../page.module.css";

export async function generateStaticParams() {
  const menuList = await cachedGetCategoryList();
  return menuList.map(({ category }) => category);
}

export default async function Page({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const categoryList = await cachedGetCategoryList();
  const data = await getMenuListById(category);
  return (
    <div className={styles.menu_container}>
      <Category
        key={"menu-category"}
        category={category}
        categoryList={categoryList}
      />
      <ClientMenuSide data={data} />
    </div>
  );
}
