import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const res = await getOrderListGroupByNameSizeTemp();
  const aggList = res.map((lastOrder, idx) => ({
    id: idx,
    title: `(${lastOrder.size || "S"})${lastOrder.temperature || ""} ${
      lastOrder.menuName
    }`,
    decaf: lastOrder.decaf,
    count: lastOrder.count,
  }));
  return NextResponse.json(aggList);
}
