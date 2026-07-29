import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { signInSchema, SignInFormValues } from './schemas/signIn.schema';
import { useAuth } from './components/auth/authContexts';

function ButtonSpinner() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white border-t-transparent text-white animate-spin" aria-hidden="true" />
  );
}

export const SignInPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setErrorMessage(null);

    const result = await signIn(values.email, values.password);
    if (!result.success) {
      setErrorMessage(result.errorMessage ?? 'Erro ao fazer login');
      return;
    }

    navigate({ to: '/' });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.18),_transparent_28%),linear-gradient(180deg,#7c3aed_0%,#5b21b6_55%,#2d0f65_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[560px] items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/60 bg-white/95 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-12">
          <section className="space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Bem-vindo de volta!
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Entre na sua conta para continuar
            </p>
          </section>

          <form
            className="mt-10 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting}
                className={
                  `w-full rounded-[1.25rem] border px-4 py-3 text-sm text-slate-900 transition duration-200 ease-out placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-100 ` +
                  (errors.email
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 bg-white hover:border-slate-300')
                }
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : undefined}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isSubmitting}
                className={
                  `w-full rounded-[1.25rem] border px-4 py-3 text-sm text-slate-900 transition duration-200 ease-out placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-100 ` +
                  (errors.password
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 bg-white hover:border-slate-300')
                }
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[1.25rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-5 py-4 text-base font-semibold text-white shadow-[0_15px_35px_rgba(124,58,237,0.26)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <ButtonSpinner />}
              Entrar
            </button>

            {errorMessage && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <span>Não tem uma conta? </span>
            <Link
              to="/signup"
              className="font-semibold text-violet-600 transition duration-200 hover:underline"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
