"use server";

import client from "@/database";
import { redirect } from "next/navigation";

const dbname = "coffeebean";
const orderCollection = "order";

export async function postSelectedMenu(data: FormData) {
  const form = Object.fromEntries(data);
  try {
    await client.connect();
    const db = client.db(dbname);
    const menuCollection = db.collection(orderCollection);
    await menuCollection.insertOne(form);
  } finally {
    client.close();
    redirect("/result");
  }
}
