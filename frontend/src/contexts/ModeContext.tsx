import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Mode = "friends" | "dating";

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
  setMode: (m: Mode) => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>("friends");

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "friends" ? "dating" : "friends"));

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
};
