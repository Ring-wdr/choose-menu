import {
  cachedGetCategoryList,
  cachedGetMenuList,
} from '@/database/coffeebean/get';

import BlockPage from '../_component/BlockPage';

import MenuContents from './_component/Menu';

import styles from './page.module.css';

export default async function Menu() {
  const categories = await cachedGetCategoryList();
  const menuList = await cachedGetMenuList();
  if (!menuList || menuList.length === 0) {
    return <div>현재 메뉴를 불러올 수 없습니다.</div>;
  }
  return (
    <div className={styles.client}>
      <MenuContents categories={categories} menuList={menuList} />
      <BlockPage />
    </div>
  );
}
