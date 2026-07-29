import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z
      .string()
      .nonempty('Informe um nome válido')
      .min(3, 'Informe um nome válido'),
    email: z
      .string()
      .nonempty('Digite um email válido')
      .email('Digite um email válido'),
    password: z
      .string()
      .nonempty('A senha deve ter pelo menos 6 caracteres')
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .nonempty('As senhas não coincidem')
      .min(6, 'As senhas não coincidem'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas não coincidem',
      });
    }
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
