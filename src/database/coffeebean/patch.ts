import { COFFEEBEAN } from ".";
import clientPromise from "..";
import { OrderBlock } from "@/type";

export async function toggleOrderBlock() {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderBlock = db.collection<OrderBlock>(
    COFFEEBEAN.COLLECTION.ORDER_BLOCK
  );
  const response = orderBlock.findOneAndUpdate(
    {},
    [{ $set: { status: { $eq: [false, "$status"] } } }],
    { upsert: true }
  );
  return response;
}
