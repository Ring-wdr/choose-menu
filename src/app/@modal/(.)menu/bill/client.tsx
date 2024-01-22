'use client';

import { useRouter } from 'next/navigation';

import BillTable from '@/app/_component/bill';
import CustomBottomSheet from '@/components/BottomSheet/Custom';
import { startSafeViewTransition } from '@/hooks/startSafeViewTransition';

export default function Client({
  data,
}: {
  data: React.ComponentProps<typeof BillTable>['data'];
}) {
  const router = useRouter();

  return (
    <CustomBottomSheet
      isOpen
      onClose={() => startSafeViewTransition(router.back)}
    >
      <BillTable data={data} draggable={false} />
    </CustomBottomSheet>
  );
}
