-- TABELA: units
CREATE TABLE IF NOT EXISTS public.units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, -- Título da unidade
  description TEXT, -- Descrição da unidade
  level TEXT NOT NULL, -- Nível da unidade (ex: 'beginner', 'intermediate', 'advanced')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL -- Data de criação
);

-- TABELA: lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, -- Título da lição
  description TEXT, -- Descrição da lição
  xp_reward INTEGER DEFAULT 0, -- XP ganho ao concluir a lição
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL, -- Referência à unidade
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL -- Data de criação
);

-- TABELA: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABELA: user_lessons
CREATE TABLE IF NOT EXISTS public.user_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Referência ao usuário
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL, -- Referência à lição
  is_completed BOOLEAN DEFAULT FALSE, -- Se a lição foi concluída
  xp_earned INTEGER DEFAULT 0, -- XP ganho
  completed_at TIMESTAMP WITH TIME ZONE, -- Quando a lição foi concluída
  UNIQUE(user_id, lesson_id) -- Garantir que cada lição por usuário seja única
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS DE SEGURANÇA PARA A TABELA user_profiles
-- ========================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- POLÍTICAS DE SEGURANÇA PARA A TABELA user_lessons
-- ========================================
DROP POLICY IF EXISTS "Users can view own lessons" ON public.user_lessons;
DROP POLICY IF EXISTS "Users can insert own lessons" ON public.user_lessons;
DROP POLICY IF EXISTS "Users can update own lessons" ON public.user_lessons;

CREATE POLICY "Users can view own lessons"
  ON public.user_lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lessons"
  ON public.user_lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lessons"
  ON public.user_lessons FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- POLÍTICAS DE SEGURANÇA PARA A TABELA lessons
-- ========================================
-- Usuários autenticados podem ver TODAS as lições
DROP POLICY IF EXISTS "Users can view all lessons" ON public.lessons;

CREATE POLICY "Users can view all lessons"
  ON public.lessons FOR SELECT
  USING (auth.role() = 'authenticated');

-- ========================================
-- POLÍTICAS DE SEGURANÇA PARA A TABELA units
-- ========================================
-- Usuários autenticados podem ver TODAS as unidades
DROP POLICY IF EXISTS "Users can view all units" ON public.units;

CREATE POLICY "Users can view all units"
  ON public.units FOR SELECT
  USING (auth.role() = 'authenticated');

-- ========================================
-- INSERIR DADOS DE EXEMPLO
-- ========================================

-- Inserir 5 Unidades de JavaScript Iniciante
INSERT INTO public.units (title, description, level) VALUES
('Fundamentos do JavaScript', 'Aprenda os conceitos básicos da linguagem JavaScript', 'beginner'),
('Variáveis e Tipos de Dados', 'Entenda como funcionam as variáveis e tipos de dados em JS', 'beginner'),
('Operadores e Expressões', 'Domine os operadores matemáticos, lógicos e de comparação', 'beginner'),
('Condicionais e Estruturas de Controle', 'Aprenda a usar if, else, switch e outras estruturas de controle', 'beginner'),
('Funções e Escopo', 'Crie e utilize funções em seus programas JavaScript', 'beginner');

-- Inserir 10 Lições (2 por unidade)
-- Unidade 1: Fundamentos do JavaScript
INSERT INTO public.lessons (title, description, xp_reward, unit_id) VALUES
('O que é JavaScript?', 'Introdução à linguagem, sua história e aplicações', 10, 
  (SELECT id FROM public.units WHERE title = 'Fundamentos do JavaScript' LIMIT 1)),
('Seu Primeiro Programa', 'Escreva seu primeiro "Hello World" em JavaScript', 15,
  (SELECT id FROM public.units WHERE title = 'Fundamentos do JavaScript' LIMIT 1));

-- Unidade 2: Variáveis e Tipos de Dados
INSERT INTO public.lessons (title, description, xp_reward, unit_id) VALUES
('Variáveis: let, const e var', 'Diferenças entre as formas de declarar variáveis', 15,
  (SELECT id FROM public.units WHERE title = 'Variáveis e Tipos de Dados' LIMIT 1)),
