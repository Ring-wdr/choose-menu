'use client';

import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';

import { toggleOrderState } from '../action';

export default function OrderBlockForm() {
  const [orderState, orderAction] = useFormState(toggleOrderState, {
    message: '',
  });
  return (
    <div className="w-1/2 mx-auto mt-5">
      <form action={orderAction} className="flex flex-col">
        <Button size={'lg'}> 서버 상태 변경</Button>
      </form>
      <p className="flex justify-center mt-5">
        {typeof orderState.status == 'boolean' && orderState.message}
      </p>
    </div>
  );
}
