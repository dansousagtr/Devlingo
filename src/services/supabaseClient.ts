import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const missingVars = [] as string[];
if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

if (missingVars.length > 0) {
  console.error(
    `❌ Supabase não está configurado. Variável(is) faltando(s): ${missingVars.join(', ')}\n` +
    'Por favor, configure as variáveis de ambiente no arquivo .env:\n' +
    '- VITE_SUPABASE_URL=sua_url_do_supabase\n' +
    '- VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase\n\n' +
    'Copie o arquivo env.example para .env e preencha com suas credenciais.\n\n' +
    'O app continuará rodando, mas as funcionalidades de autenticação não funcionarão.'
  );
}

// Criar cliente Supabase
// Se as variáveis não estiverem configuradas, usa valores placeholder
// Isso evita que o app quebre, mas as chamadas falharão
export const SUPABASE_CONFIG_VALID = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);
