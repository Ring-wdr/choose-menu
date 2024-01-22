import { getOrderListGroupByUserName } from '@/database/coffeebean/get';

import OrderList from '../_component/OrderList';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Admin() {
  const orderList = await getOrderListGroupByUserName();
  return <OrderList orderList={orderList} />;
}
