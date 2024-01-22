'use client';

import { useEffect, useState } from 'react';

import styles from './style.module.css';

export default function BlockPage() {
  const [isBlock, setBlock] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    const { signal } = ctl;
    fetch('/api/orderblock', { signal })
      .then((res) => res.json())
      .then(({ status }) => setBlock(status));

    return () => ctl.abort();
  }, []);

  return (
    <>
      {isBlock ? (
        <div className={styles['block-page']}>현재는 주문할 수 없습니다.</div>
      ) : null}
    </>
  );
}
