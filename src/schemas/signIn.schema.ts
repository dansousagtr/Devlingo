import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .nonempty('Digite um email válido')
    .email('Digite um email válido'),
  password: z
    .string()
    .nonempty('A senha deve ter pelo menos 6 caracteres')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
