"use server";

import client from "@/database";
import { COFFEEBEAN } from "@/database/coffeebean";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function postSelectedMenu(data: FormData) {
  const userName = cookies().get("userName")?.value;
  const { menuName } = Object.fromEntries(data);
  try {
    const db = (await client).db(COFFEEBEAN.DB_NAME);
    const orderCollection = db.collection(COFFEEBEAN.COLLECTION.ORDER);
    const res = await orderCollection.updateOne(
      { userName },
      { $set: { menuName } },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  } finally {
    redirect("/result");
  }
}
