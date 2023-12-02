"use client";
import { useState } from "react";
import { MenuContentsProps, MenuProps } from "@/crawling";
import Button from "@/component/Button";
import styles from "./page.module.css";
import { postSelectedMenu } from "./action";

type Props = {
  data: MenuContentsProps[];
  userName?: string;
};

type TableProps = {
  menuList: MenuProps[];
  userName: string;
};

export default function ClientSide({ data, userName = "사용자" }: Props) {
  const [category, setCategory] = useState(data[0].title || "신음료");
  const currentCategoryMenu =
    data.find(({ title }) => title === category)?.list || [];
  return (
    <div>
      <ul className={styles.category}>
        {data.map(({ title }, idx) => (
          <button key={idx} onClick={() => setCategory(title)}>
            {title}
          </button>
        ))}
      </ul>
      <MenuTable menuList={currentCategoryMenu} userName={userName} />
    </div>
  );
}

function MenuTable({ menuList, userName }: TableProps) {
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
          <input type="text" name="userName" value={userName} hidden />
          <input
            type="text"
            name="menuName"
            value={selectedMenu?.name.kor}
            hidden
          />
          [{selectedMenu?.name.kor}]<p>선택하시겠습니까?</p>
          <Button>메뉴 선택</Button>
        </form>
      </div>
    </div>
  );
}
