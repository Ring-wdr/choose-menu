import { cookies } from 'next/headers';

import { getOrderListGroupByNameSizeTemp } from '@/database/coffeebean/get';

import Bill from '../../_component/bill';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getOrderListGroupByNameSizeTemp();
  const isAdmin = !!cookies().get('admin');
  return (
    <div className="h-[calc(100%-var(--header-height)-var(--name-section-height))] overflow-y-scroll">
      <Bill data={data} isAdmin={isAdmin} />
    </div>
  );
}
