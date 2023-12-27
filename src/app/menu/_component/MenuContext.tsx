"use client";
import { createContext, useContext, useEffect, useReducer } from "react";
import useServerAction from "@/hooks/useServerAction";
import { ReducerByState, OrderItem, ActionByState } from "@/type";
import { getSelectedMenuByCookies } from "../action";

type MenuContextState = {
  userName: string;
  menu?: OrderItem;
};

const initValue = {
  userName: "",
} satisfies MenuContextState;

const reducer = <T,>(state: T, action: ActionByState<T>) => ({
  ...state,
  [action.type]: action.payload,
});

type MenuContextProps = MenuContextState & {
  menuRefetch: () => void;
  menuState: Awaited<ReturnType<typeof getSelectedMenuByCookies>>;
};

const MenuContext = createContext<MenuContextProps>({
  ...initValue,
  menuRefetch() {},
  menuState: { status: "pending" },
});

export function MenuProvider({ children }: React.PropsWithChildren) {
  const [value, dispatch] = useReducer<ReducerByState<MenuContextState>>(
    reducer,
    initValue
  );
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
        menuState: state,
        menuRefetch: refetch,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);
