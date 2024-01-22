'use server';

import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';

import { getAbsenceList } from '@/database/coffeebean/get';
import { deleteMenudata, mutateMenudata } from '@/database/coffeebean/post';
import { ServerActionState } from '@/hooks/useServerAction';
import { Absence } from '@/type';

const menuSchema = z
  .object({
    _id: z.string(),
    category: z.string(),
    'name.kor': z.string(),
    'name.eng': z.string(),
    only: z.enum(['ice', 'hot']).or(z.literal('').transform(() => undefined)),
    soldOut: z.literal('on').nullable(),
    decaf: z.literal('on').nullable(),
  })
  .partial({
    only: true,
    soldOut: true,
    decaf: true,
  });

export const modifyAction = async (data: FormData) => {
  try {
    const parsed = menuSchema.parse(Object.fromEntries(data));
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

export const deleteAction = async (data: FormData) => {
  try {
    const { _id } = menuSchema
      .pick({ _id: true })
      .parse(Object.fromEntries(data));
    await deleteMenudata({
      _id,
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
