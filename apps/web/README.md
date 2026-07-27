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
- PathFinding.js para rotas locais em grid.
- Zustand para estado local client-side.
- Zod para schemas e validação.
- Drizzle ORM e driver `postgres` para acesso server-side ao PostgreSQL.
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
  api/workspaces/[workspaceSlug]/rooms/[roomSlug]/objects/route.ts
                                   # Leitura e gravação do layout da sala
components/
  ui/                              # Componentes shadcn/ui
db/
  client.ts                        # Cliente Drizzle/Neon server-side
  schema.ts                        # Schema Drizzle inicial
drizzle.config.ts                  # Configuração de migrations
drizzle/                           # Migrations geradas
features/
  auth/
    components/                    # Formulários de login, cadastro e logout
    schemas.ts                     # Validação Zod dos formulários
  room/
    components/                    # Canvas, shell de tela cheia e painéis da sala
    domain/                        # Movimento, colisão e cálculo de rotas
    navigation/                    # Controle temporal da navegação local
    renderer/                      # Renderer PixiJS isolado
    server/                        # Queries server-only de layout
    stores/                        # Zustand stores
    types.ts                       # Tipos e schemas Zod
  room-editor/
    catalog/                       # Catálogo local de itens
    components/                    # Controles React do editor
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
- `/workspaces/[workspaceSlug]/map`: mapa principal em tela cheia do workspace.
- `/rooms/demo`: sala demo em tela cheia com canvas PixiJS e movimento local.
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
DATABASE_URL=postgresql://workspace_town:workspace_town@localhost:5432/workspace_town
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
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
bun run db:up
cd apps/web
bun run db:generate
bun run db:migrate
```

A migration inicial atual está em `drizzle/0000_solid_vivisector.sql`.

O comando `bun run db:up` deve ser executado na raiz do repositório, pois usa o `docker-compose.yml` local.
Ele requer Docker Desktop ou outro Docker engine ativo.

## Feature de sala

A feature inicial está em `features/room`.

- `types.ts`: schemas Zod e tipos de `room`, `player`, `roomObject`, `avatarConfig` e `meetingType`.
- `domain/player-movement.ts`: valida movimento, limites e colisão sem depender de React, Zustand ou PixiJS.
- `domain/player-movement.test.ts`: testes unitários das regras de movimentação.
- `domain/find-room-path.ts`: adapta PathFinding.js ao mapa e aos objetos da sala.
- `navigation/room-navigation-controller.ts`: executa e cancela rotas locais por passos.
- `stores/room-store.ts`: estado local da sala demo, player local, objetos estáticos e movimento validado por grid.
- `stores/room-store.test.ts`: integração entre movimento, objetos demo e regras do editor.
- `components/room-canvas.tsx`: componente client-side que monta o renderer e escuta teclado.
- `components/room-shell.tsx`: layout client-side com cabeçalho compacto, área jogável flexível e sidebar responsiva.
- `components/room-status-panel.tsx`: painel simples com dados do player local.
- `renderer/avatar-visual-state.ts`: regras puras de orientação e estado de movimento.
- `renderer/player-avatar-renderer.ts`: composição PixiJS isolada do avatar local.
- `renderer/camera.ts`: cálculo puro da câmera, independente do PixiJS.
- `renderer/camera.test.ts`: testes unitários de enquadramento, acompanhamento e limites.
- `renderer/interpolation.ts`: amortecimento visual independente da taxa de quadros.
- `renderer/interpolation.test.ts`: testes da progressão visual entre posições.
- `renderer/room-renderer.ts`: classe PixiJS que cria o app, desenha grid, objetos e player, atualiza a câmera e limpa recursos no unmount.

As páginas de sala não usam o container de largura máxima aplicado às telas convencionais. O canvas ocupa toda a área abaixo do cabeçalho, descontando apenas a sidebar no desktop. Em telas menores, a sidebar abre sobre a cena para preservar a área jogável.

O mapa local possui `32 x 20` tiles. A câmera mantém os tiles no tamanho natural em mapas maiores que a viewport, acompanha o jogador e não expõe áreas externas à sala. Mapas menores são centralizados e ampliados proporcionalmente.

A posição lógica permanece inteira no Zustand para colisão. O ticker do PixiJS interpola somente a posição visual do player; a câmera acompanha essa posição intermediária.

O avatar vetorial atual possui indicador de direção e ciclo simples de caminhada. Sua composição está isolada do renderer da sala para permitir múltiplas instâncias no futuro.

Cliques ou toques em tiles livres calculam uma rota A\* ortogonal. O teclado assume o controle e cancela a rota atual; ativar o editor possui o mesmo comportamento. Um marcador no canvas identifica o destino enquanto o percurso está ativo.

## Editor de sala

O editor local está em `features/room-editor` e usa o Zustand da feature de sala.

- o switch ativa ou desativa o modo de edição;
- o catálogo inicial contém mesa, cadeira, quadro e planta;
- um clique em tile vazio adiciona o item selecionado;
- um clique em objeto seleciona a instância;
- outro clique em tile vazio move o objeto selecionado;
- o painel permite girar e remover a seleção.

Na sala demo, as operações continuam locais. No mapa autenticado, o painel carrega o layout da API e oferece ações para salvar ou recarregar. O renderer recebe callbacks pelo `RoomCanvas` e permanece desacoplado do store Zustand.

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

A autenticação e o layout das salas padrão usam o PostgreSQL, mas ainda não há membership nem permissão real por workspace. A seleção atual continua mockada para validar navegação e composição do mapa principal.

## Client components e server-side code

Use `"use client"` apenas para código que depende do browser, como canvas, teclado, Zustand e componentes LiveKit client-side.

Código server-side deve ficar em rotas do App Router ou módulos server-only. O endpoint atual de LiveKit está em `app/api/livekit/token/route.ts` e usa `livekit-server-sdk` apenas no servidor.

Banco de dados também deve permanecer no servidor. O schema inicial está em `db/schema.ts`, o cliente Drizzle usa `postgres` e as queries de layout ficam em `features/room/server`.

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
- shell de sala em tela cheia com sidebar responsiva;
- canvas PixiJS;
- grid 2D;
- player local;
- movimento por WASD ou setas;
- colisão com limites e objetos bloqueantes;
- interpolação visual do player e da câmera;
- orientação visual e ciclo de caminhada do avatar;
- movimento por clique ou toque com desvio de obstáculos;
- câmera responsiva acompanhando o player;
- objetos estáticos;
- editor local para adicionar, mover, girar e remover objetos;
- API autenticada para persistir o layout da sala padrão;
- seed idempotente dos workspaces, salas e itens iniciais;
- estado local com Zustand;
- schemas Zod iniciais;
- schema Drizzle inicial;
- PostgreSQL local via Docker Compose;
- migration e fluxo de autenticação validados no PostgreSQL local;
- rota inicial de token LiveKit.

Limites atuais:

- não há servidor realtime;
- não há multiplayer real;
- a lista e as permissões de workspaces ainda são mockadas;
- workspaces são mockados;
- migrations ainda precisam ser aplicadas separadamente em cada novo ambiente;
- a persistência do editor ainda precisa ser validada localmente após a migration e o seed;
- não há componente de chamada LiveKit conectado;
- não há OAuth, recuperação de senha ou verificação de e-mail;
- os testes automatizados ainda cobrem somente o cálculo da câmera;

## Comandos úteis

Lint:

```bash
bun run lint
```

Checagem de tipos:

```bash
bun run check-types
```

Testes:

```bash
bun run test
```

Build:

```bash
bun run build
```

Subir o banco local a partir da raiz do repositório:

```bash
bun run db:up
```

Aplicar migrations a partir de `apps/web`:

```bash
bun run db:migrate
bun run db:seed
```