('Tipos Primitivos de Dados', 'String, number, boolean, undefined, null e symbol', 20,
  (SELECT id FROM public.units WHERE title = 'Variáveis e Tipos de Dados' LIMIT 1));

-- Unidade 3: Operadores e Expressões
INSERT INTO public.lessons (title, description, xp_reward, unit_id) VALUES
('Operadores Aritméticos', 'Soma, subtração, multiplicação, divisão e mais', 15,
  (SELECT id FROM public.units WHERE title = 'Operadores e Expressões' LIMIT 1)),
('Operadores Lógicos e de Comparação', 'AND, OR, NOT, ==, ===, <, >, e outros', 20,
  (SELECT id FROM public.units WHERE title = 'Operadores e Expressões' LIMIT 1));

-- Unidade 4: Condicionais e Estruturas de Controle
INSERT INTO public.lessons (title, description, xp_reward, unit_id) VALUES
('If, Else If e Else', 'Controle o fluxo do seu programa com condicionais', 20,
  (SELECT id FROM public.units WHERE title = 'Condicionais e Estruturas de Controle' LIMIT 1)),
('Switch Case', 'Use switch para escolher entre múltiplas opções', 20,
  (SELECT id FROM public.units WHERE title = 'Condicionais e Estruturas de Controle' LIMIT 1));

-- Unidade 5: Funções e Escopo
INSERT INTO public.lessons (title, description, xp_reward, unit_id) VALUES
('Declarando e Chamando Funções', 'Crie funções reutilizáveis em seus programas', 25,
  (SELECT id FROM public.units WHERE title = 'Funções e Escopo' LIMIT 1)),
('Escopo e Closure', 'Entenda como variáveis são acessadas em diferentes contextos', 25,
  (SELECT id FROM public.units WHERE title = 'Funções e Escopo' LIMIT 1));

-- Verificar dados inseridos
SELECT COUNT(*) as total_units FROM public.units;
SELECT COUNT(*) as total_lessons FROM public.lessons;
SELECT u.title, COUNT(l.id) as lesson_count FROM public.units u LEFT JOIN public.lessons l ON l.unit_id = u.id GROUP BY u.id, u.title;

-- ========================================
-- QUESTÕES DAS LIÇÕES (NOVAS TABELAS)
-- ========================================

-- TABELA: lesson_questions
CREATE TABLE IF NOT EXISTS public.lesson_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TABELA: lesson_question_options
CREATE TABLE IF NOT EXISTS public.lesson_question_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.lesson_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- HABILITAR RLS
ALTER TABLE public.lesson_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_question_options ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: usuários autenticados podem ver todas as questões/opções
DROP POLICY IF EXISTS "Users can view all lesson questions" ON public.lesson_questions;
DROP POLICY IF EXISTS "Users can view all question options" ON public.lesson_question_options;

CREATE POLICY "Users can view all lesson questions"
  ON public.lesson_questions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all question options"
  ON public.lesson_question_options FOR SELECT
  USING (auth.role() = 'authenticated');

-- ========================================
-- INSERIR QUESTÕES DE EXEMPLO (2 POR LIÇÃO)
-- ========================================

-- Questões da lição: O que é JavaScript?
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'O que é JavaScript?' LIMIT 1),
   'JavaScript é uma linguagem de:', 1),
  ((SELECT id FROM public.lessons WHERE title = 'O que é JavaScript?' LIMIT 1),
   'Onde o JavaScript pode ser executado?', 2);

-- Opções da questão 1
INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é uma linguagem de:' LIMIT 1), 'Marcação', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é uma linguagem de:' LIMIT 1), 'Programação', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é uma linguagem de:' LIMIT 1), 'Estilo', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é uma linguagem de:' LIMIT 1), 'Banco de dados', FALSE, 4);

-- Opções da questão 2
INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Onde o JavaScript pode ser executado?' LIMIT 1), 'Apenas no servidor', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Onde o JavaScript pode ser executado?' LIMIT 1), 'Apenas no navegador', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Onde o JavaScript pode ser executado?' LIMIT 1), 'No navegador e no servidor', TRUE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Onde o JavaScript pode ser executado?' LIMIT 1), 'Apenas no banco', FALSE, 4);

