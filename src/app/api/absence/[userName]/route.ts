import { toggleUserAbsence } from "@/database/coffeebean/patch";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function PATCH(
  request: Request,
  { params }: { params: { userName: string } }
) {
  const res = await toggleUserAbsence(params.userName);
  return NextResponse.json(res);
}
