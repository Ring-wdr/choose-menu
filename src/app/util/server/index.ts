import { cookies } from "next/headers";

const USERNAME_COOKIE_AGE = 60 * 60 * 24 * 365;

export function setUserName(userName: string) {
  cookies().set({
    name: "userName",
    value: userName,
    httpOnly: true,
    secure: true,
    maxAge: USERNAME_COOKIE_AGE,
    path: "/",
  });
}
export function getUserName(callback?: () => void) {
  const userName = cookies().get("userName");
  if (!userName && callback) {
    callback();
  }
  return userName;
}
