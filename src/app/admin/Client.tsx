"use client";

import Button from "@/component/Button";
import { useFormState, useFormStatus } from "react-dom";
import { crawlDataFromExternal } from "./action";
import { useId } from "react";

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button fullWidth type="submit">
      {status.pending ? "크롤링 중입니다." : "크롤링"}
    </Button>
  );
}

export default function Client() {
  const [sendState, formAction] = useFormState(crawlDataFromExternal, []);
  const masterKey = useId();
  return (
    <div>
      <form action={formAction}>
        <label htmlFor={masterKey}>크롤링 권한 비밀번호</label>
        <input type="text" id={masterKey} name="masterKey" />
        <SubmitButton />
      </form>
      <p>실행 결과</p>
      <ul>
        {sendState.map((str, idx) => (
          <li key={idx}>{str}</li>
        ))}
      </ul>
    </div>
  );
}
