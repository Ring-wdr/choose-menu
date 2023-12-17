"use client";
import {
  DragEvent,
  Fragment,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../page.module.css";
import { AggTableProps } from "../page";

type BillTableProps = {
  data: AggTableProps[];
};

const onDragOver = (e: DragEvent<HTMLTableRowElement>) => e.preventDefault();

export default function BillTable({ data }: BillTableProps) {
  const [orders, setOrders] = useState(data);
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
        (order) => order === currentIndexRef.current
      );
      const targetIndex = prev.findIndex(
        (order) => order === targetIndexRef.current
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

  // Todo: drag motion visible without any interruption
  const onTouchStart = (e: TouchEvent<HTMLTableRowElement>) => {
    const { currentTarget } = e;
    const { top } = currentTarget.getBoundingClientRect();
    currnentY.current = top;
  };

  const onTouchMove = (e: TouchEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    const { touches } = e;
    const { clientY } = touches[0];
    const y = clientY - currnentY.current;
    e.currentTarget.style.setProperty("transform", `translateY(${y}px)`);
  };

  const onTouchEnd = (e: TouchEvent<HTMLTableRowElement>) => {
    const { currentTarget, changedTouches } = e;
    const { clientX, clientY } = changedTouches[0];
    const { index } = currentTarget.dataset;
    const currentIdx = Number(index);
    const tbody = currentTarget.closest("tbody");
    if (tbody === null) return;
    const trows = [...tbody.querySelectorAll("tr")];
    const trowRects = trows.map((trow) => {
      const { left, right, bottom, top } = trow.getBoundingClientRect();
      const index = Number(trow.dataset.index);
      return {
        index,
        left,
        right,
        bottom,
        top,
      };
    });

    for (const { left, right, bottom, top, index: targetIdx } of trowRects) {
      if (isNaN(targetIdx)) continue;
      if (
        clientX < right &&
        clientX > left &&
        clientY < bottom &&
        clientY > top
      ) {
        setOrders((prev) => {
          const newPrev = [...prev];
          const currentIndex = prev.findIndex(
            (order) => order.id === currentIdx
          );
          const targetIndex = prev.findIndex((order) => order.id === targetIdx);
          [newPrev[currentIndex], newPrev[targetIndex]] = [
            newPrev[targetIndex],
            newPrev[currentIndex],
          ];
          return newPrev;
        });
        break;
      }
    }
    currentTarget.style.removeProperty("transform");
  };

  useEffect(() => {
    document.body.style.setProperty("overscroll-behavior", "none");
    return () => {
      document.body.style.removeProperty("overscroll-behavior");
    };
  }, []);

  return (
    <table className={styles.table} onMouseLeave={onMouseLeave}>
      <thead>
        <tr>
          <th>상품명</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <Fragment key={order.id}>
            <tr
              draggable
              data-index={order.id}
              onDragStart={onDragStart(order)}
              onDragEnter={onDragEnter(order)}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <td>{order.title}</td>
              <td>{order.count}</td>
            </tr>
            {order.decaf && (
              <tr>
                <td>ㄴ DECAF</td>
                <td></td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
