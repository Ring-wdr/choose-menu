import React, { useEffect, useId, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MenuPropsWithId } from '@/type';

import { ButtonUnion, reducer } from './reducer';

type DialogDispatch = (input: Parameters<typeof reducer>[1]) => void;

type AdminDialogProps = {
  /** Dialog 기능 */
  type: ButtonUnion;
  /** Dialog 상태 */
  open: boolean;
  /** Dialog 상태의 dispatcher */
  dispatch: DialogDispatch;
  /** 수정, 추가의 경우 */
  hasForm?: boolean;
  /** 설명 */
  description?: string;
  /** table에서 선택된 메뉴 */
  item?: MenuPropsWithId;
  /** server action */
  action?: (formData: FormData) => void;
};

function AdminDialog({
  type,
  open,
  dispatch,
  hasForm = true,
  item,
  description,
  action,
}: AdminDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(payload) => dispatch({ type, payload })}>
      <DialogTrigger asChild>
        <Button>{type}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <DialogTitle>메뉴 {type}</DialogTitle>
          {description && (
            <DialogDescription className="mt-5">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <form action={action}>
          {hasForm ? (
            <DialogForm item={item} />
          ) : (
            <Input
              className="hidden"
              name="name"
              defaultValue={item?.name.kor}
              hidden
              disabled
            />
          )}
          <DialogFooter className="sm:justify-start mt-6  ">
            <DialogFormButton type={type} dispatch={dispatch} />
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                닫기
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type DialogFormProps = {
  item?: MenuPropsWithId;
};

function DialogForm({ item }: DialogFormProps) {
  const id = useId();
  return (
    <>
      <Label htmlFor={`${id}category`}>카테고리</Label>
      <Input
        id={`${id}category`}
        name="category"
        defaultValue={item?.category}
        placeholder="카테고리 키 값"
      />
      <Label htmlFor={`${id}name`}>이름(한글)</Label>
      <Input
        id={`${id}name`}
        name="name.kor"
        defaultValue={item?.name.kor}
        readOnly
        placeholder="한글 이름"
      />
      <Label htmlFor={`${id}name_eng`}>이름(영어)</Label>
      <Input
        id={`${id}name_eng`}
        name="name.eng"
        defaultValue={item?.name.eng}
        readOnly
        placeholder="English Name"
      />
      <Input
        id={`${id}`}
        name="_id"
        defaultValue={item?._id}
        readOnly
        className="hidden"
      />
      <Label htmlFor={`${id}only`}>온도 제한</Label>
      <Input
        id={`${id}only`}
        name="only"
        defaultValue={item?.only}
        placeholder="온도 제한"
      />
      <div className="m-3 flex flex-col gap-3 items-center sm:justify-between sm:flex-row ">
        <Label htmlFor={`${id}soldout`}>품절 여부</Label>
        <Switch
          id={`${id}soldout`}
          name="soldOut"
          defaultChecked={item?.soldOut}
        />
        <Label htmlFor={`${id}decaf`}>디카페인 여부</Label>
        <Switch id={`${id}decaf`} name="decaf" defaultChecked={item?.decaf} />
      </div>
    </>
  );
}

type ModalSubmitButtonProps = {
  type: ButtonUnion;
  dispatch: DialogDispatch;
  closeOnSubmit?: boolean;
  children?: React.ReactNode;
};

function DialogFormButton({
  dispatch,
  type,
  closeOnSubmit = true,
  children,
  ...props
}: ModalSubmitButtonProps) {
  const { pending } = useFormStatus();
  const sended = useRef(false);
  if (closeOnSubmit && pending && !sended.current) {
    sended.current = true;
  }

  useEffect(() => {
    closeOnSubmit &&
      !pending &&
      sended.current === true &&
      dispatch({ type, payload: false });
  }, [closeOnSubmit, pending, dispatch, type]);

  return (
    <Button disabled={pending} {...props}>
      {pending ? `${type} 중...` : children || type}
    </Button>
  );
}

export default AdminDialog;
