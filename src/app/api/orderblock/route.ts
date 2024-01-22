import { NextResponse } from 'next/server';

import { getOrderBlock } from '@/database/coffeebean/get';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
  const res = await getOrderBlock();

  return NextResponse.json(res);
}
