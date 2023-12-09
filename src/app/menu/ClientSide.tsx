"use client";
import React, { useState, useId, useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MenuProps } from "@/type";
import { postSelectedMenu } from "./action";
import Button from "@/component/Button";
import BS from "@/component/BottomSheet";
import clsx from "clsx";
import styles from "./page.module.css";
import BSStyles from "./menu_bottomsheet.module.css";

type MenuControllerProps = {
  data: MenuProps[];
};

const coffeeSize = ["L", "M", "S"] as const;
const hotOrIce = ["hot", "ice"] as const;

export function ClientMenuSide({ data }: MenuControllerProps) {
  // selected Menu state
  const [isBSOpen, setModal] = useState(false);
  const searchParams = useSearchParams();
  const menuName = searchParams.get("menuName") as string;
  const isMenuNameInData = data.find((item) => item.name.eng === menuName);
  const menuNameId = useId();
  const sizeId = useId();
  const temperatureId = useId();

  return (
    <>
      <MenuTable menuList={data} />
      <div className={styles.footer}>
        <Button fullWidth onClick={() => isMenuNameInData && setModal(true)}>
          메뉴 선택
        </Button>
        {isMenuNameInData && isBSOpen ? (
          <BS
            onClose={() => setModal(false)}
            isOpen={isBSOpen}
            initPosition={100}
            closePosition="60%"
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
                      value={isMenuNameInData.name.kor}
                      hidden
                      readOnly
                    />
                    <div className={styles["menu-column"]}>
                      <label htmlFor={menuNameId}>메뉴이름</label>
                      <span>[{isMenuNameInData.name.kor}]</span>
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
                    <div className={styles["menu-column"]}>
                      <label htmlFor={temperatureId}>온도</label>
                      <select id={temperatureId} name="temperature">
                        {hotOrIce.map((temperature) => (
                          <option key={temperature} value={temperature}>
                            {temperature.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles["menu-column"]}>
                      <label>기타 요구사항</label>
                      <textarea
                        name="description"
                        placeholder={"기타 요구하실 내용을 적어주세요"}
                        rows={3}
                      />
                      <p>선택하시겠습니까?</p>
                    </div>
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
};

/**
 * 메뉴를 보여주는 테이블
 */
function MenuTable({ menuList }: TableProps) {
  const isEmpty = menuList.length === 0;
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  return (
    <div className={styles.menu}>
      <ul className={styles.list}>
        {isEmpty ? (
          <li>해당 메뉴가 없습니다.</li>
        ) : (
          menuList.map((item, idx) => (
            <Link
              href={{
                pathname,
                query: {
                  menuName: item.name.eng,
                },
              }}
              key={idx}
              replace
            >
              <li
                className={clsx({
                  [styles.active]:
                    searchParams.get("menuName") === item.name.eng,
                })}
              >
                {item.name.kor}
              </li>
            </Link>
          ))
        )}
      </ul>
    </div>
  );
}
