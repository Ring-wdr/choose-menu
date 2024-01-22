import { Absence, OrderBlock } from '@/type';

import clientPromise from '..';

import { COFFEEBEAN } from '.';

export async function toggleOrderBlock() {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const orderBlock = db.collection<OrderBlock>(
    COFFEEBEAN.COLLECTION.ORDER_BLOCK,
  );
  const response = orderBlock.findOneAndUpdate(
    {},
    [{ $set: { status: { $eq: [false, '$status'] } } }],
    { upsert: true },
  );
  return response;
}

export async function toggleUserAbsence(userName: string) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const absence = db.collection<Absence>(COFFEEBEAN.COLLECTION.ABSENCE);
  const response = await absence.findOneAndUpdate(
    { userName },
    [{ $set: { absence: { $not: '$absence' } } }],
    { upsert: true },
  );
  return response;
}
