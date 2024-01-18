"use client";

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { createPortal, useFormStatus } from "react-dom";
import Button from "@/components/Button";
import styles from "./index.module.css";

type ModalProps = {
  isOpen: boolean;
  onToggle?: (input: boolean) => void;
} & React.PropsWithChildren;

type ModalCtxProps = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};
export const ModalContext = createContext<ModalCtxProps>({
  isOpen: false,
});
const useModalContext = () => useContext(ModalContext);

function ModalMain({ children, onToggle, isOpen }: ModalProps) {
  const [{ onOpen, onClose }] = useState(() => ({
    onOpen: () => onToggle && onToggle(true),
    onClose: () => onToggle && onToggle(false),
  }));
  return (
    <ModalContext.Provider value={{ onOpen, onClose, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

function ModalPortal({ children }: React.PropsWithChildren) {
  const { onClose } = useModalContext();

  const portalRef = useRef(document.createElement("div"));
  useEffect(() => {
    const container = portalRef.current;
    if (!hasTarget(container)) {
      portalRef.current.className = styles["custom-portal"];
      document.body.appendChild(portalRef.current);
    }
    const onCloseByBackdropClick = (e: MouseEvent) => {
      if (onClose && e.target === e.currentTarget) {
        onClose();
      }
    };
    const onCloseByEsc = (e: KeyboardEvent) => {
      onClose && e.key === "Escape" && onClose();
    };
    if (onClose) {
      container.addEventListener("click", onCloseByBackdropClick);
      window.addEventListener("keyup", onCloseByEsc);
    }
    return () => {
      if (hasTarget(container)) {
        document.body?.removeChild(container);
      }
      if (onClose) {
        container.addEventListener("click", onCloseByBackdropClick);
        window.removeEventListener("keyup", onCloseByEsc);
      }
    };
  }, [onClose]);

  return portalRef.current
    ? createPortal(children ?? "내용을 채워주세요.", portalRef.current)
    : null;
}

function ModalCloseButton({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const { onClose } = useModalContext();
  return (
    <Button onClick={onClose} {...props}>
      {children}
    </Button>
  );
}

type ModalSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "disabled"
> & {
  closeOnSubmit?: boolean;
  childrenOnPending?: React.ReactNode;
};

function ModalSubmitButton({
  children,
  childrenOnPending,
  closeOnSubmit,
  ...props
}: ModalSubmitButtonProps) {
  const { onClose } = useModalContext();
  const { pending } = useFormStatus();
  if (closeOnSubmit && pending && onClose) {
    onClose();
  }
  return (
    <Button disabled={pending} {...props}>
      {pending ? childrenOnPending : children}
    </Button>
  );
}

const Modal = Object.assign(ModalMain, {
  Portal: ModalPortal,
  Close: ModalCloseButton,
  Submit: ModalSubmitButton,
});

export function hasTarget(container: HTMLDivElement) {
  if (container === null) return false;
  return document.body.contains(container);
}

export default Modal;
