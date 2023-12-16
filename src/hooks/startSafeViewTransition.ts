export const startSafeViewTransition = (
  callback: () => void,
  condition: boolean = true
) => {
  if (condition && !!document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
};
