import { getOrderListGroupByUserNameAdmin } from '@/database/coffeebean/get';
import { toggleUserState } from '@/database/coffeebean/patch';

import { calculation } from '../_component/action';
import OrderList from '../_component/OrderList';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Admin() {
  const orderList = await getOrderListGroupByUserNameAdmin();
  return (
    <OrderList
      orderList={orderList}
      calculation={calculation}
      toggleUserState={toggleUserState}
    />
  );
}
