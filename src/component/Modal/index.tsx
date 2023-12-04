import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.css";

type ModalProps = {
  onClose?: () => void;
} & React.PropsWithChildren;

export default function Modal({ onClose, children }: ModalProps) {
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

function hasTarget(container: HTMLDivElement) {
  if (container === null) return false;
  return document.body.contains(container);
}
