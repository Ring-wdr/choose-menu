"use client";
import React, { useState, useId } from "react";
import { MenuContentsProps, MenuProps } from "@/type";
import { changeUserName, postSelectedMenu } from "./action";
import Button from "@/component/Button";
import BS from "@/component/BottomSheet";
import styles from "./page.module.css";
import BSStyles from "./menu_bottomsheet.module.css";
import clsx from "clsx";

// name part
type NameSideProps = {
  userName: string;
};

export function ClientNameSide({ userName }: NameSideProps) {
  // modal state
  const [isBSOpen, setBSOpen] = useState(false);
  const bsOpen = () => setBSOpen(true);
  const bsClose = () => setBSOpen(false);
  return (
    <div className={styles.name_section}>
      <p>{userName}님, 메뉴를 고르세요</p>
      <Button onClick={bsOpen}>이름 변경</Button>
      {isBSOpen ? (
        <BS isOpen={isBSOpen} onClose={bsClose}>
          <BS.BottomSheet>
            <div className={clsx(BSStyles.bottomSheet)}>
              <BS.Handle className={clsx(BSStyles.handle)} />
              <div className={styles.modal_container}>
                <p>이름을 변경하세요.</p>
                <form action={changeUserName}>
                  <input
                    type="text"
                    name="userName"
                    placeholder={userName}
                    required
                    title="같은 이름은 입력할 수 없습니다."
                    pattern={`^(?:(?!${userName}).)*$`}
                    maxLength={4}
                  />
                  <BS.Submit fullWidth closeOnSubmit>
                    변경
                  </BS.Submit>
                </form>
              </div>
            </div>
          </BS.BottomSheet>
        </BS>
      ) : null}
    </div>
  );
}

// menu part
const ALL_MENU = "전체";
type MenuSideProps = {
  data: MenuContentsProps[];
} & React.PropsWithChildren;

export function ClientMenuSide({ data }: MenuSideProps) {
  // category state
  const [category, setCategory] = useState(data[0]?.title || "신음료");
  const currentCategoryMenu =
    category === ALL_MENU
      ? data.reduce<MenuProps[]>(
          (totalMenu, { list }) => [...totalMenu, ...list],
          []
        )
      : data.find(({ title }) => title === category)?.list || [];

  return (
    <div className={styles.menu_container}>
      <ul className={styles.category}>
        <li>
          <button
            className={category === ALL_MENU ? styles.active : ""}
            onClick={() => setCategory(ALL_MENU)}
          >
            {ALL_MENU}
          </button>
        </li>
        {data.length > 0 &&
          data.map(({ title }, idx) => (
            <li key={idx}>
              <button
                className={category === title ? styles.active : ""}
                onClick={() => setCategory(title)}
              >
                {title}
              </button>
            </li>
          ))}
      </ul>
      <MenuController menuList={currentCategoryMenu} />
    </div>
  );
}

type MenuControllerProps = {
  menuList: MenuProps[];
};

const coffeeSize = ["L", "M", "S"] as const;

function MenuController({ menuList }: MenuControllerProps) {
  // selected Menu state
  const [isBSOpen, setModal] = useState(false);
  const [selectedMenu, setMenu] = useState<MenuProps | null>(null);
  const dispatchSelected = (menu: MenuProps) => () => setMenu(menu);
  const menuNameId = useId();
  const sizeId = useId();

  return (
    <>
      <MenuTable
        menuList={menuList}
        selectedMenu={selectedMenu}
        dispatchSelected={dispatchSelected}
      />
      <div className={styles.footer}>
        <Button fullWidth onClick={() => selectedMenu && setModal(true)}>
          메뉴 선택
        </Button>
        {isBSOpen ? (
          <BS
            onClose={() => setModal(false)}
            isOpen={isBSOpen}
            initPosition={100}
            closePosition="60%"
            breakPosition={["20%", "30%", "40%"]}
            closeWhenBackdropClick={false}
          >
            <BS.BottomSheet>
              <div className={clsx(BSStyles.bottomSheet)}>
                <BS.Handle className={clsx(BSStyles.handle)} />
                <div className={styles.modal_container}>
                  <form action={postSelectedMenu}>
                    <input
                      id={menuNameId}
                      type="text"
                      name="menuName"
                      value={selectedMenu?.name.kor}
                      hidden
                      readOnly
                    />
                    <div className={styles["menu-column"]}>
                      <label htmlFor={menuNameId}>메뉴이름</label>
                      <span>[{selectedMenu?.name.kor}]</span>
                    </div>
                    <div className={styles["menu-column"]}>
                      <label htmlFor={sizeId}>사이즈</label>
                      <select id={sizeId} name="size">
                        {coffeeSize.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p>선택하시겠습니까?</p>
                    <Button fullWidth>확인</Button>
                  </form>
                </div>
              </div>
            </BS.BottomSheet>
          </BS>
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

/**
 * 메뉴를 보여주는 테이블
 */
function MenuTable({ menuList, selectedMenu, dispatchSelected }: TableProps) {
  const isEmpty = menuList.length === 0;
  return (
    <div className={styles.menu}>
      <ul className={styles.list}>
        {isEmpty ? (
          <li>해당 메뉴가 없습니다.</li>
        ) : (
          menuList.map((item, idx) => (
            <li
              key={idx}
              className={
                selectedMenu?.name.kor === item.name.kor ? styles.active : ""
              }
            >
              {item.name.kor}
              <button onClick={dispatchSelected(item)}></button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
