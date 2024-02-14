'use client';

import { useReducer, useRef } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category, MenuPropsWithId } from '@/type';

import { deleteAction, modifyAction } from './action';
import AdminDialog from './AdminModify';
import { initValue, reducer } from './reducer';

type MenuAdminProps = {
  menuList?: MenuPropsWithId[];
  categories?: Category[];
};

export default function MenuAdmin({
  menuList,
  categories = [],
}: MenuAdminProps) {
  const router = useRouter();
  const keywordRef = useRef<React.ComponentRef<'input'>>(null);
  const [dialogState, dispatch] = useReducer(reducer, initValue);
  const [selected, setSelected] = useReducer(
    (_: string, name: string) => name,
    (menuList && menuList[0]?._id) || '메뉴',
  );
  const selectedItem = menuList?.find((menu) => menu._id === selected);
  const searchByKeyword = (condition: boolean, keyword: string) =>
    condition && router.push(`/admin/menu?keyword=${keyword}`);

  return (
    <>
      <div className="flex justify-end gap-2 py-px m-2">
        <CategoryToggle categories={categories} />
        <AdminDialog
          type="수정"
          open={dialogState.수정}
          dispatch={dispatch}
          action={modifyAction}
          item={selectedItem}
          categories={categories}
        />
        <AdminDialog
          type="삭제"
          open={dialogState.삭제}
          dispatch={dispatch}
          item={selectedItem}
          description={`This action cannot be undone. This will permanently delete your account and remove your data from our servers.`}
          action={deleteAction}
          hasForm={false}
        />
      </div>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead className="w-12">Only</TableHead>
            <TableHead className="w-12 text-center">품절</TableHead>
            <TableHead className="w-20 text-center">디카페인</TableHead>
            <TableHead className="w-20 text-center">카테고리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!menuList || menuList.length === 0) && (
            <TableRow>No content</TableRow>
          )}
          {menuList &&
            menuList.map((item) => (
              <TableRow
                key={item.name.kor}
                {...(selected === item._id && {
                  'data-state': 'selected',
                })}
                onClick={() => setSelected(item._id)}
              >
                <TableCell className="font-medium w-1/2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name.kor}
                </TableCell>
                <TableCell>{item.only?.toUpperCase()}</TableCell>
                <TableCell>
                  {item.soldOut && <CheckIcon className="mx-auto" />}
                </TableCell>
                <TableCell>
                  {item.decaf && <CheckIcon className="mx-auto" />}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {categories.find(({ category }) => category == item.category)
                    ?.title ?? ''}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex gap-2 mx-auto my-3">
        <Input
          ref={keywordRef}
          className="w-2/3 max-w-48"
          onKeyUp={(e) => {
            searchByKeyword(e.key === 'Enter', e.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {
            searchByKeyword(
              keywordRef.current !== null,
              keywordRef.current?.value || '',
            );
          }}
        >
          검색
        </Button>
      </div>
    </>
  );
}

function CategoryToggle({ categories }: { categories: Category[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-28 right-2">
          카테고리 선택
          <span className="sr-only">Toggle Category</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/menu`}>전체</Link>
        </DropdownMenuItem>
        {categories.map(({ category, title }) => (
          <DropdownMenuItem asChild key={category}>
            <Link href={`/admin/menu?category=${category}`}>{title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
