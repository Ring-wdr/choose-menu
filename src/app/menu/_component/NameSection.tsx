"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { getUserNameFromSession } from "../action";
import Button from "@/component/Button";
import { NameChangeForm } from "./Form";
import styles from "../layout.module.css";
import MenuBottomSheet from "./MenuBottomSheet";

export default function NameSection() {
  const [userName, formAction] = useFormState(getUserNameFromSession, "");
  // modal state
  const [isBSOpen, setBSOpen] = useState(false);
  const bsOpen = () => setBSOpen(true);
  const bsClose = () => setBSOpen(false);

  useEffect(() => {
    if (!userName) formAction(new FormData());
  }, [userName, formAction]);

  return (
    <div className={styles.name_section}>
      <p>
        {userName
          ? `${userName}님, 메뉴를 고르세요`
          : "사용자 정보를 불러오는 중입니다."}
      </p>
      <Button onClick={bsOpen}>이름 변경</Button>
      {isBSOpen ? (
        <MenuBottomSheet isOpen={isBSOpen} onClose={bsClose}>
          <NameChangeForm userName={userName} formAction={formAction} />
        </MenuBottomSheet>
      ) : null}
    </div>
  );
}
