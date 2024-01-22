'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';

import CustomBottomSheet from '@/components/BottomSheet/Custom';
import { Button } from '@/components/ui/button';

import { getUserNameFromSession } from '../action';

import { NameChangeForm } from './Form';
import { useMenuContext } from './MenuContext';

import styles from '../layout.module.css';

export default function NameSection() {
  // user state
  const [userName, formAction] = useFormState(getUserNameFromSession, '');
  const { menu } = useMenuContext();
  const parsedMenu =
    menu &&
    `현재 메뉴는 (${menu.size || 'S'})${menu.temperature || ''} ${
      menu.menuName
    }${menu.decaf ? '(DECAF)' : ''}입니다.`;

  // modal state
  const [isBSOpen, setBSOpen] = useState(false);
  const bsOpen = () => setBSOpen(true);
  const bsClose = () => setBSOpen(false);

  useEffect(() => {
    if (!userName) formAction(new FormData());
  }, [userName, formAction]);

  return (
    <div className={styles.name_section}>
      <p>
        {userName ? (
          <>
            <Button variant={'link'} onClick={bsOpen} className={'p-0'}>
              {userName} ✎
            </Button>
            님, {parsedMenu || '메뉴를 고르세요.'}
          </>
        ) : (
          '사용자 정보를 불러오는 중입니다.'
        )}
      </p>
      <div>
        <Link href={'/menu/bill'}>
          <Button>청구서</Button>
        </Link>
      </div>
      {isBSOpen ? (
        <CustomBottomSheet isOpen={isBSOpen} onClose={bsClose}>
          <NameChangeForm userName={userName} formAction={formAction} />
        </CustomBottomSheet>
      ) : null}
    </div>
  );
}
