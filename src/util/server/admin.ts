'use server';

import { createHash } from 'crypto';

export const encryptAdminCode = (code: string) =>
  createHash('sha512').update(code).digest('base64');
