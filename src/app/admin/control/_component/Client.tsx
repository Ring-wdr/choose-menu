'use client';

import { useId, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { crawlAndSaveMenuByCategory } from '@/database/coffeebean/post';

import { crawlCategoriesFromExternal } from '../action';

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit">
      {status.pending ? '크롤링 중입니다.' : '크롤링'}
    </Button>
  );
}

type ControlClientProps = {
  crawlAndSaveMenuByCategory: typeof crawlAndSaveMenuByCategory;
};

export default function Client({
  crawlAndSaveMenuByCategory,
}: ControlClientProps) {
  const [sendState, formAction] = useFormState(crawlCategoriesFromExternal, '');
  const [resultString, setResultString] = useState('');
  const masterKey = useId();
  return (
    <div className="w-full flex flex-col items-center">
      <form action={formAction} className="flex flex-col mb-3">
        <label htmlFor={masterKey}>(크롤링) 메뉴 업데이트</label>
        <SubmitButton />
      </form>
      <p>실행 결과</p>
      {resultString && resultString}
      <ul>
        {typeof sendState === 'string' ? (
          <li>{sendState || '크롤링 대기 중'}</li>
        ) : null}
        {Array.isArray(sendState)
          ? sendState.map(({ title, category }, idx) => (
              <li key={category} className="flex justify-between m-1">
                {title}: {category}
                <Button
                  onClick={async () => {
                    const { deleteResponse, insertResponse } =
                      await crawlAndSaveMenuByCategory(category);
                    const [deleteResult, insertResult] = await Promise.all([
                      deleteResponse ?? Promise.resolve(null),
                      insertResponse ?? Promise.resolve(null),
                    ]);
                    setResultString(
                      `카테고리 ${title}에 ${deleteResult?.upsertedCount ?? 0}개 항목이 품절/삭제되었습니다. \n${insertResult?.insertedCount ?? 0}개 항목이 추가되었습니다.`,
                    );
                  }}
                >
                  메뉴 크롤링
                </Button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
