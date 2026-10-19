import { create } from 'zustand';

import { login, refreshSession } from './api';
import { clearSession, getSession, setSession, type Session } from '@/infrastructure/storage/session';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  session: Session | null;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<Session | null>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  session: null,
  hydrate: async () => {
    const session = await getSession();
    set({ session, status: session ? 'authenticated' : 'unauthenticated' });
  },
  signIn: async (email, password) => {
    const session = await login({ email, password });
    await setSession(session);
    set({ session, status: 'authenticated' });
  },
  refresh: async () => {
    const currentSession = get().session;
    if (!currentSession?.refreshToken) {
      await get().signOut();
      return null;
    }

    try {
      const session = await refreshSession(currentSession.refreshToken);
      await setSession(session);
      set({ session, status: 'authenticated' });
      return session;
    } catch {
      await get().signOut();
      return null;
    }
  },
  signOut: async () => {
    await clearSession();
    set({ session: null, status: 'unauthenticated' });
  },
}));
