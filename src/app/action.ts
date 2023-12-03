"use server";

import { redirect } from "next/navigation";
import { setUserName } from "./util/server";

export async function action(data: FormData) {
  const { userName } = Object.fromEntries(data);
  setUserName(userName as string);
  redirect("/menu");
}
