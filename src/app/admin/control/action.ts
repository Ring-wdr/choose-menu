'use server';

import { toggleOrderBlock } from '@/database/coffeebean/patch';
import { crawlAndSaveCategory } from '@/database/coffeebean/post';
import { OrderBlock } from '@/type';

type CategoryCrawlType =
  | Awaited<ReturnType<typeof crawlAndSaveCategory>>['categoryList']
  | string;

export const crawlCategoriesFromExternal = async (
  _: CategoryCrawlType,
  data: FormData,
): Promise<CategoryCrawlType> => {
  const res = await crawlAndSaveCategory();
  return res.categoryList;
};

export const toggleOrderState = async (): Promise<
  {
    message: string;
  } & Partial<OrderBlock>
> => {
  const res = await toggleOrderBlock();
  if (!res) {
    return { status: false, message: '오류가 있습니다.' };
  }
  const message =
    res.status === false
      ? '메뉴 선택을 막았습니다.'
      : '메뉴 선택 금지를 해제했습니다.';

  return {
    status: true,
    message,
  };
};
