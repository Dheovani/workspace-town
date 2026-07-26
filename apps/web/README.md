# App web

Este é o app principal do Workspace Town. Ele concentra a interface web do MVP, o fluxo autenticado de entrada, a sala/mapa, o renderer PixiJS, a configuração de i18n, schemas iniciais, estado local e rotas server-side.

## Papel no monorepo

`apps/web` é a aplicação Next.js voltada ao usuário final. Ela deve controlar páginas, painéis, formulários, rotas server-side e integrações do produto.

O renderer da sala não deve ser implementado como uma árvore grande de componentes React. A cena em movimento fica no PixiJS, montada dentro de um componente client-side pequeno.

## Tecnologias usadas

- Next.js App Router.
- React e TypeScript.
- Tailwind CSS e shadcn/ui.
- next-intl para internacionalização.
- better-auth para autenticação por e-mail e senha.
- PixiJS para canvas da sala.
- Zustand para estado local client-side.
- Zod para schemas e validação.
- Drizzle ORM para schema PostgreSQL.
- LiveKit server SDK para geração de token no servidor.

## Estrutura principal

```txt
app/
  page.tsx                         # Redireciona para /auth/login
  [locale]/
    layout.tsx                     # Valida o locale da rota
    page.tsx                       # Redireciona para /auth/login
    auth/login/page.tsx            # Login com e-mail e senha
    auth/register/page.tsx         # Cadastro com e-mail e senha
    workspaces/page.tsx            # Seleção de workspaces/cidades mockados
    workspaces/[workspaceSlug]/map/page.tsx
                                   # Mapa principal do workspace mockado
    rooms/demo/page.tsx            # Rota da sala demo
  api/livekit/token/route.ts       # Endpoint server-side para token LiveKit
  api/auth/[...all]/route.ts       # Endpoint do Better Auth
components/
  ui/                              # Componentes shadcn/ui
db/
  client.ts                        # Cliente Drizzle/Neon server-side
  schema.ts                        # Schema Drizzle inicial
  drizzle.config.ts                # Configuração de migrations
features/
  auth/
    components/                    # Formulários de login, cadastro e logout
    schemas.ts                     # Validação Zod dos formulários
  room/
    components/                    # Componentes React da feature
    renderer/                      # Renderer PixiJS isolado
    stores/                        # Zustand stores
    types.ts                       # Tipos e schemas Zod
  workspaces/
    mocks/                         # Workspaces/cidades mockados
i18n/
  config.ts                        # Locales e routing
  navigation.ts                    # Helpers de navegação localizados
  request.ts                       # Carregamento de mensagens por request
messages/
  pt-BR.json                       # Mensagens do idioma padrão
  en-US.json                       # Mensagens em inglês
middleware.ts                      # Middleware do next-intl
```

## Como rodar

A partir de `apps/web`:

```bash
bun dev
```

O app roda em:

```txt
http://localhost:3000
```

Rotas úteis:

- `/`: redireciona para `/auth/login`.
- `/auth/login`: login real com e-mail e senha.
- `/auth/register`: cadastro real com e-mail e senha.
- `/workspaces`: seleção de workspaces/cidades mockados.
- `/workspaces/[workspaceSlug]/map`: mapa principal mockado do workspace.
- `/rooms/demo`: sala demo com canvas PixiJS e movimento local.
- `/en-US/auth/login`: exemplo de rota em inglês.
- `/api/livekit/token`: rota server-side para token LiveKit. Use `POST` para gerar token.

## Internacionalização

O idioma padrão é `pt-BR`. A implementação usa `next-intl` com `localePrefix: "as-needed"`, então o português brasileiro não exige prefixo na URL.

Para adicionar uma nova mensagem:

1. Escolha uma chave em inglês e organizada por domínio ou página.
2. Adicione a chave em `messages/pt-BR.json`.
3. Adicione a mesma chave em `messages/en-US.json`.
4. Use `getTranslations` em server components.
5. Use `useTranslations` somente em client components que já precisem rodar no cliente.

Não deixe textos fixos diretamente na UI. Textos em português brasileiro devem usar acentuação correta e norma culta.

