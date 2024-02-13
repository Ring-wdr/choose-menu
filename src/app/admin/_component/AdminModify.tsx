import React, { useEffect, useId, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { coffeeSize, MenuPropsWithId } from '@/type';

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
  action?: (itemId: string, formData: FormData) => void;
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
  const bindedAction = action?.bind(null, item?._id ?? '');
  return (
    <Dialog open={open} onOpenChange={(payload) => dispatch({ type, payload })}>
      <DialogTrigger asChild>
        <Button>{type}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-5">
          <DialogTitle>메뉴 {type}</DialogTitle>
          {(description || !item) && (
            <DialogDescription>
              {item ? description : 'There is no selected Item on Screen'}
            </DialogDescription>
          )}
        </DialogHeader>
        {item ? (
          <form action={bindedAction}>
            {hasForm && <DialogForm item={item} />}
            <DialogFooter className="sm:justify-start mt-6">
              <DialogFormButton type={type} dispatch={dispatch} />
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  닫기
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter className="sm:justify-start mt-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                닫기
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
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
      <Label htmlFor={`${id}only`}>온도 제한</Label>
      <Input
        id={`${id}only`}
        name="only"
        defaultValue={item?.only}
        placeholder="온도 제한"
      />
      <div className="flex justify-between p-5">
        <Label>사이즈</Label>
        {coffeeSize.map((size) => (
          <div key={size} className="items-top flex space-x-2">
            <Checkbox
              name="size"
              value={size}
              defaultChecked={!item?.size || item.size.includes(size)}
            />
            <div className="grid gap-1.5 leading-none">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {size}
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="m-3 flex gap-3 items-center justify-between flex-row ">
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
