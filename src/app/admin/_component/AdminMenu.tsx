"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MenuPropsWithId } from "@/type";
import { useReducer } from "react";
import { initValue, reducer } from "./reducer";
import { modifyAction, deleteAction } from "./action";
import AdminDialog from "./AdminModify";

type MenuAdminProps = {
  menuList?: MenuPropsWithId[];
};

export default function MenuAdmin({ menuList }: MenuAdminProps) {
  const [dialogState, dispatch] = useReducer(reducer, initValue);
  const [selected, setSelected] = useReducer(
    (_: string, name: string) => name,
    (menuList && menuList[0]?._id) || "메뉴"
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
      <Table>
        <TableCaption>현재 메뉴 목록입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead className="w-12">Only</TableHead>
            <TableHead className="w-12">품절</TableHead>
            <TableHead className="w-24">디카페인</TableHead>
            <TableHead className="w-24">카테고리</TableHead>
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
                  "data-state": "selected",
                })}
                onClick={() => setSelected(item._id)}
              >
                <TableCell className="font-medium">{item.name.kor}</TableCell>
                <TableCell>{item.only?.toUpperCase()}</TableCell>
                <TableCell>{item.soldOut && "품절"}</TableCell>
                <TableCell>{item.decaf && "디카페인"}</TableCell>
                <TableCell>{item.category}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
