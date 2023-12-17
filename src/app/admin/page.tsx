import Client from "./_component/Client";
import { getOrderListGroupByUserName } from "@/database/coffeebean/get";
import OrderBlockForm from "./_component/OrderBlockForm";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Admin() {
  const orderList = await getOrderListGroupByUserName();
  return (
    <div>
      {process.env.NODE_ENV === "development" ? <Client /> : null}
      <OrderBlockForm />
      <p>직원들이 주문한 메뉴</p>
      <ul>
        {orderList.map((order, idx) => (
          <li key={idx}>
            {order.userName}: {order.menuName} {order.decaf ? "DECAF" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
