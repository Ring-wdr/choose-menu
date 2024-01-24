'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderListGroupByUserName } from '@/database/coffeebean/get';
import { toggleUserAbsence } from '@/database/coffeebean/patch';
import useServerAction from '@/hooks/useServerAction';
import { Absence, AwaitedReturn } from '@/type';

import { getAbsenceListAction } from './action';

type OrderListProps = {
  orderList: AwaitedReturn<typeof getOrderListGroupByUserName>;
  calculation: (data: any) => any;
  toggleAbsence: typeof toggleUserAbsence;
};

export default function OrderList({
  orderList,
  calculation,
  toggleAbsence,
}: OrderListProps) {
  const { state, loading, refetch } = useServerAction(getAbsenceListAction);
  const [absenceList, setAbsence] = useState<Absence[] | null>(null);
  const onToggleAbsence = (userName: string) => async () => {
    try {
      const response = await toggleAbsence(userName);
      if (response) {
        setAbsence((prevList) => {
          if (prevList === null) return null;
          const newAbsence = [
            ...prevList?.filter((item) => item.userName !== userName),
            { userName, absence: !response.absence },
          ];
          return newAbsence;
        });
      }
    } catch (e) {
      alert('toggle failed');
      refetch();
    }
  };

  useEffect(() => {
    if (state.status === 'success') {
      setAbsence((prev) => {
        if (state.data) return state.data;
        return prev;
      });
    }
  }, [state]);

  return (
    <div className="w-full">
      {loading && <div>리스트를 불러오고 있습니다...</div>}
      <div className="flex justify-end p-3">
        {state.status === 'success' && (
          <Button
            onClick={async () => {
              await calculation(orderList);
            }}
          >
            정산
          </Button>
        )}
      </div>
      <Table>
        <TableCaption>직원들이 주문한 메뉴</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>유저 이름</TableHead>
            <TableHead>메뉴 이름</TableHead>
            <TableHead className="w-24">부재</TableHead>
            <TableHead className="w-24">부메뉴로</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!orderList || orderList.length === 0) && (
            <TableRow>No content</TableRow>
          )}
          {orderList &&
            orderList.map((order) => {
              const isAbsence = !!absenceList?.find(
                (item) => item.userName === order.userName && item.absence,
              );
              return (
                <TableRow
                  key={order.userName}
                  {...(isAbsence && {
                    'data-state': 'selected',
                  })}
                >
                  <TableCell className="font-medium">
                    {order.userName}
                  </TableCell>
                  <TableCell>{order.menuName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={isAbsence}
                      onClick={onToggleAbsence(order.userName)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch></Switch>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

function OrderListTable({
  orderList,
}: {
  orderList: AwaitedReturn<typeof getOrderListGroupByUserName>;
}) {
  return (
    <Table>
      <TableCaption>현재 메뉴 목록입니다.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>유저 이름</TableHead>
          <TableHead className="w-24">디카페인</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(!orderList || orderList.length === 0) && (
          <TableRow>No content</TableRow>
        )}
        {orderList &&
          orderList.map((item) => (
            <TableRow key={item.userName}>
              <TableCell className="font-medium">{item.userName}</TableCell>
              <TableCell>{item.decaf && '디카페인'}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
