import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";

import Bill from "../../_component/bill";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getOrderListGroupByNameSizeTemp();
  return <Bill data={data} />;
}
