import Client from "./Client";
import { getOrderedList } from "@/database/coffeebean/get";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Admin() {
  const orderList = await getOrderedList();
  return (
    <div>
      {process.env.NODE_ENV === "development" ? <Client /> : null}
      <p>직원들이 주문한 메뉴</p>
      <ul>
        {orderList.map((order, idx) => (
          <li key={idx}>
            {order.userName}: {order.menuName}
          </li>
        ))}
      </ul>
    </div>
  );
}
