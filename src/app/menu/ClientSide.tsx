"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { MenuContentsProps, MenuProps } from "@/crawling";
import { changeUserName, postSelectedMenu } from "./action";
import Button from "@/component/Button";
import Modal from "@/component/Modal";
import styles from "./page.module.css";

// name part
type NameSideProps = {
  userName: string;
};

type ModalCxtType<T> = T & {
  onClose?: () => void;
};

const NameModalContext = createContext<ModalCxtType<NameSideProps>>({
  userName: "",
});
const useNameModalContext = () => useContext(NameModalContext);

export function ClientNameSide({ userName }: NameSideProps) {
  // modal state
  const [nameChangeOpen, setNameChangeModal] = useState(false);
  const modalOpen = () => setNameChangeModal(true);
  const modalClose = () => setNameChangeModal(false);
  return (
    <div className={styles.name_section}>
      <p>{userName}님, 메뉴를 고르세요</p>
      <Button onClick={modalOpen}>이름 변경</Button>
      {nameChangeOpen ? (
        <Modal onClose={modalClose}>
          <NameModalContext.Provider value={{ userName, onClose: modalClose }}>
            <ModalContent />
          </NameModalContext.Provider>
        </Modal>
      ) : null}
    </div>
  );
}

function ModalContent() {
  const { userName, onClose } = useNameModalContext();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.setCustomValidity("같은 이름은 입력할 수 없습니다.");
  }, [inputRef]);
  return (
    <div className={styles.modal_container}>
      <Button resetStyle className={styles.close} onClick={onClose}>
        X
      </Button>
      <p>이름을 변경하세요.</p>
      <form action={changeUserName}>
        <input
          ref={inputRef}
          type="text"
          name="userName"
          placeholder={userName}
          required
          pattern={`^(?:(?!${userName}).)`}
          maxLength={4}
        />
        <NameChageForm />
      </form>
    </div>
  );
}

function NameChageForm() {
  const { onClose } = useNameModalContext();
  const { pending } = useFormStatus();
  if (pending) {
    onClose && onClose();
  }
  return (
    <>
      <button type="submit" disabled={pending}>
        {pending ? "변경 중..." : "변경"}
      </button>
    </>
  );
}

// menu part

const ALL_MENU = "전체";
type MenuSideProps = {
  data: MenuContentsProps[];
} & React.PropsWithChildren;

type SelectedMenuModalProps = {
  isOpen: boolean;
  selectedMenu?: MenuProps;
};

const MenuModalContext = createContext<
  ModalCxtType<{
    selectedMenu?: MenuProps;
  }>
>({});
const useMenuModalContext = () => useContext(MenuModalContext);

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
  // selected Menu state
  const [menuModalState, setMenuModal] = useState<SelectedMenuModalProps>({
    isOpen: false,
  });

  const menuModalClose = () =>
    setMenuModal((prev) => ({
      isOpen: false,
      selectedMenu: prev.selectedMenu,
    }));

  const dispatchSelected = (menu?: MenuProps) => () => {
    if (!menu) return;
    setMenuModal({
      isOpen: true,
      selectedMenu: menu,
    });
  };

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
      <MenuTable
        menuList={currentCategoryMenu}
        dispatchSelected={dispatchSelected}
      />
      {menuModalState.isOpen ? (
        <Modal onClose={menuModalClose}>
          <MenuModalContext.Provider
            value={{
              selectedMenu: menuModalState.selectedMenu,
              onClose: menuModalClose,
            }}
          >
            <MenuModalContent />
          </MenuModalContext.Provider>
        </Modal>
      ) : null}
    </div>
  );
}

type TableProps = {
  menuList: MenuProps[];
  dispatchSelected?: (menu?: MenuProps) => () => void;
};

/**
 * 메뉴를 보여주는 테이블
 */
function MenuTable({ menuList, dispatchSelected }: TableProps) {
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
      <Button
        fullWidth
        onClick={dispatchSelected && dispatchSelected(selectedMenu)}
      >
        메뉴 선택
      </Button>
    </div>
  );
}

const coffeeSize = ["L", "M", "S"] as const;
/**
 * 메뉴페이지에서 선택된 메뉴를 전송하는 폼
 */
function MenuModalContent() {
  const { onClose, selectedMenu } = useMenuModalContext();
  const menuNameId = useId();
  const sizeId = useId();
  return (
    <div className={styles.modal_container}>
      <Button resetStyle className={styles.close} onClick={onClose}>
        X
      </Button>
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
  );
}
