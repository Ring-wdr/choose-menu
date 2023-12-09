"use server";

import { redirect } from "next/navigation";
import { getUserName, setUserName } from "../../util/server";
import { postContentsOfSelectedMenu } from "@/database/coffeebean/post";

export async function postSelectedMenu(data: FormData) {
  const userName = getUserName()?.value!;
  const { menuName, size, temperature, description } = Object.fromEntries(
    data
  ) as Record<string, string>;
  try {
    await postContentsOfSelectedMenu({
      userName,
      menuName,
      size,
      temperature,
      description,
    });
  } catch (e) {
    console.log(e);
  } finally {
    redirect("/result");
  }
}

export async function getUserNameFromSession(_: string, data: FormData) {
  const userName = data.get("userName") as string;
  if (userName) {
    setUserName(userName);
  }
  const currentUserName = getUserName();
  if (!currentUserName) {
    redirect("/");
  }
  return currentUserName.value;
}
