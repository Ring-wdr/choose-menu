"use client";

import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
  useCallback,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal, useFormStatus } from "react-dom";
import { useScreenSize } from "@/hooks/useScreenSize";
import executeAnimate from "@/hooks/executeAnimate";
import Button from "@/component/Button";
import clsx from "clsx";
import styles from "./index.module.css";
import bsStyles from "./sheet.module.css";

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

/**
 * 설정할 위치값을 반환하는 함수
 * @param pos 현재 위치
 * @param height 브라우저의 세로 크기
 * @returns
 */
function getPosition(pos: number | `${number}%`, height: number) {
  return typeof pos === "number"
    ? pos
    : ~~((Number(pos.slice(0, -1)) * height) / 100);
}

export type BottomSheetProps = {
  /** 퍼센트(%, '20%') 입력시 비율, 숫자 입력시 고정 픽셀(px)
   * ```
   * 0%: 초기 위치보다 아래인 경우 닫기
   * 50%: 화면 중간 아래인 경우 닫기
   * 100%: 화면 아래인 경우 닫기
   * ```
   */
  initPosition?: number | `${number}%`;
  /** 바텀 시트가 몇 프로 이하로 내려갔을 때 닫게 하는지 결정 */
  closePosition?: `${number}%`;
} & HTMLAttributes<HTMLDivElement>;

export const BottomSheet = ({
  initPosition = "20%",
  closePosition = "50%",
  children,
  className,
  ...props
}: BottomSheetProps) => {
  /** 페이지의 크기 */
  const bodyHeight = useScreenSize();
  const { onClose, isOpen } = useModalContext();
  const portalRef = useRef(document.createElement("div"));

  /** control drag state */
  const dragRef = useRef(false);
  const divRef = useRef<HTMLDivElement>(null);
  const topPosition = getPosition(initPosition, bodyHeight);

  const elementDrag = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (divRef.current === null) return;
    const { clientY } = e.touches[0];
    divRef.current.style.setProperty(
      "translate",
      `-50% ${clientY < topPosition ? (topPosition + clientY) / 2 : clientY}px`
    );
  };

  const elementMouseDrag = (e: ReactMouseEvent) => {
    e.preventDefault();
    if (divRef.current === null || !dragRef.current) return;

    divRef.current.style.setProperty(
      "translate",
      `-50% ${
        e.clientY < topPosition ? (topPosition + e.clientY) / 2 : e.clientY
      }px`
    );
  };

  const closeDragElement = () => {
    if (divRef.current === null) return;
    dragRef.current = false;
    /**
     * ```
     * 0%: topPosition
     * 50%: bodySize / 2 + topPostiion / 2
     * 100%: bodySize
     * ```
     */
    const dividePercentage = Number(closePosition.slice(0, -1)) / 100;
    /** 현재 위치 */
    const currentTopPosition = Number(
      divRef.current.style.translate.split(" ")[1].slice(0, -2)
    );
    /** 바텀 시트가 닫히는 기준 위치 */
    const standardClosePosition =
      bodyHeight * dividePercentage + topPosition * (1 - dividePercentage);

    currentTopPosition < standardClosePosition
      ? divRef.current.style.setProperty("translate", `-50% ${topPosition}px`)
      : onCloseAction();
  };

  const onCloseAction = useCallback(
    (e?: ReactMouseEvent<HTMLDivElement>) => {
      if (e && e.target !== e.currentTarget) return;
      /** 현재 위치 */
      const currentTopPosition = Number(
        divRef.current?.style.translate.split(" ")[1].slice(0, -2) || "0"
      );
      document.body.style.removeProperty("overflow");
      executeAnimate(
        currentTopPosition,
        (position) => (
          divRef.current?.style.setProperty("translate", `-50% ${position}px`),
          position + 30
        ),
        (position) => position < document.body.clientHeight
      );
      onClose && setTimeout(onClose, 300);
    },
    [onClose, divRef]
  );

  useEffect(() => {
    if (divRef.current === null) return;
    if (isOpen) {
      setTimeout(() => {
        document.body.style.setProperty("overflow", "hidden");
        divRef.current?.style.setProperty("translate", `-50% ${topPosition}px`);
      }, 100);
    } else {
      document.body.style.removeProperty("overflow");
      dragRef.current = false;
      setTimeout(() => {
        divRef.current?.style.removeProperty("translate");
      }, 100);
    }
  }, [isOpen, topPosition]);

  useEffect(() => {
    const container = portalRef.current;
    if (!hasTarget(container)) {
      document.body.appendChild(portalRef.current);
    }
    const onCloseByEsc = (e: KeyboardEvent) => {
      e.key === "Escape" && onCloseAction();
    };
    window.addEventListener("keyup", onCloseByEsc);
    return () => {
      if (hasTarget(container)) {
        document.body?.removeChild(container);
      }
      window.removeEventListener("keyup", onCloseByEsc);
    };
  }, [onCloseAction]);

  return portalRef.current
    ? createPortal(
        <div
          className={bsStyles.backdrop}
          onMouseUp={closeDragElement}
          onMouseMove={elementMouseDrag}
          onClick={onCloseAction}
          onMouseLeave={closeDragElement}
        >
          <div
            ref={divRef}
            className={clsx(
              bsStyles.bottomSheet,
              { [bsStyles.dragging]: dragRef.current },
              className
            )}
            {...props}
          >
            <div
              className={bsStyles.handle}
              onMouseDown={() => (dragRef.current = true)}
              onTouchStart={() => (dragRef.current = true)}
              onMouseUp={() => (dragRef.current = false)}
              onTouchMove={elementDrag}
              onTouchEnd={closeDragElement}
            >
              <span />
            </div>
            <div className={bsStyles.children}>{children}</div>
          </div>
        </div>,
        portalRef.current
      )
    : null;
};

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
  BottomSheet,
});

export function hasTarget(container: HTMLDivElement) {
  if (container === null) return false;
  return document.body.contains(container);
}

export default Modal;
