import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";
import Client from "./client";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getOrderListGroupByNameSizeTemp();
  return <Client data={data} />;
}
