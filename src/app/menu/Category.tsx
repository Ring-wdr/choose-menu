"use client";

import Link from "next/link";
import { cachedGetCategoryList } from "@/database/coffeebean/get";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const ALL_MENU = "전체";

type CategoryProps = {
  category?: string;
  categoryList: Awaited<ReturnType<typeof cachedGetCategoryList>>;
};

export default function Category({ category, categoryList }: CategoryProps) {
  const searchParams = useSearchParams();
  const menuName = searchParams.get("menuName");
  const categoryRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!category || !categoryRef.current) return;
    const linkButtonList = categoryRef.current.querySelectorAll("a");
    const currentCategory = [...linkButtonList].find((item) =>
      item.href.includes(`/${category}`)
    );
    currentCategory && currentCategory.scrollIntoView(true);
  }, [category]);

  return (
    <ul className={styles.category} key={styles.category} ref={categoryRef}>
      <Link
        href={{
          pathname: `/menu`,
          query: { menuName },
        }}
      >
        <li>
          <button className={!category ? styles.active : ""}>{ALL_MENU}</button>
        </li>
      </Link>
      {Array.isArray(categoryList) &&
        categoryList.map((item) => (
          <Link
            key={item.category}
            href={{
              pathname: `/menu/${item.category}`,
              query: { menuName },
            }}
            scroll={false}
          >
            <li>
              <button
                className={item.category === category ? styles.active : ""}
              >
                {item.title}
              </button>
            </li>
          </Link>
        ))}
    </ul>
  );
}
