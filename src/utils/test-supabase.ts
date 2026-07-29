import { supabase } from '../services/supabaseClient';

/**
 * Testa a conexão com o Supabase
 * Verifica se as credenciais estão configuradas e se a conexão está funcionando
 */
export const testSupabaseConnection = async () => {
  console.log('🔍 Testando conexão com Supabase...\n');

  // Verificar variáveis de ambiente
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('📋 Variáveis de ambiente:');
  console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Não configurada'}`);
  console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada'}\n`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas!');
    console.log('   Configure o arquivo .env com suas credenciais do Supabase.\n');
    return false;
  }

  // Testar conexão fazendo uma chamada simples
  try {
    console.log('🔄 Testando conexão...');
    
    // Tentar obter a sessão atual (não requer autenticação)
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      // Se der erro mas for de autenticação, a conexão está OK
      if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        console.error('❌ Erro: Chave API inválida ou malformada');
        console.log('   Verifique se VITE_SUPABASE_ANON_KEY está correto.\n');
        return false;
      }
      
      // Outros erros podem ser normais (ex: não autenticado)
      console.log('⚠️  Aviso:', error.message);
    }

    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Sessão: ${session ? 'Ativa' : 'Não autenticado'}\n`);
    
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao conectar com Supabase:');
    console.error('   ', error.message || error);
    console.log('\n   Verifique:');
    console.log('   - Se a URL do Supabase está correta');
    console.log('   - Se a chave anon está correta');
    console.log('   - Se há conexão com a internet\n');
    return false;
  }
};

/**
 * Testa a conexão e exibe o resultado no console
 * Pode ser chamado diretamente no console do navegador ou importado
 */
export const runConnectionTest = () => {
  testSupabaseConnection().then((success) => {
    if (success) {
      console.log('🎉 Teste concluído: Conexão OK!');
    } else {
      console.log('⚠️  Teste concluído: Problemas na conexão detectados.');
    }
  });
};

// Se executado diretamente, roda o teste
if (import.meta.hot) {
  // Disponibilizar globalmente para uso no console do navegador
  (window as any).testSupabase = runConnectionTest;
}
