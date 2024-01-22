'use client';

import { useFormStatus } from 'react-dom';

import LoadingImage from '@/components/Loading';
import Modal from '@/components/Modal';

import { Button } from '../ui/button';

type LoadingButtonProps = {
  label?: string;
  labelOnPending?: string;
} & React.ComponentProps<typeof Button>;

export default function LoadingButton({
  label = '선택',
  labelOnPending = '요청 중...',
  className,
  ...props
}: LoadingButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button className={'w-full ' + className} {...props}>
        {pending ? labelOnPending || '요청 중...' : label || '선택'}
      </Button>
      {pending && (
        <Modal isOpen={pending}>
          <Modal.Portal>
            <LoadingImage />
          </Modal.Portal>
        </Modal>
      )}
    </>
  );
}
