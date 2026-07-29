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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
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
        setLoading(false);
        return;
      }

      setSession(data.session);
      setUser(mapSupabaseUser(data.session?.user ?? null));
      setLoading(false);
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
    });

    return () => {
      isMounted = false;
      (subscription as any)?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
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

    if (data.user) {
      return { success: true };
    }

    return { success: false, errorMessage: 'Erro ao fazer login' };
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
    }),
    [user, session, loading],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

function mapSupabaseUser(user: Session['user'] | null): AppUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? undefined,
    name: user.user_metadata?.name ?? undefined,
    avatar_url: user.user_metadata?.avatar_url ?? undefined,
  };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
