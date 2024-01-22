"use client";

import React, {
  createContext,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal, useFormStatus } from "react-dom";

import Button from "@/components/Button";
import executeAnimate from "@/hooks/executeAnimate";
import { useScreenSize } from "@/hooks/useScreenSize";

import bsStyles from "./sheet.module.css";

type BottomSheetProps = {
  isOpen: boolean;
  onClose?: () => void;
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
};

type BottomSheetCtxProps = {
  onCloseAction: (e?: ReactMouseEvent<HTMLElement>) => void;
  portalRef?: React.MutableRefObject<HTMLDivElement>;
  dragRef?: React.RefObject<HTMLDivElement>;
  dragStateOn: () => void;
  dragStateOff: () => void;
  closeDragElement: () => void;
  topPosition: number;
  bodyHeight: number;
} & Required<Omit<BottomSheetProps, "onClose">>;

const bottomSheetInitValue = {
  isOpen: false,
  topPosition: 0,
  initPosition: "20%",
  closePosition: "50%",
  bodyHeight: 0,
  breakPosition: [],
  closeWhenBackdropClick: true,
  onCloseAction() {},
  dragStateOn() {},
  dragStateOff() {},
  closeDragElement() {},
} satisfies BottomSheetCtxProps;

export const BottomSheetContext =
  createContext<BottomSheetCtxProps>(bottomSheetInitValue);
const useBottomSheetContext = () => useContext(BottomSheetContext);

function BottomSheetlMain({
  isOpen,
  onClose,
  children,
  initPosition = "20%",
  closePosition = "50%",
  breakPosition = ["0%"],
  closeWhenBackdropClick = true,
}: React.PropsWithChildren<BottomSheetProps>) {
  const portalRef = useRef(document.createElement("div"));
  /** control handle state */
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStateOn = () => {
    if (dragRef.current) dragRef.current.dataset.drag = "true";
  };
  const dragStateOff = () => {
    if (dragRef.current) dragRef.current.dataset.drag = "false";
  };
  /** 페이지의 크기 */
  const { height: bodyHeight } = useScreenSize();
  const topPosition = getPosition(initPosition, bodyHeight);
  const onCloseAction = useCallback(
    (e?: ReactMouseEvent<HTMLElement>) => {
      if (!dragRef || (e && e.target !== e.currentTarget)) return;
      /** 현재 위치 */
      const currentTopPosition = Number(getBSPosition(dragRef));
      if (dragRef.current) dragRef.current.style.transition = "none";
      document.body.style.removeProperty("overflow");
      executeAnimate(
        currentTopPosition,
        (position) => (setBSPosition(dragRef, `${position}px`), position + 30),
        (position) => position < document.body.clientHeight,
      );
      onClose && setTimeout(onClose, 300);
    },
    [onClose, dragRef],
  );
  const closeDragElement = () => {
    if (!dragRef || dragRef.current === null) return;
    dragStateOff();
    const dividePercentage = Number(closePosition.slice(0, -1)) / 100;
    /** 현재 위치 */
    const currentTopPosition = Number(getBSPosition(dragRef));
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
        },
      );
      const { calcPosition } = calculatedDiffBreakPositions.reduce(
        (result, item) => (item.diff < result.diff ? item : result),
        {
          calcPosition: 0,
          diff: Number.MAX_SAFE_INTEGER,
        },
      );
      setBSPosition(dragRef, `${calcPosition}px`);
    } else {
      onCloseAction();
    }
  };

  useEffect(() => {
    if (dragRef.current === null) return;
    dragStateOff();
    if (isOpen) {
      setTimeout(() => {
        document.body.style.setProperty("overflow", "hidden");
        setBSPosition(dragRef, `${topPosition}px`);
      }, 100);
    } else {
      document.body.style.removeProperty("overflow");
      setTimeout(() => {
        dragRef.current?.style.removeProperty("--current-bs-position");
      }, 1000);
    }
  }, [isOpen, topPosition]);

  return (
    <BottomSheetContext.Provider
      value={{
        isOpen,
        portalRef,
        dragRef,
        dragStateOn,
        dragStateOff,
        closeDragElement,
        topPosition,
        initPosition,
        closePosition,
        breakPosition,
        bodyHeight,
        onCloseAction,
        closeWhenBackdropClick,
      }}
    >
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

function getBSPosition(bsRef: React.RefObject<HTMLDivElement>) {
  return (
    bsRef.current?.style
      .getPropertyValue("--current-bs-position")
      .slice(0, -2) || "0"
  );
}
function setBSPosition(
  bsRef: React.RefObject<HTMLDivElement>,
  position: string,
) {
  bsRef.current?.style.setProperty("--current-bs-position", position);
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

export const BottomSheet = ({ children }: { children: React.ReactElement }) => {
  const {
    portalRef,
    dragRef,
    topPosition,
    onCloseAction,
    closeDragElement,
    closeWhenBackdropClick,
  } = useBottomSheetContext();

  const elementMouseDrag = (e: ReactMouseEvent) =>
    requestAnimationFrame(() => {
      e.preventDefault();
      if (
        !dragRef ||
        dragRef.current === null ||
        dragRef.current.dataset.drag === "false"
      )
        return;
      setBSPosition(
        dragRef,
        `${
          (e.clientY < topPosition
            ? (topPosition + e.clientY) / 2
            : e.clientY) - 20
        }px`,
      );
    });
  useEffect(() => {
    if (!portalRef) return;
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
  }, [portalRef, onCloseAction]);

  return portalRef && portalRef.current
    ? createPortal(
        <div
          className={bsStyles.backdrop}
          onMouseUp={closeDragElement}
          onMouseMove={elementMouseDrag}
          onClick={(e) => closeWhenBackdropClick && onCloseAction(e)}
          onMouseLeave={closeDragElement}
        >
          {React.cloneElement(children, { ...children.props, ref: dragRef })}
        </div>,
        portalRef.current,
      )
    : null;
};

function BottomSheetHandle({
  className,
  children,
}: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const { dragRef, topPosition, closeDragElement, dragStateOn, dragStateOff } =
    useBottomSheetContext();

  const elementDrag = (e: ReactTouchEvent<HTMLDivElement>) =>
    requestAnimationFrame(() => {
      if (!dragRef || dragRef.current === null) return;
      const { clientY } = e.touches[0];
      setBSPosition(
        dragRef,
        `${
          (clientY < topPosition ? (topPosition + clientY) / 2 : clientY) - 20
        }px`,
      );
    });

  return (
    <div
      className={className}
      onMouseDown={dragStateOn}
      onTouchStart={dragStateOn}
      onMouseUp={dragStateOff}
      onTouchMove={elementDrag}
      onTouchEnd={closeDragElement}
    >
      {children ?? <span />}
    </div>
  );
}

function BottomSheetCloseButton({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const { onCloseAction } = useBottomSheetContext();
  return (
    <Button onClick={onCloseAction} {...props}>
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
  const { onCloseAction } = useBottomSheetContext();
  const { pending } = useFormStatus();
  const [sended, setSend] = useState(false);

  if (closeOnSubmit && pending && !sended) setSend(true);

  useEffect(() => {
    if (closeOnSubmit && !pending && sended) onCloseAction();
  }, [closeOnSubmit, pending, sended, onCloseAction]);

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
  Handle: BottomSheetHandle,
});

export function hasTarget(container: HTMLDivElement) {
  if (container === null) return false;
  return document.body.contains(container);
}

export default BS;
