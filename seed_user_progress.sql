-- ========================================
-- SCRIPT: Seed de Progresso do Usuário
-- Usuário: 36108da3-78d3-4bae-92b8-7d26d5875de2
-- Objetivo: Inserir perfil do usuário (se não existir)
--           e marcar as lições da Unidade 1 (Fundamentos do JavaScript)
--           como concluídas, simulando que o usuário já completou
--           a primeira unidade.
-- ========================================

-- 1. Inserir perfil do usuário caso ele não exista
INSERT INTO public.user_profiles (id, email, name, total_xp)
VALUES (
  '36108da3-78d3-4bae-92b8-7d26d5875de2',
  'usuario@email.com',
  'Aluno DevLingo',
  25  -- 10 + 15 XP das duas lições da Unidade 1
)
ON CONFLICT (id) DO NOTHING;

-- 2. Marcar a lição "O que é JavaScript?" como concluída
--    (XP: 10, pertence à Unidade "Fundamentos do JavaScript")
INSERT INTO public.user_lessons (user_id, lesson_id, is_completed, xp_earned, completed_at)
SELECT
  '36108da3-78d3-4bae-92b8-7d26d5875de2',
  l.id,
  TRUE,
  l.xp_reward,
  NOW() - INTERVAL '2 days' -- Concluída há 2 dias
FROM public.lessons l
WHERE l.title = 'O que é JavaScript?'
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- 3. Marcar a lição "Seu Primeiro Programa" como concluída
--    (XP: 15, pertence à Unidade "Fundamentos do JavaScript")
INSERT INTO public.user_lessons (user_id, lesson_id, is_completed, xp_earned, completed_at)
SELECT
  '36108da3-78d3-4bae-92b8-7d26d5875de2',
  l.id,
  TRUE,
  l.xp_reward,
  NOW() - INTERVAL '1 day' -- Concluída há 1 dia
FROM public.lessons l
WHERE l.title = 'Seu Primeiro Programa'
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- 4. Atualizar o total_xp do usuário somando o XP das lições concluídas
UPDATE public.user_profiles
SET 
  total_xp = (
    SELECT COALESCE(SUM(xp_earned), 0)
    FROM public.user_lessons
    WHERE user_id = '36108da3-78d3-4bae-92b8-7d26d5875de2'
      AND is_completed = TRUE
  ),
  updated_at = NOW()
WHERE id = '36108da3-78d3-4bae-92b8-7d26d5875de2';

-- 5. (Opcional) Verificar o resultado
SELECT 
  u.title AS unidade,
  l.title AS licao,
  ul.is_completed,
  ul.xp_earned,
  ul.completed_at
FROM public.user_lessons ul
JOIN public.lessons l ON l.id = ul.lesson_id
JOIN public.units u ON u.id = l.unit_id
WHERE ul.user_id = '36108da3-78d3-4bae-92b8-7d26d5875de2'
ORDER BY u.title, l.title;

SELECT 
  id, email, name, total_xp, updated_at
FROM public.user_profiles
WHERE id = '36108da3-78d3-4bae-92b8-7d26d5875de2';

