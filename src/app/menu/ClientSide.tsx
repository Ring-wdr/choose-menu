"use client";
import { useState } from "react";
import { MenuContentsProps } from "./action";

type Props = {
  data: MenuContentsProps[];
  userName?: string;
};

export default function ClientSide({ data, userName = "사용자" }: Props) {
  const [category, setCategory] = useState(data[0].title || "신음료");
  const currentCategoryMenu =
    data.find(({ title }) => title === category)?.list || [];
  const isEmpty = currentCategoryMenu.length === 0;
  return (
    <div>
      <ul>
        {data.map(({ title }, idx) => (
          <button key={idx} onClick={() => setCategory(title)}>
            {title}
          </button>
        ))}
      </ul>
      <ul>
        {isEmpty ? (
          <li>해당 메뉴가 없습니다.</li>
        ) : (
          currentCategoryMenu.map((item, idx) => (
            <li key={idx}>{item.name.kor}</li>
          ))
        )}
      </ul>
    </div>
  );
}
