"use server";

import client from "@/database";
import { COFFEEBEAN } from "@/database/coffeebean";
import { redirect } from "next/navigation";
import { getUserName, setUserName } from "../util/server";
import { revalidatePath } from "next/cache";

export async function postSelectedMenu(data: FormData) {
  const userName = getUserName()?.value;
  const { menuName, size } = Object.fromEntries(data);
  try {
    const db = (await client).db(COFFEEBEAN.DB_NAME);
    const orderCollection = db.collection(COFFEEBEAN.COLLECTION.ORDER);
    const res = await orderCollection.updateOne(
      { userName },
      { $set: { menuName, size } },
      { upsert: true }
    );
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
  revalidatePath("/menu");
}
