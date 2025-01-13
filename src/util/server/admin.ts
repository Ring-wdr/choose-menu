'use server';

import { createHash } from 'crypto';

export const encryptAdminCode = async (code: string) =>
  createHash('sha512').update(code).digest('base64');
