import React, { createContext, type ReactNode, useState } from "react";
import type { keyValues } from "../types/OKR_Types.ts";

type KeyResultContextType = {
  keyResultList: keyValues[];
  setKeyResultList: React.Dispatch<React.SetStateAction<keyValues[]>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const KeyResultContext = createContext<KeyResultContextType>({
  keyResultList: [],
  setKeyResultList: () => {},
});

type KeyResultProviderProps = {
  children: ReactNode;
};

const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
  const [keyResultList, setKeyResultList] = useState<keyValues[]>([]);
  return (
    <KeyResultContext.Provider value={{ keyResultList, setKeyResultList }}>
      {children}
    </KeyResultContext.Provider>
  );
};
export default KeyResultProvider;
