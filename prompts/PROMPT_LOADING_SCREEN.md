# Prompt para Copilot - Tela de Carregamento Devlingo

## Instruções para o Copilot

Crie uma tela de carregamento fullscreen para o aplicativo Devlingo com as seguintes especificações:

### Design Visual:
- **Fundo**: Cor roxa vibrante que ocupa toda a tela (bg-purple-600 ou similar)
- **Layout**: Centralizado vertical e horizontalmente
- **Elementos principais**:
  1. Uma coruja roxa estilizada com chapéu de bruxa
  2. Texto "Devlingo" em branco abaixo da coruja

### Componente da Coruja:
Crie um componente SVG da coruja com:
- **Corpo**: Forma arredondada/oval roxa (#9333EA ou purple-600)
- **Olhos**: Grandes círculos brancos com pupilas pretas
- **Bico**: Pequeno triângulo laranja
- **Chapéu de bruxa**: Chapéu roxo escuro (#7C3AED ou purple-700) com:
  - Forma cônica
  - Borda curvada para cima
  - Estrelas amarelas (#FCD34D ou yellow-300) decorativas no chapéu

### Animação:
- A coruja deve ter uma animação suave de "float" (flutuação):
  - Movimento vertical suave para cima e para baixo
  - Duração: 2-3 segundos
  - Loop infinito
  - Easing: ease-in-out
  - Amplitude: aproximadamente 20-30px

### Estrutura do Componente:
```typescript
// Componente: LoadingScreen.tsx
// Localização: src/components/ui/LoadingScreen.tsx
// Tecnologias: React + TypeScript + Tailwind CSS
```

### Requisitos Técnicos:
1. Componente funcional React com TypeScript
2. Use Tailwind CSS para estilização
3. Use CSS animations ou Tailwind animation utilities
4. Ocupa 100% da viewport (w-screen h-screen)
5. Centralizado com flexbox
6. Responsivo

### Código Esperado:
- Componente exportável `LoadingScreen`
- Sem props necessárias (componente simples)
- Animação CSS usando `@keyframes` ou Tailwind `animate-*`
- SVG inline da coruja ou componente separado

### Exemplo de Estrutura:
```tsx
export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-purple-600 flex items-center justify-center">
      {/* Coruja com animação */}
      {/* Texto Devlingo */}
    </div>
  );
};
```

### Cores Sugeridas (Tailwind):
- Fundo: `bg-purple-600` ou `bg-purple-700`
- Coruja corpo: `fill-purple-500` ou `fill-purple-600`
- Chapéu: `fill-purple-800` ou `fill-purple-900`
- Estrelas: `fill-yellow-300` ou `fill-yellow-400`
- Texto: `text-white`
- Bico: `fill-orange-500`

### Animação CSS Sugerida:
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

Crie o componente completo e funcional seguindo essas especificações.
