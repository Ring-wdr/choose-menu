'use client';

import { useRouter } from 'next/navigation';

import BillTable from '@/app/_component/bill';
import CustomBottomSheet from '@/components/BottomSheet/Custom';
import { startSafeViewTransition } from '@/hooks/startSafeViewTransition';

export default function Client({
  data,
  isAdmin,
}: {
  data: React.ComponentProps<typeof BillTable>['data'];
  isAdmin?: boolean;
}) {
  const router = useRouter();

  return (
    <CustomBottomSheet
      isOpen
      onClose={() => startSafeViewTransition(router.back)}
    >
      <BillTable data={data} draggable={false} isAdmin={isAdmin} />
    </CustomBottomSheet>
  );
}
