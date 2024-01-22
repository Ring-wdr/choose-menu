'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import {
  getOrderBlock,
  getRecentMenuByUserName,
} from '@/database/coffeebean/get';
import { postContentsOfSelectedMenu } from '@/database/coffeebean/post';
import { ServerActionState } from '@/hooks/useServerAction';
import { OrderItem } from '@/type';
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
  const submitData = orderSchema.parse(Object.fromEntries(data));
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

export async function getSelectedMenuByCookies(
  _: ServerActionState<OrderItem>,
): Promise<ServerActionState<OrderItem>> {
  const userName = getUserName();
  if (!userName || !userName.value) redirect('/');
  try {
    const selectedMenu = await getRecentMenuByUserName(userName.value);
    if (!selectedMenu)
      return { status: 'success', message: '선택한 메뉴가 없습니다.' };
    return {
      status: 'success',
      message: '성공적으로 불러왔습니다.',
      data: selectedMenu,
    };
  } catch {
    return { status: 'error', message: '메뉴를 불러올 수 없습니다.' };
  }
}
