'use client';

import { useEffect, useState } from 'react';

import styles from './style.module.css';

/** 외부로부터 받는 block 상태가 우선이며 받지 않는 경우 내부에서 서버 요청을 보내 상태를 가져온다  */
export default function BlockPage({ isBlock }: { isBlock?: boolean }) {
  const block = useOrderblock(isBlock);
  if (block)
    return (
      <div className={styles['block-page']}>현재는 주문할 수 없습니다.</div>
    );
  return null;
}

const useOrderblock = (isBlock?: boolean) => {
  const [block, setBlock] = useState(isBlock);
  useEffect(() => {
    if (typeof isBlock === 'boolean') return;
    const { close } = listenSSE((event) => {
      setBlock(event.data === 'true');
    });
    return () => close();
  }, [isBlock]);
  return block;
};

function listenSSE(
  callback: (event: MessageEvent<any>) => { cancel?: true } | void,
  onerror?: (event: Event) => void,
) {
  const eventSource = new EventSource('/api/orderblock', {
    withCredentials: true,
  });
  console.info('Listenting on SEE');
  eventSource.addEventListener('open', (event) => {
    console.log(event.type);
  });
  eventSource.addEventListener(
    'message',
    (event) => {
      const result = callback(event);
      if (result?.cancel) {
        console.info('Closing SSE');
        eventSource.close();
      }
    },
    false,
  );
  eventSource.addEventListener('error', (event) => {
    onerror && onerror(event);
  });

  return {
    close: () => {
      console.info('Closing SSE');
      eventSource.close();
    },
  };
}
