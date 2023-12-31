"use client";
import {
  useState,
  useEffect,
  useRef,
  Fragment,
  DragEvent,
  TouchEvent,
} from "react";
import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";
import Button from "@/component/Button";
import styles from "./index.module.css";

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
    fetch("/api/bill")
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
    if (!draggable) return;
    const { currentTarget } = e;
    const { top } = currentTarget.getBoundingClientRect();
    currnentY.current = top;
  };

  const onTouchMove = (e: TouchEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    if (!draggable) return;
    const { touches } = e;
    const { clientY } = touches[0];
    const y = clientY - currnentY.current;
    e.currentTarget.style.setProperty("transform", `translateY(${y}px)`);
  };

  const onTouchEnd = (e: TouchEvent<HTMLTableRowElement>) => {
    if (!draggable) return;
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
    <div className={styles.container}>
      {reset && (
        <Button variant="large" onClick={updateOrder} className={styles.reset}>
          계산서 재요청
        </Button>
      )}
      현재 인원: {orders.length || 0}명
      <div className={styles.sticky_wrap}>
        <div className={styles.sticky_box}>
          <div className={styles.height_fix}>
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
                      draggable={draggable}
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
          </div>
        </div>
      </div>
    </div>
  );
}
