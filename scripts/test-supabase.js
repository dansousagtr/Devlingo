#!/usr/bin/env node

/**
 * Script para testar a conexão com o Supabase
 * Execute com: npm run test:supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar variáveis de ambiente do arquivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.log('   Configure o arquivo .env com suas credenciais do Supabase.\n');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão
const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testando conexão com Supabase...\n');

    // Testar se consegue acessar uma tabela (ajuste o nome da tabela conforme necessário)
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao conectar:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Conexão com Supabase funcionando!');
    console.log('📊 Dados retornados:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return { success: false, error: String(error) };
  }
};

// Executar teste
testSupabaseConnection()
  .then((result) => {
    if (result.success) {
      console.log('\n🎉 Teste concluído: Conexão OK!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Teste concluído: Falha na conexão.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Erro inesperado:', error.message);
    process.exit(1);
  });
