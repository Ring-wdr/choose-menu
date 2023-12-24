"use client";
import { useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { startSafeViewTransition } from "@/hooks/startSafeViewTransition";
import styles from "./index.module.css";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef(null);
  const router = useRouter();

  const onClick: MouseEventHandler = (e) => {
    if (e.target === overlay.current) {
      startSafeViewTransition(router.back);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") startSafeViewTransition(router.back);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div ref={overlay} className={styles["custom-portal"]} onClick={onClick}>
      <div className={styles["modal-wrapper"]}>{children}</div>
    </div>
  );
}
