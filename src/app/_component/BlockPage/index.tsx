'use client';

import { useEffect, useState } from 'react';

import styles from './style.module.css';

/** 외부로부터 받는 block 상태가 우선이며 받지 않는 경우 내부에서 서버 요청을 보내 상태를 가져온다  */
export default function BlockPage({ isBlock }: { isBlock?: boolean }) {
  const [block, error] = useOrderblock(isBlock);
  if (block || error)
    return (
      <div className={styles['block-page']}>현재는 주문할 수 없습니다.</div>
    );
  return null;
}

const useOrderblock = (isBlock?: boolean): [boolean | undefined, boolean] => {
  const [block, setBlock] = useState(isBlock);
  const [error, setError] = useState(false);
  useEffect(() => {
    const ctl = new AbortController();
    if (typeof isBlock !== 'boolean') {
      const { signal } = ctl;
      fetch('/api/orderblock', { signal })
        .then((res) => res.json())
        .then(({ status }) => setBlock(status))
        .catch(() => !signal.aborted && setError(true));
    }
    return () => ctl.abort();
  }, [isBlock]);

  return [block, error];
};
