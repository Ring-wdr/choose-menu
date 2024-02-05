import { cookies } from 'next/headers';

import { getRecentMenuByUserName } from '@/database/coffeebean/get';

import Client from './client';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  const userCookie = cookies().get('userName');
  try {
    const data = await getRecentMenuByUserName(userCookie!.value);
    return <Client data={data} />;
  } catch (e) {
    if (e instanceof Error) return <Client data={e.message || 'error'} />;
  }
}
