'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';

export type ServerActionState<T = any> =
  | {
      status: 'pending';
      data?: T;
    }
  | {
      status: 'success';
      message?: string;
      data?: T;
    }
  | {
      status: 'error';
      message: string;
    };

type LoadingTrueState<T> = {
  state: Extract<ServerActionState<T>, { status: 'pending' }>;
  loading: true;
  error: false;
};
type LoadingFalseSuccessState<T> = {
  state: Extract<ServerActionState<T>, { status: 'success' }>;
  loading: false;
  error: false;
};
type LoadingFalseErrorState<T> = {
  state: Extract<ServerActionState<T>, { status: 'error' }>;
  loading: false;
  error: true;
};

export type ServerActionReturnType<T = any> = { refetch: () => void } & (
  | LoadingTrueState<T>
  | LoadingFalseSuccessState<T>
  | LoadingFalseErrorState<T>
);

export default function useServerAction<T>(
  callback: (prev: ServerActionState<T>) => Promise<ServerActionState<T>>,
  initData?: T,
): ServerActionReturnType<T> {
  const [state, refetch] = useFormState<ServerActionState<T>>(callback, {
    status: initData ? 'success' : 'pending',
    data: initData,
  });

  useEffect(() => {
    switch (state.status) {
      case 'pending':
        refetch();
        break;
    }
  }, [state, refetch]);

  if (state.status === 'pending')
    return { state, loading: true, error: false, refetch };
  if (state.status === 'success')
    return { state, loading: false, error: false, refetch };
  return { state, loading: false, error: true, refetch };
}
