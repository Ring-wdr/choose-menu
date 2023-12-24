import Bill from "@/app/_component/bill";
import Modal from "@/component/Modal/server";
import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getOrderListGroupByNameSizeTemp();
  return (
    <Modal>
      <Bill data={data} draggable={false} reset={false} />
    </Modal>
  );
}
