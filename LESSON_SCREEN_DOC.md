# Página LessonScreen

## Descrição
A `LessonScreen` é uma página React que exibe um quiz de exercícios para uma lição específica. O usuário responde perguntas, recebe feedback e pode pular questões. A página tem sistema de vidas e progresso visual.

## Localização
- Componente: `src/components/LessonScreen.tsx`
- Rota: `src/routes/lessons/$lessonId.tsx`
- Dados: `src/data/questions.ts`

## Estrutura

### Header
- **Botão Fechar (X)**: Retorna para a página inicial
- **Barra de Progresso**: Mostra o andamento do quiz (verde)
- **Vidas**: Contador de vidas (ícone de coração vermelho + número)

### Conteúdo
- **Pergunta**: Título grande e centralizado
- **Opções**: 4 cards clicáveis com estado de seleção (azul quando selecionado)
- **Badge de Número**: Pequeno quadrado no canto direito de cada opção

### Rodapé
- **Botão Pular**: Passa para próxima pergunta (cinza)
- **Botão Verificar**: Valida a resposta (verde, desabilitado se nenhuma opção selecionada)

## Fluxo de Funcionamento

1. **LessonsModal abre** ao clicar em uma lição
2. **Usuário clica na lição** → redireciona para `/lessons/{lessonId}`
3. **LessonScreen renderiza** as questões da lição
4. **Usuário seleciona opção** → destaca em azul
5. **Usuário clica "Verificar"**:
   - Se **correto**: Próxima pergunta
   - Se **errado**: Perde 1 vida, mantém pergunta
   - Se **0 vidas**: Redireciona para home
6. **Usuário clica "Pular"**: Próxima pergunta sem validação
7. **Fim do quiz**: Redireciona para home

## Props do Componente

| Prop | Tipo | Descrição |
|------|------|-----------|
| `lessonId` | `string \| number` | ID da lição |
| `questions` | `Question[]` | Array de perguntas |
| `onClose?` | `() => void` | Callback ao fechar |

## Interface Question

```typescript
interface Question {
  id: string | number;
  title: string;
  options: string[];
  correctAnswer: number; // índice da resposta correta (0-3)
}
```

## Exemplo de Uso

```typescript
const questions: Question[] = [
  {
    id: '1-1-q1',
    title: 'Qual palavra-chave cria uma variável mutável?',
    options: ['const', 'let', 'var', 'variable'],
    correctAnswer: 1, // "let"
  },
];

<LessonScreen
  lessonId="1-1"
  questions={questions}
  onClose={() => console.log('Fechado')}
/>
```

## Dados de Exemplo

As questões estão em `src/data/questions.ts` organizadas por ID de lição:

```typescript
lessonsQuestions['1-1'] // Questões da lição 1-1
lessonsQuestions['1-2'] // Questões da lição 1-2
```

## Estados Visuais

### Card de Opção
- **Padrão**: Borda cinza, fundo branco, número cinza
- **Hover**: Fundo cinza muito claro
- **Selecionado**: Borda e fundo azuis, número branco em fundo azul
- **Desabilitado (Verificar)**: Botão em cinza claro

## Customização

### Cores
- Verde da barra: `bg-green-500`
- Azul de seleção: `bg-blue-100`, `border-blue-400`
- Verde do botão: `bg-green-500 hover:bg-green-600`

### Vidas
Editar valor inicial em `useState(3)` no componente

### Número de Questões
Aumentar/diminuir questões em `src/data/questions.ts`

## Integração com LessonsModal

Quando o usuário clica em uma lição no modal:

```typescript
const handleLessonClick = (lesson: any) => {
  navigate({ to: `/lessons/${lesson.id}` })
}
```

A rota `/lessons/$lessonId` busca as questões de `lessonsQuestions` e renderiza o `LessonScreen`.

## Acessibilidade

- Botões com `aria-label`
- Navegação por teclado suportada
- Cores de contraste adequadas
- Feedback visual claro para seleções

## Performance

- Estado local para seleção de opção
- Re-renderização otimizada de perguntas
- Transições suaves (300ms) na barra de progresso
