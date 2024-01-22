type ViewTransitionReturnType = Record<
  'updateCallbackDone' | 'ready' | 'finished',
  Promise<void>
>;

interface Document {
  startViewTransition(callback: () => void): ViewTransitionReturnType;
}
