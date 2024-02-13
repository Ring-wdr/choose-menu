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
import { getOrderListGroupByUserNameAdmin } from '@/database/coffeebean/get';
import { toggleUserState } from '@/database/coffeebean/patch';
import useServerAction from '@/hooks/useServerAction';
import { Absence, AwaitedReturn } from '@/type';

import { getAbsenceListAction } from './action';

type OrderListProps = {
  orderList: AwaitedReturn<typeof getOrderListGroupByUserNameAdmin>;
  calculation: (data: any) => any;
  toggleUserState: typeof toggleUserState;
};

export default function OrderList({
  orderList,
  calculation,
  toggleUserState,
}: OrderListProps) {
  const { state, loading, refetch } = useServerAction(getAbsenceListAction);
  const [absenceList, setAbsence] = useState<Absence[] | null>(null);
  const onToggleState =
    (userName: string, key: 'absence' | 'sub') => async () => {
      try {
        const response = await toggleUserState(userName, key);
        setAbsence((prevList) => {
          if (!prevList) return [{ userName, [key]: true }];
          const changeUser = prevList.find((item) => item.userName == userName);
          if (response && changeUser) {
            changeUser[key] = !response[key];
            return prevList.slice();
          } else {
            return [...prevList, { userName, [key]: true }];
          }
        });
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
              const isSub = !!absenceList?.find(
                (item) => item.userName === order.userName && item.sub,
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
                  <TableCell>
                    {!isSub ? order.menuName : order.subMenuName}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={isAbsence}
                      onClick={onToggleState(order.userName, 'absence')}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={isSub}
                      onClick={onToggleState(order.userName, 'sub')}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
