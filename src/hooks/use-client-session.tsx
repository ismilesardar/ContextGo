'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@/lib/auth/auth';
import { authClient } from '@/lib/auth/auth-client';

type SessionContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const res = await authClient.getSession();
      setUser(res.data?.user ?? null);
      setSession(res.data?.session ?? null);
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession(); // runs only once when provider mounts
  }, []);

  return (
    <SessionContext.Provider
      value={{ user, session, isLoading, refreshSession: fetchSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useUserSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useUserSession must be used inside SessionProvider');
  }
  return context;
}
