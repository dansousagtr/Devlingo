# Sobre este template

Este documento explica o que é este template, o que ele inclui e como usá-lo ou estendê-lo em outros projetos.

## O que é o template

- **Template mínimo** para iniciar projetos com **React**, **TypeScript**, **Tailwind CSS** e **Supabase**.
- **Sem telas de login, cadastro ou loading** — apenas uma tela inicial de boas-vindas com as tecnologias utilizadas.
- Pensado para ser **clonado ou copiado** e usado como base em novos projetos.

## O que tem no projeto

### Stack

- **React 19** com TypeScript  
- **Vite** — build tool  
- **Tailwind CSS v4** — estilização  
- **TanStack Router** — roteamento file-based  
- **Supabase** — cliente configurado (uso opcional)

### Estrutura principal

| Caminho | Descrição |
|--------|-----------|
| [src/main.tsx](src/main.tsx) | Entrada da aplicação; renderiza o `AppRouter`. |
| [src/router.tsx](src/router.tsx) | Configuração do TanStack Router com `routeTree` gerado. |
| [src/routes/](src/routes/) | Rotas file-based: `__root.tsx` (layout raiz com `Outlet`), `index.tsx` (rota `/` com a tela "Template"). |
| [src/components/ui/](src/components/ui/) | Componentes reutilizáveis: `Button.tsx` e `Input.tsx`. |
| [src/services/supabaseClient.ts](src/services/supabaseClient.ts) | Cliente Supabase; lê variáveis do `.env` e usa placeholders se não configurado. |
| [src/types/index.ts](src/types/index.ts) | Tipos globais (ex.: `User`). |
| [src/utils/](src/utils/) | Funções utilitárias (ex.: `testSupabaseConnection.ts`). |

### Configuração de rotas

O [tsr.config.json](tsr.config.json) define:

- `routesDirectory`: `./src/routes`
- `generatedRouteTree`: `./src/routeTree.gen.ts`

O script `dev` roda `tsr generate` antes do Vite, gerando/atualizando o `routeTree.gen.ts` a partir dos arquivos em `src/routes/`.

### Scripts (package.json)

- **`npm run dev`** — Gera as rotas e inicia o servidor de desenvolvimento.
- **`npm run build`** — Gera as rotas, compila TypeScript e gera o build de produção.
- **`npm run lint`** — Executa o linter.
- **`npm run preview`** — Preview da build de produção.
- **`npm run test:supabase`** — Testa a conexão com o Supabase (usa [scripts/test-supabase.js](scripts/test-supabase.js)).

## Como usar o template

### Rodar o projeto

1. Instale as dependências:
   ```bash
   npm i
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse o endereço indicado no terminal (geralmente [http://localhost:5173](http://localhost:5173)).

### Usar em outro projeto

1. Clone ou copie este repositório.
2. Opcionalmente altere o nome no `package.json`.
3. Execute `npm i` e depois `npm run dev` como acima.

### Supabase (opcional)

1. Copie o arquivo [env.example](env.example) para `.env`.
2. Preencha:
   - `VITE_SUPABASE_URL` — URL do seu projeto Supabase  
   - `VITE_SUPABASE_ANON_KEY` — chave anônima (anon key)
3. Teste a conexão:
   ```bash
   npm run test:supabase
   ```

O cliente em [src/services/supabaseClient.ts](src/services/supabaseClient.ts) pode ser importado diretamente onde precisar do Supabase.

## Como estender o template

### Nova rota

1. Crie um arquivo em `src/routes/` (ex.: `sobre.tsx` → rota `/sobre`).
2. Use `createFileRoute` e exporte `Route`; o [routeTree.gen.ts](src/routeTree.gen.ts) é regenerado ao rodar `npm run dev` ou ao executar `tsr generate`.

### Componentes

- Coloque em `src/components/` (e subpastas como `ui/`).
- Use os existentes `Button` e `Input` como referência.

### Serviços e API

- Coloque em `src/services/`.
- Para Supabase, importe o cliente de [supabaseClient.ts](src/services/supabaseClient.ts).

### Estilos

- Use **Tailwind** nas `className` dos componentes.
- Estilos globais em [src/index.css](src/index.css) (atualmente apenas `@import "tailwindcss"`).

## Configuração do ambiente

O ambiente já está configurado com:

- [vite.config.ts](vite.config.ts) — Vite  
- [tailwind.config.js](tailwind.config.js) — Tailwind CSS  
- [tsconfig.json](tsconfig.json) e [tsconfig.app.json](tsconfig.app.json) — TypeScript  

Não é necessário alterar esses arquivos para começar; use-os como referência se precisar customizar.

## Documentação externa

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/docs)
- [TanStack Router](https://tanstack.com/router)
