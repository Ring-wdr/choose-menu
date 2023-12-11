"use client";

import { useFormStatus } from "react-dom";
import Button from "@/component/Button";
import LoadingImage from "@/component/Loading";
import Modal from "@/component/Modal";

export default function LoadingButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <Button fullWidth>선택</Button>
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
