# Componente LessonsModal

## Descrição
O `LessonsModal` é um componente React que exibe um modal com as lições de uma unidade de aprendizado. O design segue uma linguagem visual gamificada, com cores vibrantes e interações atrativas.

## Localização
- Componente: `src/components/LessonsModal.tsx`
- Dados de exemplo: `src/data/units.ts`

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `isOpen` | `boolean` | Controla a visibilidade do modal |
| `onClose` | `() => void` | Função chamada ao fechar o modal |
| `unit` | `Unit` | Objeto contendo as informações da unidade |
| `onLessonClick?` | `(lesson: Lesson, unitId: string \| number) => void` | Callback opcional ao clicar em uma lição |

## Interface Unit
```typescript
interface Unit {
  id: string | number;
  title: string;
  number: number;
  lessons: Lesson[];
}
```

## Interface Lesson
```typescript
interface Lesson {
  id: string | number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}
```

## Recursos Visuais

### Design
- **Overlay**: Fundo semi-transparente (preto com 50% de opacidade) que cobre toda a tela
- **Modal Card**: 
  - Fundo roxo com gradiente (de roxo-600 a roxo-700)
  - Bordas arredondadas grandes (rounded-3xl)
  - Largura máxima de 28rem com responsividade
  - Padding generoso (24px)

### Componentes
1. **Botão Fechar**: Ícone X no canto superior direito
2. **Cabeçalho**: 
   - Título: "Escolha uma lição"
   - Subtítulo: "Unidade {número}"
3. **Lista de Lições**:
   - Cada lição é um card clicável
   - Cards concluídos: borda verde neon brilhante
   - Cards não concluídos: sem destaque de borda
   - Exibe: Título, descrição, XP e ícone de status
4. **Personagem**: Coruja posicionada no canto inferior direito

## Uso Integrado

O componente está integrado ao `LearningPath.tsx`:
- Abre automaticamente ao clicar em uma unidade habilitada
- Gerencia seu próprio estado (aberto/fechado)
- Renderiza a coruja e todas as lições

## Exemplo de Dados

```typescript
const unit: Unit = {
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
    {
      id: '1-2',
      title: 'Operadores',
      description: 'Conheça os operadores básicos',
      xp: 10,
      completed: false,
    },
  ]
};
```

## Customização

### Cores
Você pode customizar as cores através do Tailwind CSS:
- Fundo roxo: `bg-purple-600 to-purple-700`
- Verde de sucesso: `border-green-400`, `bg-green-500`
- Roxo dos botões: `text-purple-200`, `bg-purple-500/80`

### Tamanho do Modal
Modifique a classe `max-w-md` para `max-w-lg`, `max-w-xl`, etc.

### Posição da Coruja
Ajuste `absolute -bottom-8 -right-8 w-32 h-32` conforme necessário.

## Acessibilidade
- Botão de fechar com `aria-label`
- Elementos interativos com atributos apropriados
- Suporta navegação por teclado