-- Questões da lição: Seu Primeiro Programa
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Seu Primeiro Programa' LIMIT 1),
   'Qual comando exibe algo no console?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Seu Primeiro Programa' LIMIT 1),
   'Qual é o resultado de 2 + 2 em JS?', 2);

-- Opções da questão 1
INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual comando exibe algo no console?' LIMIT 1), 'print()', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual comando exibe algo no console?' LIMIT 1), 'console.log()', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual comando exibe algo no console?' LIMIT 1), 'echo()', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual comando exibe algo no console?' LIMIT 1), 'alert()', FALSE, 4);

-- Opções da questão 2
INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 2 + 2 em JS?' LIMIT 1), '22', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 2 + 2 em JS?' LIMIT 1), '4', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 2 + 2 em JS?' LIMIT 1), 'undefined', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 2 + 2 em JS?' LIMIT 1), 'NaN', FALSE, 4);

-- ========================================
-- TERCEIRA QUESTÃO PARA CADA LIÇÃO
-- ========================================

-- Lição: O que é JavaScript?
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'O que é JavaScript?' LIMIT 1),
   'JavaScript é mais usado para:', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é mais usado para:' LIMIT 1), 'Criar páginas interativas', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é mais usado para:' LIMIT 1), 'Editar imagens', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é mais usado para:' LIMIT 1), 'Gerenciar banco diretamente', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'JavaScript é mais usado para:' LIMIT 1), 'Compilar sistemas', FALSE, 4);

-- Lição: Seu Primeiro Programa
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Seu Primeiro Programa' LIMIT 1),
   'Qual destas é uma forma válida de string?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destas é uma forma válida de string?' LIMIT 1), '"Olá"', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destas é uma forma válida de string?' LIMIT 1), '123', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destas é uma forma válida de string?' LIMIT 1), 'true', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destas é uma forma válida de string?' LIMIT 1), 'null', FALSE, 4);

-- Lição: Variáveis: let, const e var
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Variáveis: let, const e var' LIMIT 1),
   'Qual escopo o let possui?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual escopo o let possui?' LIMIT 1), 'Escopo de bloco', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual escopo o let possui?' LIMIT 1), 'Escopo global apenas', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual escopo o let possui?' LIMIT 1), 'Escopo de classe', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual escopo o let possui?' LIMIT 1), 'Sem escopo', FALSE, 4);

-- Lição: Tipos Primitivos de Dados
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Tipos Primitivos de Dados' LIMIT 1),
   'Qual destes NÃO é primitivo?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes NÃO é primitivo?' LIMIT 1), 'Object', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes NÃO é primitivo?' LIMIT 1), 'number', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes NÃO é primitivo?' LIMIT 1), 'string', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes NÃO é primitivo?' LIMIT 1), 'boolean', FALSE, 4);

-- Lição: Operadores Aritméticos
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Operadores Aritméticos' LIMIT 1),
   'Qual operador representa resto da divisão?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa resto da divisão?' LIMIT 1), '%', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa resto da divisão?' LIMIT 1), '/', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa resto da divisão?' LIMIT 1), '*', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa resto da divisão?' LIMIT 1), '-', FALSE, 4);

-- Lição: Operadores Lógicos e de Comparação
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Operadores Lógicos e de Comparação' LIMIT 1),
   'Qual operador representa OU lógico?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa OU lógico?' LIMIT 1), '||', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa OU lógico?' LIMIT 1), '&&', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa OU lógico?' LIMIT 1), '!', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa OU lógico?' LIMIT 1), '===', FALSE, 4);

-- Lição: If, Else If e Else
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'If, Else If e Else' LIMIT 1),
   'Qual símbolo abre um bloco em JS?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual símbolo abre um bloco em JS?' LIMIT 1), '{', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual símbolo abre um bloco em JS?' LIMIT 1), '(', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual símbolo abre um bloco em JS?' LIMIT 1), '[', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual símbolo abre um bloco em JS?' LIMIT 1), '<', FALSE, 4);

-- Lição: Switch Case
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Switch Case' LIMIT 1),
   'Qual palavra-chave inicia o switch?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave inicia o switch?' LIMIT 1), 'switch', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave inicia o switch?' LIMIT 1), 'case', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave inicia o switch?' LIMIT 1), 'default', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave inicia o switch?' LIMIT 1), 'if', FALSE, 4);

