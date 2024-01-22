'use client';

import { useFormState } from 'react-dom';

import { toggleOrderState } from '../action';

export default function OrderBlockForm() {
  const [orderState, orderAction] = useFormState(toggleOrderState, {
    message: '',
  });
  return (
    <div>
      <form action={orderAction}>
        <button> 서버 상태 변경</button>
      </form>
      <p>{typeof orderState.status == 'boolean' && orderState.message}</p>
    </div>
  );
}
