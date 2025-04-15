"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

interface AuthProviderType {
  authState: boolean;
  setAuthState: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthProviderType>({
  authState: false,
  setAuthState: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState(false);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}
