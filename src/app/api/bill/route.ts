import { NextResponse } from "next/server";

import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const res = await getOrderListGroupByNameSizeTemp();
  return NextResponse.json(res);
}
