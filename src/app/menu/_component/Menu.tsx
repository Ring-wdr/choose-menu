"use client";
import {
  useState,
  useEffect,
  useRef,
  useDeferredValue,
  ChangeEventHandler,
  KeyboardEventHandler,
} from "react";
import Image from "next/image";
import Button from "@/component/Button";
import LoadingImage from "@/component/Loading";
import LoadingButton from "@/component/Loading/Button";
import CustomBottomSheet from "@/component/BottomSheet/Custom";
import { useMenuContext } from "./MenuContext";
import { startSafeViewTransition } from "@/hooks/startSafeViewTransition";
import { Category, MenuProps } from "@/type";
import { hangulIncludes } from "@toss/hangul";
import { MenuSubmitForm } from "./Form";
import { postSelectedMenu } from "../action";
import MenuCard from "./MenuCard";
import clsx from "clsx";
import styles from "../page.module.css";

// menu part
const ALL_MENU = "전체";
type MenuSideProps = {
  categories: Category[];
  menuList: MenuProps[];
} & React.PropsWithChildren;

export default function MenuContents({ categories, menuList }: MenuSideProps) {
  // search state
  const [keyword, setKeyword] = useState("");
  const changeKeyword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setKeyword(e.target.value);
  };
  const deferedKeyword = useDeferredValue(keyword);
  const MenuListFilteredByKeyword = keyword
    ? menuList.filter(
        (menu) =>
          hangulIncludes(menu.name.kor, deferedKeyword) ||
          menu.name.eng
            .replace(/ /g, "")
            .toLowerCase()
            .includes(deferedKeyword.replace(/ /g, "").toLowerCase())
      )
    : menuList;

  // category state
  const [category, setCategory] = useState(ALL_MENU);
  const currentCategoryMenu =
    category === ALL_MENU
      ? MenuListFilteredByKeyword
      : MenuListFilteredByKeyword.filter((item) => item.category === category);
  const changeCategory = (_category: string) => () =>
    startSafeViewTransition(() => setCategory(_category));

  return (
    <>
      <ul className={styles.category}>
        <SearchContainer keyword={keyword} changeKeyword={changeKeyword} />
        <li>
          <button
            className={category === ALL_MENU ? styles.active : ""}
            onClick={changeCategory(ALL_MENU)}
            title={ALL_MENU}
          >
            {ALL_MENU}
          </button>
        </li>
        {categories.length > 0 &&
          categories.map((item, idx) => (
            <li key={idx}>
              <button
                className={item.category === category ? styles.active : ""}
                onClick={changeCategory(item.category)}
                title={item.title}
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

type SearchContainerProps = {
  keyword: string;
  changeKeyword: ChangeEventHandler<HTMLInputElement>;
};

function SearchContainer({ keyword, changeKeyword }: SearchContainerProps) {
  const chkRef = useRef<HTMLInputElement>(null);
  const uncheck = () => {
    if (chkRef.current) {
      chkRef.current.checked = false;
    }
  };
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case "Escape":
      case "Enter":
        uncheck();
        break;
    }
  };
  useEffect(() => {
    const uncheckOnEffect = (e: MouseEvent) => {
      const clickedElement = e.target as HTMLElement;
      if (
        chkRef.current &&
        chkRef.current.checked &&
        typeof clickedElement.closest === "function" &&
        clickedElement.closest(`.${styles["search-container"]}`) !==
          chkRef.current.parentElement
      ) {
        chkRef.current.checked = false;
      }
    };
    document.addEventListener("pointerdown", uncheckOnEffect);
    return () => document.removeEventListener("pointerdown", uncheckOnEffect);
  }, []);

  return (
    <div className={styles["search-container"]}>
      <label htmlFor={styles["menu-search"]}>
        검색 <span>⌕</span>
      </label>
      <input id={styles["menu-search"]} ref={chkRef} type="checkbox" hidden />
      <input
        type="text"
        placeholder="메뉴 이름을 입력하세요."
        value={keyword}
        onChange={changeKeyword}
        onBlur={uncheck}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

type MenuControllerProps = {
  menuList: MenuProps[];
};

function MenuController({ menuList }: MenuControllerProps) {
  // selected Menu state
  const { menu: previousMenu, menuState, menuRefetch } = useMenuContext();
  const [isBSOpen, setModal] = useState(false);
  const [selectedMenu, setMenu] = useState<MenuProps | null>(null);
  const dispatchSelected = (menu: MenuProps) => () => {
    const isWidthWideEnough =
      window.innerWidth / window.innerHeight >= 6 / 5 &&
      window.innerHeight >= 768;
    startSafeViewTransition(() => setMenu(menu), isWidthWideEnough);
  };
  /** 서버에서 에러가 나서 선택된 메뉴를 못 불러오고 아직 메뉴를 선택하지 않은 상태 */
  const isShowErrorMessage = menuState.status === "error" && !selectedMenu;
  /** 사용자가 이전에 메뉴를 선택한적이 없고 아직 메뉴를 선택하지 않은 상태 */
  const previousNoSelected = menuState.status === "success" && !selectedMenu;

  useEffect(() => {
    if (previousMenu) {
      setMenu((prev) => {
        if (prev === null && previousMenu.menuName) {
          const findMenuByName = menuList.find(
            (item) => item.name.kor === previousMenu.menuName
          );
          if (findMenuByName) return findMenuByName;
        }
        return prev;
      });
      document
        .getElementById(previousMenu.menuName)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [previousMenu, menuList]);

  return (
    <>
      <div className={styles.menu}>
        <div
          className={clsx(styles.card, {
            [styles.fallback]: isShowErrorMessage || previousNoSelected,
          })}
        >
          {menuState.status === "pending" && <LoadingImage />}
          {menuState.status !== "pending" && (
            <MenuCard selectedMenu={selectedMenu} />
          )}
          {previousNoSelected && <p>기존에 선택하신 메뉴가 없습니다.</p>}
          {isShowErrorMessage && (
            <>
              <p>기존 주문 메뉴를 불러오지 못했습니다.</p>
              <form action={menuRefetch}>
                <LoadingButton label="새로고침" labelOnPending="새로고침 중" />
              </form>
            </>
          )}
        </div>
        <MenuTable
          menuList={menuList}
          selectedMenu={selectedMenu}
          dispatchSelected={dispatchSelected}
        />
      </div>
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
          <CustomBottomSheet
            onClose={() => setModal(false)}
            isOpen={isBSOpen}
            initPosition={100}
            closePosition="50%"
          >
            <MenuSubmitForm
              previousMenu={previousMenu}
              selectedMenu={selectedMenu}
              formAction={postSelectedMenu}
            />
          </CustomBottomSheet>
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
    <ul className={styles.list}>
      {isEmpty ? (
        <li>해당 메뉴가 없습니다.</li>
      ) : (
        menuList.map((item) => (
          <li
            key={item.name.kor}
            id={item.name.kor}
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
  );
}
