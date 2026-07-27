# Workspace Town

Workspace Town é um projeto de workspace virtual colaborativo inspirado em interfaces espaciais como Gather. A proposta é combinar uma aplicação web, um renderer 2D leve, presença em tempo real, chamadas ao vivo e fluxos de reunião para times de software.

O objetivo do produto é permitir que usuários criem salas virtuais, organizem móveis e itens, personalizem avatares, movam-se por um ambiente 2D ou isométrico e participem de chamadas ao vivo. Em etapas futuras, o sistema também deve apoiar rituais como daily, planning, retro, review e pair programming.

## Arquitetura geral

O repositório usa uma estrutura de monorepo em estilo Turborepo.

```txt
apps/
  web/       # App principal em Next.js
  docs/      # App de documentação criado pelo template
packages/
  ui/
  eslint-config/
  typescript-config/
docs/        # Documentação técnica em Markdown
docker-compose.yml
             # PostgreSQL local para desenvolvimento
```

No momento, a aplicação principal está em `apps/web`. A documentação técnica do projeto fica em `docs/`.

## Tecnologias principais

- Bun como runtime e package manager.
- Turborepo para orquestração do monorepo.
- Next.js, React e TypeScript para o app web.
- Tailwind CSS e shadcn/ui para interface.
- next-intl para internacionalização.
- better-auth para autenticação por e-mail e senha.
- PixiJS para o renderer da sala virtual.
- Zustand para estado client-side local.
- Zod para schemas e validação.
- Drizzle ORM para modelagem de banco PostgreSQL.
- Driver `postgres` para acesso server-side compatível com PostgreSQL local e Neon.
- LiveKit como provedor planejado de áudio e vídeo.

## Internacionalização

O projeto usa i18n desde o início com `pt-BR` como idioma padrão. Os arquivos de mensagens ficam em:

```txt
apps/web/messages/pt-BR.json
apps/web/messages/en-US.json
```

As telas devem usar mensagens desses arquivos, não textos fixos diretamente em componentes ou páginas. Novas mensagens devem ser organizadas por domínio ou página, com chaves em inglês e valores localizados.

Todo texto em português brasileiro deve seguir a norma culta e usar acentuação correta.

## Separação de responsabilidades

- App web: páginas, rotas, componentes de UI, chamadas server-side e integração do MVP.
- Renderer PixiJS: desenho da sala, grid, objetos, avatar e movimento local no canvas.
- Estado local: posição atual do player e dados efêmeros do protótipo ficam no Zustand.
- Banco de dados: entidades persistentes como usuários, players, workspaces, salas, objetos, chat, chamadas e reuniões ficam no schema Drizzle.
- LiveKit: tratado como provedor de chamada. O domínio usa entidades internas como `callSessions` e `callParticipants`.
- Realtime server: planejado para presença e movimento em tempo real. Ainda não foi implementado.

O movimento do player não deve ser persistido em SQL. Para o MVP, ele é local e efêmero.

## Variáveis de ambiente

O app web espera as variáveis abaixo. Veja também `apps/web/.env.example`.

```env
DATABASE_URL=postgresql://workspace_town:workspace_town@localhost:5432/workspace_town
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
```

Não coloque secrets reais no repositório.

## Comandos

Instalar dependências:

```bash
bun install
```

Rodar apenas o app web:

```bash
cd apps/web
bun dev
```

Subir o PostgreSQL local:

```bash
bun run db:up
```

Esse comando requer Docker Desktop ou outro Docker engine ativo.

Aplicar migrations no banco local:

```bash
cd apps/web
bun run db:migrate
```

Rodar todos os apps pelo monorepo:

```bash
bun dev
```

Build:

```bash
bun run build
```

Lint:

```bash
bun run lint
```

Checagem de tipos do app web:

```bash
cd apps/web
bun run check-types
```

## Estado atual

Já existe uma fundação inicial para o MVP:

- rota raiz redirecionando para o login;
- rota `/auth/login` com login real por e-mail e senha;
- rota `/auth/register` com cadastro real por e-mail e senha;
- rota `/workspaces` protegida por sessão, com seleção de workspaces/cidades mockados;
- rota `/workspaces/[workspaceSlug]/map` protegida por sessão, com o mapa principal e renderer PixiJS;
- rota `/rooms/demo`;
- logout disponível na área autenticada;
- i18n inicial com `pt-BR` e `en-US`;
- componente client-side que monta um canvas PixiJS;
- renderer PixiJS separado da camada React;
- grid 2D simples, objetos estáticos e player local;
- movimento local com teclado;
- store Zustand para estado local da sala e do player;
- editor local com catálogo de itens, posicionamento, movimentação, rotação e remoção;
- mocks tipados de workspaces em `apps/web/features/workspaces`;
- schemas Zod iniciais para sala, player, avatar, objetos e tipos de reunião;
- schema Drizzle inicial para os principais domínios persistentes;
- tabelas Drizzle iniciais para `better-auth`;
- PostgreSQL local via Docker Compose;
- migration inicial validada no PostgreSQL local;
- cadastro, login, sessão protegida e logout validados contra o banco local;
- endpoint inicial `POST /api/livekit/token` para gerar token LiveKit;
- arquivo `.env.example` do app web.

## Autenticação

O app usa `better-auth` com e-mail e senha. As rotas de workspaces exigem sessão server-side:

- `/workspaces`;
- `/workspaces/[workspaceSlug]/map`.

Usuários sem sessão são redirecionados para `/auth/login`. Após login ou cadastro bem-sucedido, a interface navega para `/workspaces`.

Para autenticação real funcionar em desenvolvimento, configure `DATABASE_URL`, `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL`, suba o PostgreSQL local e aplique as migrations do Drizzle.

A migration inicial está em `apps/web/drizzle/0000_solid_vivisector.sql` e foi validada no PostgreSQL local. Para aplicá-la em um banco novo:

```bash
bun run db:up
cd apps/web
bun run db:migrate
```

## A implementar

As próximas etapas planejadas incluem:

- OAuth;
- recuperação de senha;
- verificação de e-mail;
- persistência real de workspaces e salas;
- painel de chamada LiveKit no app web;
- conexão real a uma sala LiveKit;
- persistência do editor de sala;
- persistência real de workspaces, salas e objetos em PostgreSQL;
- servidor realtime para presença e movimento;
- fluxo de reuniões para daily, planning, retro, review e pair programming;
- testes automatizados para i18n, renderer, schemas, rotas e UI.

## Documentação interna

- Documentação técnica: [`docs/README.md`](docs/README.md)
- Banco de dados: [`docs/database.md`](docs/database.md)
- App web: [`apps/web/README.md`](apps/web/README.md)
- Pendências vivas do projeto: [`TODO.md`](TODO.md)
