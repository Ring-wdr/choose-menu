"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal, useFormStatus } from "react-dom";
import { useScreenSize } from "@/hooks/useScreenSize";
import executeAnimate from "@/hooks/executeAnimate";
import Button from "@/component/Button";
import clsx from "clsx";
import bsStyles from "./sheet.module.css";

type BottomSheetProps = {
  isOpen: boolean;
  onToggle?: (input: boolean) => void;
} & React.PropsWithChildren;

type BottomSheetCtxProps = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};
export const BottomSheetContext = createContext<BottomSheetCtxProps>({
  isOpen: false,
});
const useBottomSheetContext = () => useContext(BottomSheetContext);

function BottomSheetlMain({ children, onToggle, isOpen }: BottomSheetProps) {
  const [{ onOpen, onClose }] = useState(() => ({
    onOpen: () => onToggle && onToggle(true),
    onClose: () => onToggle && onToggle(false),
  }));
  return (
    <BottomSheetContext.Provider value={{ onOpen, onClose, isOpen }}>
      {children}
    </BottomSheetContext.Provider>
  );
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

export type BottomSheetPortalProps = {
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
  breakPosition?: Array<number | `${number}%`>;
  closeWhenBackdropClick?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const BottomSheet = ({
  initPosition = "20%",
  closePosition = "50%",
  breakPosition = [],
  closeWhenBackdropClick = true,
  children,
  className,
  ...props
}: BottomSheetPortalProps) => {
  /** 페이지의 크기 */
  const bodyHeight = useScreenSize();
  const { onClose, isOpen } = useBottomSheetContext();
  const portalRef = useRef(document.createElement("div"));

  /** control drag state */
  const divRef = useRef<HTMLDivElement>(null);
  const dragStateOn = () => {
    if (divRef.current) divRef.current.dataset.drag = "true";
  };
  const dragStateOff = () => {
    if (divRef.current) divRef.current.dataset.drag = "false";
  };
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
    if (divRef.current === null || divRef.current.dataset.drag === "false")
      return;

    divRef.current.style.setProperty(
      "translate",
      `-50% ${
        e.clientY < topPosition ? (topPosition + e.clientY) / 2 : e.clientY
      }px`
    );
  };

  const closeDragElement = () => {
    if (divRef.current === null) return;
    dragStateOff();
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

    if (currentTopPosition < standardClosePosition) {
      /** 현재 위치와 닫히는 위치와의 비교*/
      const calculatedDiffBreakPositions = [...breakPosition, initPosition].map(
        (position) => {
          const calcPosition = getPosition(position, bodyHeight);
          return {
            calcPosition,
            diff: Math.abs(currentTopPosition - calcPosition),
          };
        }
      );
      const { calcPosition } = calculatedDiffBreakPositions.reduce(
        (result, item) => (item.diff < result.diff ? item : result),
        {
          calcPosition: 0,
          diff: Number.MAX_SAFE_INTEGER,
        }
      );
      divRef.current.style.setProperty("translate", `-50% ${calcPosition}px`);
    } else {
      onCloseAction();
    }
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
    dragStateOff();
    if (isOpen) {
      setTimeout(() => {
        document.body.style.setProperty("overflow", "hidden");
        divRef.current?.style.setProperty("translate", `-50% ${topPosition}px`);
      }, 100);
    } else {
      document.body.style.removeProperty("overflow");
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
          onClick={(e) => closeWhenBackdropClick && onCloseAction(e)}
          onMouseLeave={closeDragElement}
        >
          <div
            ref={divRef}
            className={clsx(bsStyles.bottomSheet, className)}
            {...props}
          >
            <div
              className={bsStyles.handle}
              onMouseDown={dragStateOn}
              onTouchStart={dragStateOn}
              onMouseUp={dragStateOff}
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

function BottomSheetCloseButton({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const { onClose } = useBottomSheetContext();
  return (
    <Button onClick={onClose} {...props}>
      {children}
    </Button>
  );
}

type BottomSheetSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "disabled"
> & {
  closeOnSubmit?: boolean;
  childrenOnPending?: React.ReactNode;
};

function BottomSheetSubmitButton({
  children,
  childrenOnPending,
  closeOnSubmit,
  ...props
}: BottomSheetSubmitButtonProps) {
  const { onClose } = useBottomSheetContext();
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

const BS = Object.assign(BottomSheetlMain, {
  Close: BottomSheetCloseButton,
  Submit: BottomSheetSubmitButton,
  BottomSheet,
});

export function hasTarget(container: HTMLDivElement) {
  if (container === null) return false;
  return document.body.contains(container);
}

export default BS;
