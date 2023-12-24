"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useMenuContext } from "./MenuContext";
import { NameChangeForm } from "./Form";
import { getUserNameFromSession } from "../action";
import CustomBottomSheet from "@/component/BottomSheet/Custom";
import Button from "@/component/Button";
import styles from "../layout.module.css";

export default function NameSection() {
  // user state
  const [userName, formAction] = useFormState(getUserNameFromSession, "");
  const { menu } = useMenuContext();
  const parsedMenu = menu && `현재 메뉴는 ${menu.name.kor} 입니다.`;

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
        {userName ? (
          <>
            <Button resetStyle onClick={bsOpen} className={styles.name}>
              {userName} ✎
            </Button>
            님, {parsedMenu || "메뉴를 고르세요"}
          </>
        ) : (
          "사용자 정보를 불러오는 중입니다."
        )}
      </p>
      <div>
        <Link href={"/menu/bill"}>
          <Button variant="medium">청구서</Button>
        </Link>
      </div>
      {isBSOpen ? (
        <CustomBottomSheet isOpen={isBSOpen} onClose={bsClose}>
          <NameChangeForm userName={userName} formAction={formAction} />
        </CustomBottomSheet>
      ) : null}
    </div>
  );
}
