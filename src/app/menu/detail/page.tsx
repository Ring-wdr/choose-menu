import { cookies } from 'next/headers';

import { getRecentMenuByUserName } from '@/database/coffeebean/get';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  const userCookie = cookies().get('userName');

  try {
    const data = await getRecentMenuByUserName(userCookie!.value);
    return (
      <div className="h-[calc(100%-var(--header-height)-var(--name-section-height))] overflow-y-scroll">
        {JSON.stringify(data || 'false')}
      </div>
    );
  } catch (e) {
    if (e instanceof Error)
      return (
        <div className="h-[calc(100%-var(--header-height)-var(--name-section-height))] overflow-y-scroll">
          {JSON.stringify(e.message || 'false')}
        </div>
      );
  }
}
