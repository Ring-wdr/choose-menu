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
import { MenuProps } from "@/type";
import { useReducer } from "react";
import { initValue, reducer } from "./reducer";
import AdminDialog from "./AdminModify";
import clsx from "clsx";

type MenuAdminProps = {
  menuList?: MenuProps[];
};

export default function MenuAdmin({ menuList }: MenuAdminProps) {
  const [dialogState, dispatch] = useReducer(reducer, initValue);
  const [selected, setSelected] = useReducer(
    (_: string, name: string) => name,
    (menuList && menuList[0]?.name.kor) || "메뉴"
  );
  const selectedItem = menuList?.find((menu) => menu.name.kor === selected);

  return (
    <div className="flex flex-col justify-center m-auto w-4/5 h-[calc(100%-var(--header-height))]">
      <div className="flex justify-end gap-2 py-px">
        <AdminDialog type="추가" open={dialogState.추가} dispatch={dispatch} />
        <AdminDialog
          type="수정"
          open={dialogState.수정}
          dispatch={dispatch}
          item={selectedItem}
        />
        <AdminDialog
          type="삭제"
          open={dialogState.삭제}
          dispatch={dispatch}
          item={selectedItem}
          description={`This action cannot be undone. This will permanently delete your account and remove your data from our servers.`}
          hasForm={false}
        />
      </div>
      <Table>
        <TableCaption>현재 메뉴 목록입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead className="w-[100px]">Only(HOT/ICE)</TableHead>
            <TableHead className="w-[100px]">품절</TableHead>
            <TableHead>카테고리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!menuList && <TableRow>No content</TableRow>}
          {menuList &&
            menuList.map((item) => (
              <TableRow
                key={item.name.kor}
                className={clsx(selected === item.name.kor && "bg-muted")}
                onClick={() => setSelected(item.name.kor)}
              >
                <TableCell className="font-medium">{item.name.kor}</TableCell>
                <TableCell>{item.only}</TableCell>
                <TableCell>{item.soldOut}</TableCell>
                <TableCell>{item.category}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
