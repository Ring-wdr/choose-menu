"use client";
import { useState } from "react";
import { MenuContentsProps, MenuProps } from "@/crawling";
import { postSelectedMenu } from "./action";
import Button from "@/component/Button";
import styles from "./page.module.css";

type Props = {
  data: MenuContentsProps[];
};

type TableProps = {
  menuList: MenuProps[];
};

const ALL_MENU = "전체";

export default function ClientSide({ data }: React.PropsWithChildren<Props>) {
  const [category, setCategory] = useState(data[0]?.title || "신음료");
  const currentCategoryMenu =
    category === ALL_MENU
      ? data.reduce<MenuProps[]>(
          (totalMenu, { list }) => [...totalMenu, ...list],
          []
        )
      : data.find(({ title }) => title === category)?.list || [];
  return (
    <div>
      <ul className={styles.category}>
        <button
          className={category === ALL_MENU ? styles.active : ""}
          onClick={() => setCategory(ALL_MENU)}
        >
          {ALL_MENU}
        </button>
        {data.length > 0 &&
          data.map(({ title }, idx) => (
            <button
              className={category === title ? styles.active : ""}
              key={idx}
              onClick={() => setCategory(title)}
            >
              {title}
            </button>
          ))}
      </ul>
      <MenuTable menuList={currentCategoryMenu} />
    </div>
  );
}

function MenuTable({ menuList }: TableProps) {
  const isEmpty = menuList.length === 0;
  const [selected, setSelected] = useState("");
  const selectedMenu = menuList.find((item) => item.name.kor === selected);
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
              <button onClick={() => setSelected(item.name.kor)}></button>
            </li>
          ))
        )}
      </ul>
      <div className={styles.selected}>
        <form action={postSelectedMenu}>
          <input
            type="text"
            name="menuName"
            value={selectedMenu?.name.kor}
            hidden
            readOnly
          />
          [{selectedMenu?.name.kor}]<p>선택하시겠습니까?</p>
          <Button fullWidth>메뉴 선택</Button>
        </form>
      </div>
    </div>
  );
}
