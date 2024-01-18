"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import action from "./action";
import clsx from "clsx";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit">{pending ? "Sending" : "Submit"}</Button>;
}

export default function Page() {
  const [state, formAction] = useFormState(action, { message: "admin code" });
  return (
    <form
      action={formAction}
      className="w-1/2 h-[calc(100%-var(--header-height))] m-auto space-y-4 flex flex-col justify-center"
    >
      <Label htmlFor="admin">Welcome to Admin Page</Label>
      <Input
        id="admin"
        type="password"
        name="admin"
        placeholder="please input code"
      />
      <span className={clsx(state.ok === false && "text-red-500")}>
        {typeof state.ok !== "undefined" && state.message}
      </span>
      <SubmitButton />
    </form>
  );
}
