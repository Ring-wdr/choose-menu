import { cookies } from 'next/headers';

const USERNAME_COOKIE_AGE = 60 * 60 * 24 * 365;

export async function setUserName(userName: string) {
  (await cookies()).set({
    name: 'userName',
    value: userName,
    httpOnly: true,
    secure: true,
    maxAge: USERNAME_COOKIE_AGE,
    path: '/',
  });
}
export async function getUserName() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName');
  return userName;
}