-- Lição: Declarando e Chamando Funções
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Declarando e Chamando Funções' LIMIT 1),
   'O que vai entre parênteses na função?', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que vai entre parênteses na função?' LIMIT 1), 'Parâmetros', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que vai entre parênteses na função?' LIMIT 1), 'Retorno', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que vai entre parênteses na função?' LIMIT 1), 'Escopo', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que vai entre parênteses na função?' LIMIT 1), 'Objeto', FALSE, 4);

-- Lição: Escopo e Closure
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Escopo e Closure' LIMIT 1),
   'Closure é útil para:', 3);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure é útil para:' LIMIT 1), 'Manter estado privado', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure é útil para:' LIMIT 1), 'Remover variáveis', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure é útil para:' LIMIT 1), 'Apagar funções', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure é útil para:' LIMIT 1), 'Criar classes automaticamente', FALSE, 4);

-- ========================================
-- QUESTÕES PARA AS DEMAIS LIÇÕES (2 POR LIÇÃO)
-- ========================================

-- Lição: Variáveis: let, const e var
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Variáveis: let, const e var' LIMIT 1),
   'Qual palavra-chave cria uma variável mutável?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Variáveis: let, const e var' LIMIT 1),
   'Qual palavra-chave cria uma constante?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma variável mutável?' LIMIT 1), 'const', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma variável mutável?' LIMIT 1), 'let', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma variável mutável?' LIMIT 1), 'var', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma variável mutável?' LIMIT 1), 'define', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma constante?' LIMIT 1), 'let', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma constante?' LIMIT 1), 'const', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma constante?' LIMIT 1), 'var', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave cria uma constante?' LIMIT 1), 'static', FALSE, 4);

-- Lição: Tipos Primitivos de Dados
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Tipos Primitivos de Dados' LIMIT 1),
   'Qual destes é um tipo primitivo em JavaScript?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Tipos Primitivos de Dados' LIMIT 1),
   'Qual o tipo de "42"?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes é um tipo primitivo em JavaScript?' LIMIT 1), 'Array', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes é um tipo primitivo em JavaScript?' LIMIT 1), 'String', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes é um tipo primitivo em JavaScript?' LIMIT 1), 'Date', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual destes é um tipo primitivo em JavaScript?' LIMIT 1), 'RegExp', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual o tipo de "42"?' LIMIT 1), 'string', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual o tipo de "42"?' LIMIT 1), 'number', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual o tipo de "42"?' LIMIT 1), 'boolean', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual o tipo de "42"?' LIMIT 1), 'object', FALSE, 4);

-- Lição: Operadores Aritméticos
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Operadores Aritméticos' LIMIT 1),
   'Qual operador representa multiplicação?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Operadores Aritméticos' LIMIT 1),
   'Qual é o resultado de 10 / 2?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa multiplicação?' LIMIT 1), '+', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa multiplicação?' LIMIT 1), '*', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa multiplicação?' LIMIT 1), '/', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador representa multiplicação?' LIMIT 1), '%', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 10 / 2?' LIMIT 1), '2', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 10 / 2?' LIMIT 1), '5', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 10 / 2?' LIMIT 1), '8', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual é o resultado de 10 / 2?' LIMIT 1), '10', FALSE, 4);

-- Lição: Operadores Lógicos e de Comparação
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Operadores Lógicos e de Comparação' LIMIT 1),
   'Qual operador significa E lógico?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Operadores Lógicos e de Comparação' LIMIT 1),
   'Qual operador verifica igualdade estrita?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador significa E lógico?' LIMIT 1), '||', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador significa E lógico?' LIMIT 1), '&&', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador significa E lógico?' LIMIT 1), '!', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador significa E lógico?' LIMIT 1), '??', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador verifica igualdade estrita?' LIMIT 1), '==', FALSE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador verifica igualdade estrita?' LIMIT 1), '===', TRUE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador verifica igualdade estrita?' LIMIT 1), '!=', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual operador verifica igualdade estrita?' LIMIT 1), '=', FALSE, 4);

