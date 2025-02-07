import React, { ReactNode, createContext, useContext } from "react";

import { RootStore } from "@/store/root-store";

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const store = new RootStore();

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }

  return store;
};
