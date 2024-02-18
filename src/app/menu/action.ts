'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { getOrderBlock } from '@/database/coffeebean/get';
import { postContentsOfSelectedMenu } from '@/database/coffeebean/post';
import { getUserName, setUserName } from '@/util/server';

const orderSchema = z
  .object({
    menuName: z.string(),
    size: z.string(),
    temperature: z.enum(['HOT', 'ICE']),
    shot: z
      .literal('')
      .transform(() => undefined)
      .or(z.coerce.number().min(0).max(4)),
    sub: z.literal('on').nullable(),
    decaf: z.literal('on').nullable(),
  })
  .partial({
    shot: true,
    sub: true,
    decaf: true,
  });

export async function postSelectedMenu(data: FormData) {
  const isOrderBlock = await getOrderBlock();
  if (isOrderBlock && isOrderBlock.status === true) {
    redirect('/orderblock');
  }
  const userName = getUserName()?.value!;
  const submitObj = Object.fromEntries(data);
  const submitData = orderSchema.parse({
    ...submitObj,
    sub: submitObj.sub === 'on' ? 'on' : undefined,
  });
  try {
    await postContentsOfSelectedMenu({ userName, ...submitData });
  } catch (e) {
    console.log(e);
  } finally {
    redirect('/result');
  }
}

export async function getUserNameFromSession(_: string, data: FormData) {
  const userName = data.get('userName') as string;
  if (userName) {
    setUserName(userName);
  }
  const currentUserName = getUserName();
  if (!currentUserName) {
    redirect('/');
  }
  return currentUserName.value;
}
