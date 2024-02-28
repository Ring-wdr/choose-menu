'use client';

import { Fragment, useEffect, useState } from 'react';

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
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
  const { state, loading, refetch } = useServerAction(getAbsenceListAction);
  const [absenceList, setAbsence] = useState<Absence[] | null>(null);
  const resultOrderList = orderList.map((order) => {
    const isAbsence = !!absenceList?.find(
      (item) => item.userName === order.userName && item.absence,
    );
    const isSub = !!absenceList?.find(
      (item) => item.userName === order.userName && item.sub,
    );
    return {
      userName: order.userName,
      isAbsence,
      isSub,
      showMenu: !isSub ? order.mainMenu : order.subMenu,
    };
  });
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
              try {
                const aggregatedList = resultOrderList.map((order) => ({
                  userName: order.userName,
                  menuName: order.showMenu?.menuName,
                  size: order.showMenu?.size,
                  shot: order.showMenu?.shot,
                  temperature: order.showMenu?.temperature,
                  decaf: order.showMenu?.decaf,
                }));
                await calculation(aggregatedList);
                toast({
                  title: '정산 완료!!',
                  description: new Date().toDateString(),
                });
              } catch (e) {
                if (e instanceof Error) {
                  toast({
                    title: '정산 실패!!',
                    description: e.message,
                  });
                }
              }
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
            <TableHead className="w-20">유저 이름</TableHead>
            <TableHead>메뉴 이름</TableHead>
            <TableHead className="w-12">부재</TableHead>
            <TableHead className="w-20">부메뉴로</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!resultOrderList || resultOrderList.length === 0) && (
            <TableRow>No content</TableRow>
          )}
          {resultOrderList &&
            resultOrderList.map((order) => (
              <Fragment key={order.userName}>
                <TableRow
                  {...(order.isAbsence && {
                    'data-state': 'selected',
                  })}
                >
                  <TableCell className="font-medium" rowSpan={2}>
                    {order.userName}
                  </TableCell>
                  <TableCell>
                    {order.showMenu?.menuName ?? '(선택된 메뉴가 없습니다.)'}
                  </TableCell>
                  <TableCell rowSpan={2}>
                    <Switch
                      checked={order.isAbsence}
                      onClick={onToggleState(order.userName, 'absence')}
                    />
                  </TableCell>
                  <TableCell rowSpan={2}>
                    <Switch
                      checked={order.isSub}
                      onClick={onToggleState(order.userName, 'sub')}
                    />
                  </TableCell>
                </TableRow>
                <TableRow
                  {...(order.isAbsence && {
                    'data-state': 'selected',
                  })}
                >
                  <TableCell className="font-medium">
                    {[
                      order.showMenu?.decaf ? 'DECAF' : '',
                      order.showMenu?.temperature,
                      order.showMenu?.shot ? `${order.showMenu.shot} SHOT` : '',
                      order.showMenu?.size,
                    ]
                      .filter(Boolean)
                      .join(', ') || '(옵션 없음)'}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
