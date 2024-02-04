'use client';
import {
  DragEvent,
  Fragment,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderListGroupByNameSizeTemp } from '@/database/coffeebean/get';
import { startSafeViewTransition } from '@/hooks/startSafeViewTransition';

import styles from './index.module.css';

type AggTableProps = Awaited<
  ReturnType<typeof getOrderListGroupByNameSizeTemp>
>[number];

type BillTableProps = {
  data: AggTableProps[];
  draggable?: boolean;
  reset?: boolean;
};

const onDragOver = (e: DragEvent<HTMLTableRowElement>) => e.preventDefault();

export default function BillTable({
  data,
  draggable = true,
  reset = true,
}: BillTableProps) {
  // order state
  const [orders, setOrders] = useState(data);
  const updateOrder = () => {
    fetch('/api/bill')
      .then((res) => res.json())
      .then((data) => setOrders(data));
  };

  const currentIndexRef = useRef<AggTableProps | null>(null);
  const targetIndexRef = useRef<AggTableProps | null>(null);
  const currnentY = useRef(0);

  const onDragStart = (order: AggTableProps) => () => {
    currentIndexRef.current = order;
  };
  const onDragEnter = (target: AggTableProps) => () => {
    targetIndexRef.current = target;
  };
  const onDragEnd = () => {
    setOrders((prev) => {
      if (!currentIndexRef.current || !targetIndexRef.current) return prev;
      const newPrev = [...prev];
      const currentIndex = prev.findIndex(
        (order) => order === currentIndexRef.current,
      );
      const targetIndex = prev.findIndex(
        (order) => order === targetIndexRef.current,
      );
      [newPrev[currentIndex], newPrev[targetIndex]] = [
        newPrev[targetIndex],
        newPrev[currentIndex],
      ];
      return newPrev;
    });
  };
  const onMouseLeave = () => {
    currentIndexRef.current = null;
    targetIndexRef.current = null;
  };

  useEffect(() => {
    document.body.style.setProperty('overscroll-behavior', 'none');
    return () => {
      document.body.style.removeProperty('overscroll-behavior');
    };
  }, []);

  return (
    <div className={styles.container}>
      {reset && <Button onClick={updateOrder}>계산서 재요청</Button>}
      현재 인원: {orders.reduce((acc, { count }) => acc + count, 0) || 0}명
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> 상품명</TableHead>
            <TableHead className="w-12">수량</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody onMouseLeave={onMouseLeave}>
          {(!orders || orders.length === 0) && <TableRow>No content</TableRow>}
          {orders.map((order) => (
            <Fragment key={order.title}>
              <TableRow
                draggable={draggable}
                data-index={order.id}
                onDragStart={onDragStart(order)}
                onDragEnter={onDragEnter(order)}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
              >
                <TableCell>{order.title}</TableCell>
                <TableCell>{order.count}</TableCell>
              </TableRow>
              {order.decaf && (
                <TableRow>
                  <TableCell>ㄴ DECAF</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
