import React, { createContext, type ReactNode, useState } from "react";
import type { KeyResult } from "../types/OKR_Types.ts";

type KeyResultContextType = {
  keyResultList: KeyResult[];
  setKeyResultList: React.Dispatch<React.SetStateAction<KeyResult[]>>;
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
  const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);
  return (
    <KeyResultContext.Provider value={{ keyResultList, setKeyResultList }}>
      {children}
    </KeyResultContext.Provider>
  );
};
export default KeyResultProvider;
