'use client';

import { useRouter } from 'next/navigation';

import CustomBottomSheet from '@/components/BottomSheet/Custom';
import { getRecentMenuByUserName } from '@/database/coffeebean/get';
import { startSafeViewTransition } from '@/hooks/startSafeViewTransition';
import { AwaitedReturn } from '@/type';

export default function Client({
  data,
}: {
  data: AwaitedReturn<typeof getRecentMenuByUserName> | string;
}) {
  const router = useRouter();

  return (
    <CustomBottomSheet
      isOpen
      onClose={() => startSafeViewTransition(router.back)}
    >
      {Array.isArray(data) ? (
        <div className="flex flex-col items-center">
          <p>현재 선택하신 메뉴입니다.</p>
          {data.map((order, idx) =>
            order ? (
              <div
                key={order.userName + idx}
                className="flex flex-col items-center py-3"
              >
                {!order.sub ? <p>1순위</p> : <p>2순위</p>}
                <p>
                  [{order.size}]{order.menuName}
                </p>
                {order.temperature}
                {order.shot && `${order.shot} SHOT`}
                {order.decaf && '디카페인'}
              </div>
            ) : null,
          )}
        </div>
      ) : (
        data ?? (
          <p className="flex justify-center">현재 선택하신 메뉴가 없습니다.</p>
        )
      )}
    </CustomBottomSheet>
  );
}
