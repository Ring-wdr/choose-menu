'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';

import CustomBottomSheet from '@/components/BottomSheet/Custom';
import { Button } from '@/components/ui/button';

import { getUserNameFromSession } from '../action';

import { NameChangeForm } from './Form';

export default function NameSection() {
  // user state
  const [userName, formAction] = useFormState(getUserNameFromSession, '');

  // modal state
  const [isBSOpen, setBSOpen] = useState(false);
  const bsOpen = () => setBSOpen(true);
  const bsClose = () => setBSOpen(false);

  useEffect(() => {
    if (!userName) formAction(new FormData());
  }, [userName, formAction]);

  return (
    <div className="flex justify-between items-center p-4 h-[var(--name-section-height)] bg-slate-100 dark:bg-slate-700 border-2">
      <p>
        {userName ? (
          <>
            <Button
              variant={'link'}
              onClick={bsOpen}
              className={'p-0 underline'}
            >
              {userName} ✎
            </Button>
            님, 어서오세요.
          </>
        ) : (
          '사용자 정보 불러오는 중...'
        )}
      </p>
      <div className="flex gap-2">
        <Link href={'/menu/detail'}>
          <Button>선택 메뉴</Button>
        </Link>
        <Link href={'/menu/bill'}>
          <Button>청구서</Button>
        </Link>
      </div>
      <CustomBottomSheet isOpen={isBSOpen} onClose={bsClose}>
        <NameChangeForm userName={userName} formAction={formAction} />
      </CustomBottomSheet>
    </div>
  );
}
