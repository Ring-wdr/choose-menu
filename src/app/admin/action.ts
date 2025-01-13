'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as z from 'zod';

import { encryptAdminCode } from '@/util/server/admin';

const formSchema = z.object({
  admin: z
    .string()
    .min(6, {
      message: 'code must be at least 2 characters.',
    })
    .max(16),
});

type FormActionState = {
  message: string;
  ok?: boolean;
};

export default async function action(
  _: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  (await cookies()).delete('admin');
  try {
    const { admin } = formSchema.parse(Object.fromEntries(data));
    if (admin !== process.env.ADMIN_PASSWORD) {
      throw new Error('admin incorrect');
    }
    (await cookies()).set('admin', await encryptAdminCode(admin));
  } catch (e) {
    if (e instanceof z.ZodError === true) {
      return { message: e.issues[0].message, ok: false };
    }
    if (e instanceof Error) return { message: e.message, ok: false };
    return { message: 'failed', ok: false };
  }
  redirect('/admin/control');
}
