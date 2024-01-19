import React, { useId, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { reducer, ButtonUnion } from "./reducer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MenuProps } from "@/type";
import { action } from "./action";

type DialogDispatch = (input: Parameters<typeof reducer>[1]) => void;

type AdminDialogProps = {
  type: ButtonUnion;
  open: boolean;
  dispatch: DialogDispatch;
  hasForm?: boolean;
  hasConfirm?: boolean;
  description?: string;
  item?: MenuProps;
};

function AdminDialog({
  type,
  open,
  dispatch,
  hasForm = true,
  hasConfirm = true,
  item,
  description,
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
            {hasConfirm && <DialogFormButton type={type} dispatch={dispatch} />}
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
  item?: MenuProps;
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
        placeholder="한글 이름"
      />
      <Label htmlFor={`${id}name_eng`}>이름(영어)</Label>
      <Input
        id={`${id}name_eng`}
        name="name.eng"
        defaultValue={item?.name.eng}
        placeholder="English Name"
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
        <Switch id={`${id}soldout`} name="soldOut" />
        <Label htmlFor={`${id}decaf`}>디카페인 여부</Label>
        <Switch id={`${id}decaf`} name="decaf" />
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
