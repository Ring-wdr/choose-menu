'use client';

import { useReducer } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MenuPropsWithId } from '@/type';

import { deleteAction, modifyAction } from './action';
import AdminDialog from './AdminModify';
import { initValue, reducer } from './reducer';

type MenuAdminProps = {
  menuList?: MenuPropsWithId[];
};

export default function MenuAdmin({ menuList }: MenuAdminProps) {
  const [dialogState, dispatch] = useReducer(reducer, initValue);
  const [selected, setSelected] = useReducer(
    (_: string, name: string) => name,
    (menuList && menuList[0]?._id) || '메뉴',
  );
  const selectedItem = menuList?.find((menu) => menu._id === selected);

  return (
    <>
      <div className="flex justify-end gap-2 py-px">
        <AdminDialog
          type="수정"
          open={dialogState.수정}
          dispatch={dispatch}
          action={modifyAction}
          item={selectedItem}
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
        <TableCaption>현재 메뉴 목록입니다.</TableCaption>
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
                <TableCell className="text-center">{item.category}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
