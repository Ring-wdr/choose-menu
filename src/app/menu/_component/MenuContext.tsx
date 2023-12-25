"use client";
import { createContext, useContext, useEffect, useReducer } from "react";
import useServerAction from "@/hooks/useServerAction";
import { MenuProps } from "@/type";
import { getSelectedMenuByCookies } from "../action";

type MenuContextState = {
  userName: string;
  menu?: MenuProps;
};
type MenuReducerAction =
  | { type: "userName"; payload: string }
  | { type: "menu"; payload: MenuProps };
const initValue = {
  userName: "",
} satisfies MenuContextState;

const reducer = (state: MenuContextState, action: MenuReducerAction) => {
  return { ...state, [action.type]: action.payload };
};

type MenuContextProps = MenuContextState & {
  dispatch: (action: MenuReducerAction) => void;
  menuRefetch: () => void;
  menuState: Awaited<ReturnType<typeof getSelectedMenuByCookies>>;
};

const MenuContext = createContext<MenuContextProps>({
  ...initValue,
  dispatch() {},
  menuRefetch() {},
  menuState: { status: "pending" },
});

export function MenuProvider({ children }: React.PropsWithChildren) {
  const [value, dispatch] = useReducer(reducer, initValue);
  const { state, refetch } = useServerAction(getSelectedMenuByCookies);
  useEffect(() => {
    if (state.status === "success" && state.data) {
      const { data } = state;
      dispatch({ type: "menu", payload: data });
    }
  }, [state]);

  return (
    <MenuContext.Provider
      value={{
        ...value,
        dispatch,
        menuState: state,
        menuRefetch: refetch,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);