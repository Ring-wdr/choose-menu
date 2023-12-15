"use server";

import { redirect } from "next/navigation";
import { getUserName, setUserName } from "../../util/server";
import { postContentsOfSelectedMenu } from "@/database/coffeebean/post";
import { getOrderBlock } from "@/database/coffeebean/get";

export async function postSelectedMenu(data: FormData) {
  const isOrderBlock = await getOrderBlock();
  if (isOrderBlock && isOrderBlock.status === true) {
    redirect("/orderblock");
  }
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
