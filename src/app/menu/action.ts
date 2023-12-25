"use server";

import { redirect } from "next/navigation";
import { getUserName, setUserName } from "@/util/server";
import { postContentsOfSelectedMenu } from "@/database/coffeebean/post";
import {
  getOrderBlock,
  getRecentMenuByUserName,
} from "@/database/coffeebean/get";
import { OrderItem } from "@/type";
import { ServerActionState } from "@/hooks/useServerAction";

export async function postSelectedMenu(data: FormData) {
  const isOrderBlock = await getOrderBlock();
  if (isOrderBlock && isOrderBlock.status === true) {
    redirect("/orderblock");
  }
  const userName = getUserName()?.value!;
  const { menuName, size, temperature, decaf } = Object.fromEntries(
    data
  ) as Record<string, string>;
  try {
    await postContentsOfSelectedMenu({
      userName,
      menuName,
      size,
      temperature,
      decaf: decaf as unknown as any,
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

export async function getSelectedMenuByCookies(
  _: ServerActionState<OrderItem>
): Promise<ServerActionState<OrderItem>> {
  const userName = getUserName();
  if (!userName || !userName.value) redirect("/");
  try {
    const selectedMenu = await getRecentMenuByUserName(userName.value);
    if (!selectedMenu)
      return { status: "success", message: "선택한 메뉴가 없습니다." };
    return {
      status: "success",
      message: "성공적으로 불러왔습니다.",
      data: selectedMenu,
    };
  } catch {
    return { status: "error", message: "메뉴를 불러올 수 없습니다." };
  }
}