-- Lição: If, Else If e Else
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'If, Else If e Else' LIMIT 1),
   'Qual estrutura executa um bloco se a condição for verdadeira?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'If, Else If e Else' LIMIT 1),
   'Qual palavra-chave define o caso alternativo?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual estrutura executa um bloco se a condição for verdadeira?' LIMIT 1), 'if', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual estrutura executa um bloco se a condição for verdadeira?' LIMIT 1), 'else', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual estrutura executa um bloco se a condição for verdadeira?' LIMIT 1), 'switch', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual estrutura executa um bloco se a condição for verdadeira?' LIMIT 1), 'case', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso alternativo?' LIMIT 1), 'else', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso alternativo?' LIMIT 1), 'if', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso alternativo?' LIMIT 1), 'case', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso alternativo?' LIMIT 1), 'default', FALSE, 4);

-- Lição: Switch Case
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Switch Case' LIMIT 1),
   'Qual palavra-chave encerra um case?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Switch Case' LIMIT 1),
   'Qual palavra-chave define o caso padrão?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave encerra um case?' LIMIT 1), 'break', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave encerra um case?' LIMIT 1), 'stop', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave encerra um case?' LIMIT 1), 'return', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave encerra um case?' LIMIT 1), 'exit', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso padrão?' LIMIT 1), 'default', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso padrão?' LIMIT 1), 'case', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso padrão?' LIMIT 1), 'else', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave define o caso padrão?' LIMIT 1), 'fallback', FALSE, 4);

-- Lição: Declarando e Chamando Funções
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Declarando e Chamando Funções' LIMIT 1),
   'Qual palavra-chave declara uma função?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Declarando e Chamando Funções' LIMIT 1),
   'Como chamamos uma função chamada soma?', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave declara uma função?' LIMIT 1), 'function', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave declara uma função?' LIMIT 1), 'func', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave declara uma função?' LIMIT 1), 'def', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Qual palavra-chave declara uma função?' LIMIT 1), 'fn', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Como chamamos uma função chamada soma?' LIMIT 1), 'soma()', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Como chamamos uma função chamada soma?' LIMIT 1), 'call soma()', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Como chamamos uma função chamada soma?' LIMIT 1), 'soma.call()', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Como chamamos uma função chamada soma?' LIMIT 1), 'execute soma()', FALSE, 4);

-- Lição: Escopo e Closure
INSERT INTO public.lesson_questions (lesson_id, question_text, position)
VALUES
  ((SELECT id FROM public.lessons WHERE title = 'Escopo e Closure' LIMIT 1),
   'O que é escopo em JavaScript?', 1),
  ((SELECT id FROM public.lessons WHERE title = 'Escopo e Closure' LIMIT 1),
   'Closure ocorre quando...', 2);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que é escopo em JavaScript?' LIMIT 1), 'Regra de acesso a variáveis', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que é escopo em JavaScript?' LIMIT 1), 'Tipo de função', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que é escopo em JavaScript?' LIMIT 1), 'Um operador', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'O que é escopo em JavaScript?' LIMIT 1), 'Uma biblioteca', FALSE, 4);

INSERT INTO public.lesson_question_options (question_id, option_text, is_correct, position)
VALUES
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure ocorre quando...' LIMIT 1), 'Uma função lembra variáveis do escopo externo', TRUE, 1),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure ocorre quando...' LIMIT 1), 'Uma variável muda de tipo', FALSE, 2),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure ocorre quando...' LIMIT 1), 'Uma função não retorna nada', FALSE, 3),
  ((SELECT id FROM public.lesson_questions WHERE question_text = 'Closure ocorre quando...' LIMIT 1), 'Uma função é chamada sem parâmetros', FALSE, 4);


-- ========================================
-- FUNÇÃO RPC PARA INCREMENTAR XP DO USUÁRIO
-- ========================================
CREATE OR REPLACE FUNCTION public.increment_user_xp(
  user_id UUID,
  xp_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualiza o tot al_xp do usuário
  UPDATE public.user_profiles
  SET 
    total_xp = total_xp + xp_amount,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Se o usuário não existe no user_profiles, não faz nada
  -- (idealmente o perfil já deveria existir)
END;
$$;
