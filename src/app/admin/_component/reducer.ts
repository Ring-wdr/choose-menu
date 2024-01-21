export const ctlButtons = ["추가", "수정", "삭제"] as const;

export type ButtonUnion = (typeof ctlButtons)[number];

type AdminDialogState = {
  [K in ButtonUnion]: boolean;
};
type AdminDialogAction = {
  type: ButtonUnion;
  payload?: boolean;
};

export const initValue = ctlButtons.reduce(
  (acc, btn) => ({ ...acc, [btn]: false }),
  {}
) as AdminDialogState;

export const reducer = (
  state: AdminDialogState,
  action: AdminDialogAction
) => ({
  ...state,
  [action.type]: action.payload ?? !state[action.type],
});
