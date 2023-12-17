import BillTable from "./_component/BillTable";
import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";
import styles from "./page.module.css";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export type AggTableProps = {
  id: number;
  title: string;
  decaf: string;
  count: number;
};

export default async function Bill() {
  const orderList = await getOrderListGroupByNameSizeTemp();
  const aggList = orderList.map((lastOrder, idx) => ({
    id: idx,
    title: `(${lastOrder.size || "S"})${lastOrder.temperature || ""} ${
      lastOrder.menuName
    }`,
    decaf: lastOrder.decaf,
    count: lastOrder.count,
  }));

  return (
    <div className={styles.bill}>
      <p className={styles.title}>계산서</p>
      <BillTable data={aggList} />
    </div>
  );
}
