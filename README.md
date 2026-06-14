# Workspace Town

Workspace Town e um projeto de workspace virtual colaborativo inspirado em interfaces espaciais como Gather. A proposta e combinar uma aplicacao web, um renderer 2D leve, presenca em tempo real, chamadas ao vivo e fluxos de reuniao para times de software.

O objetivo do produto e permitir que usuarios criem salas virtuais, organizem moveis e itens, personalizem avatares, movam-se por um ambiente 2D ou isometrico e participem de chamadas ao vivo. Em etapas futuras, o sistema tambem deve apoiar rituais como daily, planning, retro, review e pair programming.

## Arquitetura geral

O repositorio usa uma estrutura de monorepo em estilo Turborepo.

```txt
apps/
  web/       # App principal em Next.js
  docs/      # App de documentacao criado pelo template, ainda nao usado como docs tecnica
packages/
  ui/        # Componentes compartilhados iniciais do template
  eslint-config/
  typescript-config/
docs/        # Documentacao tecnica do projeto
```

No momento, a aplicacao principal esta em `apps/web`. A documentacao tecnica do projeto fica em `docs/`.

## Tecnologias principais

- Bun como runtime e package manager.
- Turborepo para orquestracao do monorepo.
- Next.js, React e TypeScript para o app web.
- Tailwind CSS e shadcn/ui para interface.
- PixiJS para o renderer da sala virtual.
- Zustand para estado client-side local.
- Zod para schemas e validacao.
- Drizzle ORM para modelagem de banco PostgreSQL.
- LiveKit como provedor planejado de audio e video.

## Separacao de responsabilidades

- App web: paginas, rotas, componentes de UI, chamadas server-side e integracao do MVP.
- Renderer PixiJS: desenho da sala, grid, objetos, avatar e movimento local no canvas.
- Estado local: posicao atual do player e dados efemeros do prototipo ficam no Zustand.
- Banco de dados: entidades persistentes como usuarios, players, workspaces, salas, objetos, chat, chamadas e reunioes ficam no schema Drizzle.
- LiveKit: tratado como provedor de chamada. O dominio usa entidades internas como `callSessions` e `callParticipants`.
- Realtime server: planejado para presenca e movimento em tempo real. Ainda nao foi implementado.

O movimento do player nao deve ser persistido em SQL. Para o MVP, ele e local e efemero.

## Variaveis de ambiente

O app web espera as variaveis abaixo. Veja tambem `apps/web/.env.example`.

```env
DATABASE_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
```

Nao coloque secrets reais no repositorio.

## Comandos

Instalar dependencias:

```bash
bun install
```

Rodar todos os apps pelo monorepo:

```bash
bun dev
```

Rodar apenas o app web:

```bash
cd apps/web
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

Ja existe uma fundacao inicial para o MVP:

- pagina inicial com link para a sala demo;
- rota `/rooms/demo`;
- componente client-side que monta um canvas PixiJS;
- renderer PixiJS separado da camada React;
- grid 2D simples, objetos estaticos e player local;
- movimento local com teclado;
- store Zustand para estado local da sala e do player;
- schemas Zod iniciais para sala, player, avatar, objetos e tipos de reuniao;
- schema Drizzle inicial para os principais dominios persistentes;
- endpoint inicial `POST /api/livekit/token` para gerar token LiveKit;
- arquivo `.env.example` do app web.

## A implementar

As proximas etapas planejadas incluem:

- painel de chamada LiveKit no app web;
- conexao real a uma sala LiveKit;
- editor basico de sala e objetos;
- modelos e migrations Drizzle;
- persistencia real em PostgreSQL;
- servidor realtime para presenca e movimento;
- fluxo de reunioes para daily, planning, retro, review e pair programming;
- testes automatizados para renderer, schemas, rotas e UI.

## Documentacao interna

- Documentacao tecnica: [`docs/README.md`](docs/README.md)
- App web: [`apps/web/README.md`](apps/web/README.md)
- Pendencias vivas do projeto: [`TODO.md`](TODO.md)
