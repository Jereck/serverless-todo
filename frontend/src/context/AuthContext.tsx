import React, { createContext, useContext, useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'

type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    Auth.currentSession()
      .then(session => {
        const token = session.getAccessToken().getJwtToken();
        setToken(token);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setToken('');
      })
  }, [])

  const login = async (email: string, password: string) => {
    await Auth.signIn(email, password);
    const session = await Auth.currentSession();
    const token = session.getAccessToken().getJwtToken();
    setToken(token);
    setIsAuthenticated(true);
  }

  const logout = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    setToken('');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}