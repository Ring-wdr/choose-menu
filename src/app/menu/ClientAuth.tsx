"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import BS from "@/component/BottomSheet";
import Button from "@/component/Button";
import { getUserNameFromSession } from "./action";
import clsx from "clsx";
import styles from "./page.module.css";
import BSStyles from "./menu_bottomsheet.module.css";

export function ClientNameSide() {
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
        <BS isOpen={isBSOpen} onClose={bsClose}>
          <BS.BottomSheet>
            <div className={clsx(BSStyles.bottomSheet)}>
              <BS.Handle className={clsx(BSStyles.handle)} />
              <div className={styles.modal_container}>
                <p>이름을 변경하세요.</p>
                <form action={formAction}>
                  <input
                    type="text"
                    name="userName"
                    placeholder={userName}
                    required
                    title="같은 이름은 입력할 수 없습니다."
                    pattern={`^(?:(?!${userName}).)*$`}
                    maxLength={4}
                  />
                  <BS.Submit fullWidth>변경</BS.Submit>
                </form>
              </div>
            </div>
          </BS.BottomSheet>
        </BS>
      ) : null}
    </div>
  );
}