## Variáveis de ambiente

Copie `apps/web/.env.example` para `apps/web/.env.local` e preencha quando for usar banco ou LiveKit.

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
```

O endpoint LiveKit retorna erro se as variáveis LiveKit não estiverem configuradas. Não há secrets hardcoded no código.

Para autenticação real, `DATABASE_URL`, `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` devem estar configuradas. Sem essas variáveis, o build pode passar, mas o fluxo de login/cadastro não deve ser considerado pronto para uso.

## Autenticação

O app usa `better-auth` com e-mail e senha. O fluxo atual é:

```txt
/auth/login ou /auth/register
  -> sessão válida
  -> /workspaces
  -> /workspaces/[workspaceSlug]/map
```

Rotas protegidas server-side:

- `/workspaces`;
- `/workspaces/[workspaceSlug]/map`.

Usuários sem sessão são redirecionados para `/auth/login`. O logout está disponível nas telas autenticadas.

As tabelas iniciais de autenticação estão no schema Drizzle (`user`, `session`, `account`, `verification`). Gere e aplique migrations antes de usar um banco novo:

```bash
bun run db:generate
bun run db:migrate
```

A migration inicial atual está em `drizzle/0000_solid_vivisector.sql`.

## Feature de sala

A feature inicial está em `features/room`.

- `types.ts`: schemas Zod e tipos de `room`, `player`, `roomObject`, `avatarConfig` e `meetingType`.
- `stores/room-store.ts`: estado local da sala demo, player local, objetos estáticos e movimento por grid.
- `components/room-canvas.tsx`: componente client-side que monta o renderer e escuta teclado.
- `components/room-status-panel.tsx`: painel simples com dados do player local.
- `renderer/room-renderer.ts`: classe PixiJS que cria o app, desenha grid, objetos e player, atualiza a cena e limpa recursos no unmount.

## Feature de workspaces

A seleção inicial de workspaces/cidades usa dados mockados em `features/workspaces/mocks/workspaces.ts`.

O modelo atual é:

```ts
type MockWorkspace = {
  id: string;
  name: string;
  slug: string;
  description: string;
  translationKey: "productTown" | "engineeringHub" | "retroSquare";
  memberCount: number;
  roomCount: number;
  defaultRoomId: string;
};
```

Ainda não há autenticação real, banco de dados ou permissão por workspace. O fluxo atual existe para validar navegação e composição do mapa principal.

## Client components e server-side code

Use `"use client"` apenas para código que depende do browser, como canvas, teclado, Zustand e componentes LiveKit client-side.

Código server-side deve ficar em rotas do App Router ou módulos server-only. O endpoint atual de LiveKit está em `app/api/livekit/token/route.ts` e usa `livekit-server-sdk` apenas no servidor.

Banco de dados também deve permanecer no servidor. O schema inicial está em `db/schema.ts`, há cliente Drizzle server-side e a migration inicial foi gerada, mas ainda não há queries de domínio implementadas.

## MVP atual

Implementado:

- i18n inicial com `pt-BR` e `en-US`;
- autenticação com `better-auth`;
- login, cadastro e logout;
- proteção server-side das rotas de workspaces;
- redirecionamento da raiz para o login;
- tela `/auth/login`;
- tela `/workspaces`;
- tela `/workspaces/[workspaceSlug]/map`;
- sala demo;
- canvas PixiJS;
- grid 2D;
- player local;
- movimento por WASD ou setas;
- objetos estáticos;
- estado local com Zustand;
- schemas Zod iniciais;
- schema Drizzle inicial;
- rota inicial de token LiveKit.

Limites atuais:

- não há servidor realtime;
- não há multiplayer real;
- não há persistência conectada a banco;
- workspaces são mockados;
- migration inicial gerada, mas ainda precisa ser aplicada em um PostgreSQL configurado;
- não há editor de sala;
- não há componente de chamada LiveKit conectado;
- não há OAuth, recuperação de senha ou verificação de e-mail;
- não há testes automatizados.

## Comandos úteis

Lint:

```bash
bun run lint
```

Checagem de tipos:

```bash
bun run check-types
```

Build:

```bash
bun run build
```
