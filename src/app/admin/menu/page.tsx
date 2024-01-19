import { cachedGetMenuList } from "@/database/coffeebean/get";
import MenuAdmin from "../_component/AdminMenu";

export default async function MenuAdminPage() {
  const menuList = await cachedGetMenuList();
  return <MenuAdmin menuList={menuList} />;
}
