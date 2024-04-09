'use server';

import { revalidatePath } from 'next/cache';

import { Absence, OrderBlock } from '@/type';

import clientPromise, { idToString } from '..';

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

export async function toggleUserState(
  userName: string,
  key: keyof Omit<Absence, 'userName'> = 'absence',
  revalidate?: boolean,
) {
  const db = (await clientPromise).db(COFFEEBEAN.DB_NAME);
  const absence = db.collection<Absence>(COFFEEBEAN.COLLECTION.ABSENCE);
  const response = await absence.findOneAndUpdate(
    { userName },
    [{ $set: { [key]: { $not: `$${key}` } } }],
    { upsert: true },
  );
  if (revalidate) revalidatePath('/admin/user');
  return response ? idToString(response) : null;
}
