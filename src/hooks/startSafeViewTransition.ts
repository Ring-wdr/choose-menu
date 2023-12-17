export const startSafeViewTransition = (
  callback: () => void,
  condition: boolean = true
) => {
  if (condition && !!document.startViewTransition) {
    return document.startViewTransition(callback);
  } else {
    callback();
  }
};
