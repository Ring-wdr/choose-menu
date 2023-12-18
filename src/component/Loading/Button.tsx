"use client";

import { useFormStatus } from "react-dom";
import Button from "@/component/Button";
import LoadingImage from "@/component/Loading";
import Modal from "@/component/Modal";

type LoadingButtonProps = {
  label?: string;
  labelOnPending?: string;
} & React.ComponentProps<typeof Button>;

export default function LoadingButton({
  label = "선택",
  labelOnPending = "요청 중...",
  fullWidth = true,
  ...props
}: LoadingButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button fullWidth={fullWidth} {...props}>
        {pending ? labelOnPending || "요청 중..." : label || "선택"}
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
