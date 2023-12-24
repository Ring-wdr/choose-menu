import { getOrderListGroupByNameSizeTemp } from "@/database/coffeebean/get";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const res = await getOrderListGroupByNameSizeTemp();
  return NextResponse.json(res);
}
