'use client';

import { Fragment, useEffect, useState } from 'react';
import { Fireworks } from '@fireworks-js/react';
import { DialogClose } from '@radix-ui/react-dialog';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Absence, AwaitedReturn, OrderItem } from '@/type';

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
  const resultOrderList = orderList.reduce<
    Array<Absence & { showMenu?: OrderItem }>
  >((acc, order) => {
    const { absence, sub, leave } =
      absenceList?.find((item) => item.userName === order.userName) ?? {};
    if (leave) return acc;
    return [
      ...acc,
      {
        userName: order.userName,
        absence: absence,
        sub: sub,
        showMenu: !sub ? order.mainMenu : order.subMenu,
      },
    ];
  }, []);
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
            <TableHead className="w-12">퇴사</TableHead>
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
                  {...(order.absence && {
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
                      checked={order.absence}
                      onClick={onToggleState(order.userName, 'absence')}
                    />
                  </TableCell>
                  <TableCell rowSpan={2}>
                    <Switch
                      checked={order.sub}
                      onClick={onToggleState(order.userName, 'sub')}
                    />
                  </TableCell>
                  <TableCell rowSpan={2}>
                    <LeaveModal
                      userName={order.userName}
                      toggleUserState={toggleUserState}
                    />
                  </TableCell>
                </TableRow>
                <TableRow
                  {...(order.absence && {
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

type leaveModalState = '선택' | '완료';

type LeaveModalState = {
  userName: string;
  toggleUserState: typeof toggleUserState;
};

const fireworksState = {
  style: {
    height: '100%',
  },
} as const;

function LeaveModal({ userName, toggleUserState }: LeaveModalState) {
  const [leaveState, setLeaveState] = useState<leaveModalState>('선택');
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open === false && leaveState === '완료') {
          toggleUserState(userName, 'leave', true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>퇴사</Button>
      </DialogTrigger>
      <DialogContent
        renderOnOverlay={
          leaveState === '완료' ? (
            <Fireworks style={fireworksState.style} />
          ) : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>
            {commentOnLeaveState({ userName, leaveState }).title}
          </DialogTitle>
          <DialogDescription>
            {commentOnLeaveState({ userName, leaveState }).desc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start mt-6">
          {leaveState === '선택' && (
            <Button onClick={() => setLeaveState('완료')}>퇴사</Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function commentOnLeaveState({
  userName,
  leaveState,
}: {
  userName: string;
  leaveState: leaveModalState;
}) {
  switch (leaveState) {
    case '선택':
      return {
        title: `${userName}님 "퇴사" 하시겠습니까?`,
        desc: `이 버튼은 취소할 수 없습니다. 유저 관리 페이지에서 영구적으로 제거되어 해당 유저는 더 이상 메뉴를 선택할 수 없습니다.`,
      };
    case '완료':
      return {
        title: `퇴사 완료!`,
        desc: `${userName}님의 퇴사처리가 완료되었습니다.`,
      };
  }
}
