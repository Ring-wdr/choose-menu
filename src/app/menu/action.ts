"use server";

import { redirect } from "next/navigation";
import { getUserName, setUserName } from "../../util/server";
import { postContentsOfSelectedMenu } from "@/database/coffeebean/post";

export async function postSelectedMenu(data: FormData) {
  const userName = getUserName()?.value!;
  const { menuName, size } = Object.fromEntries(data) as Record<string, string>;
  try {
    await postContentsOfSelectedMenu({
      userName,
      menuName,
      size,
    });
  } catch (e) {
    console.log(e);
  } finally {
    redirect("/result");
  }
}

export async function changeUserName(data: FormData) {
  const currentUserName = getUserName()?.value;
  const { userName } = Object.fromEntries(data);
  if (currentUserName === userName) return;
  setUserName(userName as string);
}
