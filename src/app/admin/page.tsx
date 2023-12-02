import Client from "./Client";
import { getOrderedList } from "./action";

export default async function Admin() {
  const orderList = await getOrderedList();
  return (
    <div>
      <Client />
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
