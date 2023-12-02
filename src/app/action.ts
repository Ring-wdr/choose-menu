"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function setUserName(userName: string) {
  cookies().set({
    name: "userName",
    value: userName,
    httpOnly: true,
    path: "/",
  });
}

export async function action(data: FormData) {
  const { userName } = Object.fromEntries(data);
  setUserName(userName as string);
  redirect("/menu");
}
