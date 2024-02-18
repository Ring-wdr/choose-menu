'use server';

import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';

import { getAbsenceList } from '@/database/coffeebean/get';
import {
  aggregateContentsOfCurrentOrders,
  deleteMenudata,
  mutateMenudata,
} from '@/database/coffeebean/post';
import { ServerActionState } from '@/hooks/useServerAction';
import { Absence, coffeeSize } from '@/type';

const menuSchema = z
  .object({
    _id: z.string(),
    category: z.string(),
    'name.kor': z.string(),
    'name.eng': z.string(),
    only: z.enum(['ice', 'hot']).or(z.literal('').transform(() => undefined)),
    soldOut: z.literal('on').nullable(),
    decaf: z.literal('on').nullable(),
    size: z.enum(coffeeSize).array(),
  })
  .partial({
    only: true,
    soldOut: true,
    decaf: true,
    size: true,
  });

export const modifyAction = async (_id: string, data: FormData) => {
  try {
    const size = data.getAll('size');
    const only = data.getAll('only');
    const preOnly = only.length === 1 ? only[0] : undefined;
    const parsed = menuSchema.parse({
      ...Object.fromEntries(data),
      _id,
      size,
      only: preOnly,
    });
    await mutateMenudata({
      _id: parsed._id,
      category: parsed.category,
      name: {
        kor: parsed['name.kor'],
        eng: parsed['name.eng'],
      },
      soldOut: Boolean(parsed.soldOut),
      only: parsed.only,
      decaf: Boolean(parsed.decaf),
      size: parsed.size,
    });
    revalidatePath('/admin/menu/[slug]', 'page');
    revalidatePath('/menu', 'page');
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.stack);
    }
    e instanceof Error && console.error(e.message);
  }
};

export const deleteAction = async (_id: string) => {
  try {
    await deleteMenudata({ _id });
    revalidatePath('/admin/menu/[slug]', 'page');
    revalidatePath('/menu', 'page');
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.stack);
    }
    e instanceof Error && console.error(e.message);
  }
};

export async function getAbsenceListAction(
  _: ServerActionState<Absence[]>,
): Promise<ServerActionState<Absence[]>> {
  try {
    const absenceList = await getAbsenceList();
    if (!absenceList || absenceList.length === 0)
      return { status: 'success', message: '결석 인원이 없습니다.' };
    return {
      status: 'success',
      message: '성공적으로 불러왔습니다.',
      data: absenceList,
    };
  } catch {
    return { status: 'error', message: '메뉴를 불러올 수 없습니다.' };
  }
}

export async function calculation(data: any) {
  await aggregateContentsOfCurrentOrders(data);
}
