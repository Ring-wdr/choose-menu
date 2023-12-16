"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/component/Button";
import { startSafeViewTransition } from "@/hooks/startSafeViewTransition";
import { Category, MenuProps } from "@/type";
import MenuCard from "./MenuCard";
import { MenuSubmitForm } from "./Form";
import { postSelectedMenu } from "../action";
import styles from "../page.module.css";
import MenuBottomSheet from "./MenuBottomSheet";

// menu part
const ALL_MENU = "전체";
type MenuSideProps = {
  categories: Category[];
  menuList: MenuProps[];
} & React.PropsWithChildren;

export default function MenuContents({ categories, menuList }: MenuSideProps) {
  // category state
  const [category, setCategory] = useState(ALL_MENU);
  const currentCategoryMenu =
    category === ALL_MENU
      ? menuList
      : menuList.filter((item) => item.category === category);

  return (
    <>
      <ul className={styles.category}>
        <li>
          <button
            className={category === ALL_MENU ? styles.active : ""}
            onClick={() => setCategory(ALL_MENU)}
          >
            {ALL_MENU}
          </button>
        </li>
        {categories.length > 0 &&
          categories.map((item, idx) => (
            <li key={idx}>
              <button
                className={item.category === category ? styles.active : ""}
                onClick={() => setCategory(item.category)}
              >
                {item.title}
              </button>
            </li>
          ))}
      </ul>
      <div className={styles.menu_container}>
        <MenuController menuList={currentCategoryMenu} />
      </div>
    </>
  );
}

type MenuControllerProps = {
  menuList: MenuProps[];
};

function MenuController({ menuList }: MenuControllerProps) {
  // selected Menu state
  const [isBSOpen, setModal] = useState(false);
  const [selectedMenu, setMenu] = useState<MenuProps | null>(null);
  const dispatchSelected = (menu: MenuProps) => () => {
    const isWidthWideEnough =
      window.innerWidth / window.innerHeight >= 8 / 5 ||
      window.innerHeight >= 768;
    startSafeViewTransition(() => setMenu(menu), isWidthWideEnough);
  };

  return (
    <>
      <MenuTable
        menuList={menuList}
        selectedMenu={selectedMenu}
        dispatchSelected={dispatchSelected}
      />
      <div className={styles.footer}>
        <Button
          fullWidth
          onClick={() =>
            selectedMenu ? setModal(true) : alert("메뉴를 선택해주세요.")
          }
        >
          메뉴 선택
        </Button>
        {selectedMenu && isBSOpen ? (
          <MenuBottomSheet
            onClose={() => setModal(false)}
            isOpen={isBSOpen}
            initPosition={100}
            closePosition="50%"
          >
            <MenuSubmitForm
              selectedMenu={selectedMenu}
              formAction={postSelectedMenu}
            />
          </MenuBottomSheet>
        ) : null}
      </div>
    </>
  );
}

type TableProps = {
  menuList: MenuProps[];
  selectedMenu?: MenuProps | null;
  dispatchSelected: (menu: MenuProps) => () => void;
};

const imgPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==";

/**
 * 메뉴를 보여주는 테이블
 */
function MenuTable({ menuList, selectedMenu, dispatchSelected }: TableProps) {
  const isEmpty = menuList.length === 0;
  return (
    <div className={styles.menu}>
      <MenuCard className={styles.card} selectedMenu={selectedMenu} />
      <ul className={styles.list}>
        {isEmpty ? (
          <li>해당 메뉴가 없습니다.</li>
        ) : (
          menuList.map((item) => (
            <li
              key={item.name.kor}
              className={
                selectedMenu?.name.kor === item.name.kor ? styles.active : ""
              }
            >
              <button onClick={dispatchSelected(item)}>
                <div className={styles["img-container"]}>
                  <Image
                    src={item.photo}
                    alt={item.name.eng || "coffee"}
                    fill
                    placeholder={imgPlaceholder}
                  />
                </div>
                <div className={styles["txt-container"]}>
                  <span>{item.name.kor}</span>
                  <span>{item.name.eng}</span>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
