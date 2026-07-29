# Guia de Integração: LessonsModal → LessonScreen

## 🔄 Fluxo Completo

```
HomePage
  ↓
LearningPath (clica em unidade)
  ↓
LessonsModal (exibe lições)
  ↓
LessonScreen (exibe quiz)
  ↓
Questões & Respostas
  ↓
Home (ao terminar ou fechar)
```

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── LessonsModal.tsx       # Modal com lista de lições
│   ├── LessonScreen.tsx       # Página do quiz
│   └── LearningPath.tsx       # Caminho de aprendizado (atualizado)
├── routes/
│   ├── __root.tsx
│   ├── index.tsx              # HomePage
│   └── lessons/
│       └── $lessonId.tsx      # Rota parametrizada
├── data/
│   ├── units.ts               # Dados das unidades
│   └── questions.ts           # Questões do quiz
├── types/
│   └── index.ts               # Interfaces e tipos
└── router.tsx
```

## 🔗 Conexões

### 1. LearningPath → LessonsModal
```typescript
// Cliq em unidade (estrela) abre modal
onClick={() => enabled && handleUnitClick(u, idx)}

// Modal renderiza com dados da unidade
{selectedUnit && (
  <LessonsModal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    unit={selectedUnit}
  />
)}
```

### 2. LessonsModal → LessonScreen
```typescript
// Clique em lição navega para rota parametrizada
const handleLessonClick = (lesson: any) => {
  navigate({ to: `/lessons/${lesson.id}` })
}
```

### 3. Rota → Componente
```typescript
// src/routes/lessons/$lessonId.tsx
const { lessonId } = Route.useParams()
const questions = lessonsQuestions[lessonId as string]

return <LessonScreen lessonId={lessonId} questions={questions} />
```

## 📊 Dados Utilizados

### Units (src/data/units.ts)
```typescript
{
  id: 1,
  title: 'Fundamentos de JavaScript',
  number: 1,
  lessons: [
    {
      id: '1-1',
      title: 'Variáveis e tipos',
      description: 'Aprenda sobre variáveis em JavaScript',
      xp: 10,
      completed: true,
    },
    // ... mais lições
  ]
}
```

### Questions (src/data/questions.ts)
```typescript
lessonsQuestions['1-1'] = [
  {
    id: '1-1-q1',
    title: 'Qual palavra-chave cria uma variável mutável?',
    options: ['const', 'let', 'var', 'variable'],
    correctAnswer: 1,
  },
  // ... mais questões
]
```

## 🎯 Tipos Principais

```typescript
// src/types/index.ts

interface Unit {
  id: string | number;
  title: string;
  number: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string | number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

interface Question {
  id: string | number;
  title: string;
  options: string[];
  correctAnswer: number;
}
```

## ⚙️ Como Funciona

### 1. Usuário clica em unidade
- LearningPath detecta o clique
- Valida se unidade está habilitada
- Abre LessonsModal com dados da unidade

### 2. Usuário clica em lição
- LessonsModal navega para `/lessons/{lessonId}`
- Rota busca questões em `lessonsQuestions`
- LessonScreen renderiza com as questões

### 3. Usuário responde quiz
- Seleciona uma opção (azul)
- Clica "Verificar" para validar
- Se correto: próxima pergunta
- Se errado: perde vida, mesma pergunta
- Pode clicar "Pular" para passar

### 4. Fim do quiz
- Última pergunta respondida ou vidas zeradas
- Redireciona para home

## 🚀 Como Usar

### 1. Gerar routeTree (se necessário)
```bash
npm run build
# ou se houver um script tsr
npm run tsr
```

### 2. Iniciar o projeto
```bash
npm run dev
```

### 3. Testar o fluxo
1. Vá para home page
2. Clique em unidade (primeira ou segunda - as que estão "completed")
3. Modal abre com lições
4. Clique em uma lição
5. Quiz abre na página `/lessons/{id}`
6. Responda perguntas

## 🎨 Customizações Possíveis

### Adicionar mais lições
Edite `src/data/units.ts` e adicione mais items ao array `lessons`

### Adicionar mais questões
Edite `src/data/questions.ts` e adicione mais questões para cada lição

### Alterar número de vidas
Em `src/components/LessonScreen.tsx`:
```typescript
const [lives, setLives] = useState(3) // altere para outro número
```

### Mudar cores
Use classes Tailwind conforme necessário nos componentes

## 🧪 Teste Manual

```
✓ Clique em unidade → abre modal
✓ Clique em lição → vai para /lessons/{id}
✓ Selecione opção → fica azul
✓ Clique verificar → próxima ou perde vida
✓ Clique pular → próxima sem validar
✓ Clique X → volta para home
✓ Complete quiz → volta para home
```

## 📝 Notas

- Todas as lições têm questões em `lessonsQuestions`
- Sistema de vidas funciona em tempo real
- Progresso visual na barra superior
- Botão "Verificar" desabilitado sem seleção
- Tema segue padrão da aplicação (roxo/verde)
