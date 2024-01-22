'use client';

import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';

import { toggleOrderState } from '../action';

export default function OrderBlockForm() {
  const [orderState, orderAction] = useFormState(toggleOrderState, {
    message: '',
  });
  return (
    <div>
      <form action={orderAction}>
        <Button> 서버 상태 변경</Button>
      </form>
      <p>{typeof orderState.status == 'boolean' && orderState.message}</p>
    </div>
  );
}
