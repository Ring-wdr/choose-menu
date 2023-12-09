"use server";

import {
  crawlAndSaveCategory,
  crawlAndSaveMenu,
} from "@/database/coffeebean/post";

type CategoryCrawlType =
  | Awaited<ReturnType<typeof crawlAndSaveCategory>>["categoryList"]
  | string;

export const crawlCategoriesFromExternal = async (
  _: CategoryCrawlType,
  data: FormData
): Promise<CategoryCrawlType> => {
  const { masterKey } = Object.fromEntries(data);
  if (masterKey !== process.env.ADMIN_PASSWORD)
    return "크롤링 권한이 없습니다.";
  const res = await crawlAndSaveCategory();
  return res.categoryList;
};

export const crawlMenuFromExternal = async () => {
  const res = await crawlAndSaveMenu();
  return res.menuList;
};
