'use client';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import { hangulIncludes } from '@toss/hangul';
import clsx from 'clsx';

import CustomBottomSheet from '@/components/BottomSheet/Custom';
import { Button } from '@/components/ui/button';
import { startSafeViewTransition } from '@/hooks/startSafeViewTransition';
import { Category, MenuProps } from '@/type';

import { postSelectedMenu } from '../action';

import BevImage from './BevImage';
import { MenuSubmitForm } from './Form';
import MenuCard from './MenuCard';

import styles from '../page.module.css';

// menu part
const ALL_MENU = '전체';
type MenuSideProps = {
  categories: Category[];
  menuList: MenuProps[];
} & React.PropsWithChildren;

export default function MenuContents({ categories, menuList }: MenuSideProps) {
  // search state
  const [keyword, setKeyword] = useState('');
  const changeKeyword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setKeyword(e.target.value);
  };
  const deferedKeyword = useDeferredValue(keyword);
  const MenuListFilteredByKeyword = keyword
    ? menuList.filter(
        (menu) =>
          hangulIncludes(menu.name.kor, deferedKeyword) ||
          menu.name.eng
            .replace(/ /g, '')
            .toLowerCase()
            .includes(deferedKeyword.replace(/ /g, '').toLowerCase()),
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
            className={category === ALL_MENU ? styles.active : ''}
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
                className={item.category === category ? styles.active : ''}
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
      case 'Escape':
      case 'Enter':
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
        typeof clickedElement.closest === 'function' &&
        clickedElement.closest(`.${styles['search-container']}`) !==
          chkRef.current.parentElement
      ) {
        chkRef.current.checked = false;
      }
    };
    document.addEventListener('pointerdown', uncheckOnEffect);
    return () => document.removeEventListener('pointerdown', uncheckOnEffect);
  }, []);

  return (
    <div
      className={clsx(
        styles['search-container'],
        'bg-gradient-to-r from-white from-50% dark:from-black to-transparent',
      )}
    >
      <input id={styles['menu-search']} ref={chkRef} type="checkbox" hidden />
      <label htmlFor={styles['menu-search']}>
        <input
          type="text"
          placeholder="메뉴 이름"
          value={keyword}
          onChange={changeKeyword}
          onBlur={uncheck}
          onKeyDown={onKeyDown}
        />
        <span>⌕</span>
      </label>
    </div>
  );
}

type MenuControllerProps = {
  menuList: MenuProps[];
};

function MenuController({ menuList }: MenuControllerProps) {
  const [isBSOpen, setModal] = useState(false);
  const [selectedMenu, setMenu] = useState<MenuProps | null>(null);
  const dispatchSelected = (menu: MenuProps) => () => {
    const isWidthWideEnough =
      window.innerWidth / window.innerHeight >= 6 / 5 &&
      window.innerHeight >= 640;
    startSafeViewTransition(() => setMenu(menu), isWidthWideEnough);
  };

  return (
    <>
      <div className={styles.menu}>
        <div className={clsx(styles.card)}>
          <MenuCard selectedMenu={selectedMenu} />
        </div>
        <MenuTable
          menuList={menuList}
          selectedMenu={selectedMenu}
          dispatchSelected={dispatchSelected}
        />
      </div>
      <div className={styles.footer}>
        <Button
          className="w-full max-w-72 mx-auto"
          onClick={() =>
            selectedMenu ? setModal(true) : alert('메뉴를 선택해주세요.')
          }
        >
          메뉴 선택
        </Button>
        {selectedMenu && (
          <CustomBottomSheet
            onClose={() => setModal(false)}
            isOpen={isBSOpen}
            initPosition={100}
            closePosition="50%"
          >
            <MenuSubmitForm
              selectedMenu={selectedMenu}
              formAction={postSelectedMenu}
            />
          </CustomBottomSheet>
        )}
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
    <ul className={styles.list}>
      {isEmpty ? (
        <li>해당 메뉴가 없습니다.</li>
      ) : (
        menuList.map((item) => (
          <li
            key={item.name.kor}
            id={item.name.kor}
            className={
              selectedMenu?.name.kor === item.name.kor ? styles.active : ''
            }
          >
            <button onClick={dispatchSelected(item)}>
              <div className={styles['img-container']}>
                <BevImage
                  src={item.photo}
                  alt={item.name.eng || 'coffee'}
                  fill
                />
              </div>
              <div className={styles['txt-container']}>
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
