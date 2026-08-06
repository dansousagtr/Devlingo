import { createContext, createElement, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../services/supabaseClient';
import type { User as AppUser } from '../../types';
import type { CreateUserProfileData } from '../../types/userProfile';

type AuthContextType = {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{success: boolean; errorMessage?: string}>;
  signUp: (data: CreateUserProfileData) => Promise<{success: boolean; errorMessage?: string}>;
  signOut: () => Promise<{success: boolean; errorMessage?: string}>;
  // refresh the currently loaded profile from the database (useful after XP updates)
  refreshProfile: () => Promise<void>;
  // update local user.total_xp immediately (no DB change) — useful as a UI fallback
  setUserTotalXp: (xp: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('name, email, avatar_url, total_xp')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.warn('Falha ao carregar perfil do usuário:', profileError);
        return null;
      }

      return profileData;
    } catch (err) {
      console.warn('Erro inesperado ao carregar perfil do usuário:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        // A sessão pode ficar inválida quando o refresh token expira, é revogado
        // ou pertence a outra configuração do Supabase. Nesse caso, remova somente
        // o estado local para que uma nova tentativa de login possa começar limpa.
        if (error) {
          await supabase.auth.signOut({ scope: 'local' });
          if (!isMounted) return;

          setSession(null);
          setUser(null);
          return;
        }

        const sessionUser = data.session?.user ?? null;
        setSession(data.session);

        if (sessionUser) {
          const profileData = await loadUserProfile(sessionUser.id);
          if (!isMounted) return;
          setUser(mapSupabaseUser(sessionUser, profileData));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn('Erro ao carregar sessão do Supabase:', err);
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const handleAuthStateChange = (_event: string, session: Session | null) => {
      if (!isMounted) return;
      setSession(session);

      const sessionUser = session?.user ?? null;
      if (!sessionUser) {
        setUser(null);
        return;
      }

      void (async () => {
        try {
          const profileData = await loadUserProfile(sessionUser.id);
          if (!isMounted) return;
          setUser(mapSupabaseUser(sessionUser, profileData));
        } catch (err) {
          console.warn('Erro ao atualizar perfil do usuário após mudança de autenticação:', err);
          if (isMounted) {
            setUser(mapSupabaseUser(sessionUser, null));
          }
        }
      })();
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      isMounted = false;
      (subscription as any)?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        let errorMessage = 'Erro ao fazer login';

        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Falha de conexão com Supabase. Verifique a URL, a chave em .env e sua conexão com a internet.';
        } else {
          errorMessage = error.message || 'Erro ao fazer login';
        }

        return { success: false, errorMessage };
      }

      if (data.session) {
        setSession(data.session);
      }

      if (data.user) {
        const profileData = await loadUserProfile(data.user.id);
        setUser(mapSupabaseUser(data.user, profileData));
        return { success: true };
      }

      return { success: false, errorMessage: 'Erro ao fazer login' };
    } catch (err) {
      console.error('Erro inesperado ao fazer login:', err);
      return { success: false, errorMessage: 'Erro inesperado ao fazer login. Tente novamente.' };
    }
  };

  const createUserProfile = async (data: CreateUserProfileData) => {
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', data.email)
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      return {
        error: new Error(
          'Falha ao verificar usuário existente. Por favor, tente novamente mais tarde.',
        ),
      };
    }

    if (existingUser) {
      return { error: new Error('Já existe um usuário cadastrado com este email.') };
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (signUpError) {
      let errorMessage = 'Erro ao criar usuário';

      if (signUpError.message.includes('Failed to fetch')) {
        errorMessage = 'Falha de conexão com Supabase. Verifique a URL, a chave em .env e sua conexão com a internet.';
      } else {
        errorMessage = signUpError.message || 'Erro ao criar usuário';
      }

      return { error: new Error(errorMessage) };
    }

    const userId = authData.user?.id;

    if (!userId) {
      return { error: new Error('Não foi possível obter o ID do usuário após o cadastro.') };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        name: data.name,
        email: data.email,
        total_xp: 0,
      })
      .single();

    if (profileError) {
      return { error: new Error('Erro ao criar perfil do usuário. Por favor, tente novamente.') };
    }

    return { userId, profile: profileData };
  };

  const signUp = async (data: CreateUserProfileData) => {
    const result = await createUserProfile(data);

    if (result.error) {
      return { success: false, errorMessage: result.error.message };
    }

    return { success: true };
  };

  const refreshProfile = async () => {
    try {
      const currentUser = session?.user ?? null;
      if (!currentUser) return;
      const profileData = await loadUserProfile(currentUser.id);
      setUser(mapSupabaseUser(currentUser, profileData));
      try {
        // debug log to help trace why total_xp might be missing in the header
        // only prints in browser console during development
        // eslint-disable-next-line no-console
        console.debug('[Auth] refreshProfile loaded profileData for', currentUser.id, profileData);
      } catch (e) {
        /* ignore */
      }
    } catch (err) {
      console.warn('Falha ao atualizar perfil pelo refreshProfile:', err);
    }
  };

  const setUserTotalXp = (xp: number) => {
    setUser((prev) => {
      const next = prev ? { ...prev, total_xp: xp } : prev
      try {
        // eslint-disable-next-line no-console
        console.debug('[Auth] setUserTotalXp', { before: prev?.total_xp, after: xp, next })
      } catch (e) {
        /* ignore */
      }
      return next
    })
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: Boolean(user && session),
      signIn,
      signUp,
      signOut: async () => {
        await supabase.auth.signOut();
        return { success: true };
      },
      refreshProfile,
      setUserTotalXp,
    }),
    [user, session, loading],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

function mapSupabaseUser(user: Session['user'] | null, profileData?: { name?: string | null; email?: string | null; avatar_url?: string | null; total_xp?: number | null } | null): AppUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: profileData?.email ?? user.email ?? undefined,
    name: profileData?.name ?? user.user_metadata?.name ?? undefined,
    avatar_url: profileData?.avatar_url ?? user.user_metadata?.avatar_url ?? undefined,
    total_xp: profileData ? Number(profileData.total_xp ?? 0) : undefined,
  };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
