import {
  cachedGetCategoryList,
  cachedGetMenuList,
} from "@/database/coffeebean/get";
import MenuContents from "./_component/Menu";

export default async function Menu() {
  const categories = await cachedGetCategoryList();
  const menuList = await cachedGetMenuList();
  if (!menuList || menuList.length === 0) {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }
  return <MenuContents categories={categories} menuList={menuList} />;
}
