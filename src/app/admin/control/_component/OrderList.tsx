"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { getOrderListGroupByUserName } from "@/database/coffeebean/get";
import useServerAction from "@/hooks/useServerAction";
import { Absence, AwaitedReturn } from "@/type";

import { getAbsenceListAction } from "../action";

import styles from "./client.module.css";

type OrderListProps = {
  orderList: AwaitedReturn<typeof getOrderListGroupByUserName>;
};

export default function OrderList({ orderList }: OrderListProps) {
  const { state, loading, refetch } = useServerAction(getAbsenceListAction);
  const [absenceList, setAbsence] = useState<Absence[] | null>(null);
  const toggleAbsence = (userName: string) => async () => {
    try {
      const response = await fetch(`/api/absence/${userName}`, {
        method: "PATCH",
      });
      if (response.ok) {
        const result = (await response.json()) as Absence | null;
        setAbsence((prevList) => {
          if (prevList === null) return null;
          const newAbsence = [
            ...prevList?.filter((item) => item.userName !== userName),
            { userName, absence: !result?.absence },
          ];
          return newAbsence;
        });
      }
    } catch (e) {
      alert("toggle failed");
      refetch();
    }
  };

  useEffect(() => {
    if (state.status === "success") {
      setAbsence((prev) => {
        if (state.data) return state.data;
        return prev;
      });
    }
  }, [state, setAbsence]);

  return (
    <div>
      <p>직원들이 주문한 메뉴</p>
      {loading && <div>리스트를 불러오고 있습니다...</div>}
      <ul>
        {orderList.map((order, idx) => {
          const isAbsence = !!absenceList?.find(
            (item) => item.userName === order.userName && item.absence,
          );
          return (
            <li
              key={idx}
              className={clsx({
                [styles.absence]: isAbsence,
              })}
            >
              {order.userName}: {order.size || "S"} {order.temperature || ""}
              {order.menuName} {order.decaf ? "DECAF" : ""}
              <input
                type="checkbox"
                checked={isAbsence}
                onChange={toggleAbsence(order.userName)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
