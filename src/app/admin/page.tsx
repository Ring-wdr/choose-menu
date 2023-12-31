import Client from "./_component/Client";
import { getOrderListGroupByUserName } from "@/database/coffeebean/get";
import OrderBlockForm from "./_component/OrderBlockForm";
import OrderList from "./_component/OrderList";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Admin() {
  const orderList = await getOrderListGroupByUserName();
  return (
    <div>
      {process.env.NODE_ENV === "development" ? <Client /> : null}
      <OrderBlockForm />
      <OrderList orderList={orderList} />
    </div>
  );
}
