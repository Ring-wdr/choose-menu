"use client";

import { useId } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  crawlCategoriesFromExternal,
  crawlMenuFromExternal,
  toggleOrderState,
} from "./action";
import Button from "@/component/Button";

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button fullWidth type="submit">
      {status.pending ? "크롤링 중입니다." : "크롤링"}
    </Button>
  );
}

export default function Client() {
  const [sendState, formAction] = useFormState(crawlCategoriesFromExternal, "");
  const [sendMenu, menuAction] = useFormState(crawlMenuFromExternal, []);
  const [orderState, orderAction] = useFormState(toggleOrderState, {
    message: "",
  });
  const masterKey = useId();
  return (
    <div>
      <form action={formAction}>
        <label htmlFor={masterKey}>(크롤링) 메뉴 업데이트</label>
        <input type="text" id={masterKey} name="masterKey" />
        <SubmitButton />
      </form>
      <p>실행 결과</p>
      <ul>
        {typeof sendState === "string" ? (
          <li>{sendState || "크롤링 대기 중"}</li>
        ) : null}
        {Array.isArray(sendState)
          ? sendState.map(({ title, category }, idx) => (
              <li key={idx}>
                {title}: {category}
              </li>
            ))
          : null}
      </ul>
      <form action={menuAction}>
        <button> 메뉴 크롤링...</button>
      </form>
      <form action={orderAction}>
        <button> 서버 상태 변경</button>
      </form>
      <p>{typeof orderState.status == "boolean" && orderState.message}</p>
    </div>
  );
}
