"use client";

import Button from "@/component/Button";
import { useFormState, useFormStatus } from "react-dom";
import { crawlDataFromExternal } from "./action";

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit">
      {status.pending ? "크롤링 중입니다." : "크롤링"}{" "}
    </Button>
  );
}

export default function Client() {
  const [sendState, formAction] = useFormState(crawlDataFromExternal, []);
  return (
    <div>
      <form action={formAction}>
        <input type="text" name="masterKey" />
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
