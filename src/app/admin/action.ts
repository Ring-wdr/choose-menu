"use server";

import { crawlAndSaveMenu } from "@/database/coffeebean/post";

export const crawlDataFromExternal = async (_: string[], data: FormData) => {
  const { masterKey } = Object.fromEntries(data);
  if (masterKey !== process.env.ADMIN_PASSWORD)
    return ["크롤링 권한이 없습니다."];

  const res = await crawlAndSaveMenu();
  return Object.entries(res.insertedIds).map(([_, value]) => value.toString());
};
