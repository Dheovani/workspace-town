# App web

Este e o app principal do Workspace Town. Ele concentra a interface web do MVP, a sala demo, o renderer PixiJS, schemas iniciais, estado local e rotas server-side.

## Papel no monorepo

`apps/web` e a aplicacao Next.js voltada ao usuario final. Ela deve controlar paginas, paineis, formularios, rotas server-side e integracoes do produto.

O renderer da sala nao deve ser implementado como uma arvore grande de componentes React. A cena em movimento fica no PixiJS, montada dentro de um componente client-side pequeno.

## Tecnologias usadas

- Next.js App Router.
- React e TypeScript.
- Tailwind CSS e shadcn/ui.
- PixiJS para canvas da sala.
- Zustand para estado local client-side.
- Zod para schemas e validacao.
- Drizzle ORM para schema PostgreSQL.
- LiveKit server SDK para geracao de token no servidor.

## Estrutura principal

```txt
app/
  page.tsx                  # Home simples com link para a sala demo
  rooms/demo/page.tsx       # Rota da sala demo
  api/livekit/token/route.ts# Endpoint server-side para token LiveKit
components/
  ui/                       # Componentes shadcn/ui
db/
  schema.ts                 # Schema Drizzle inicial
features/
  room/
    components/             # Componentes React da feature
    renderer/               # Renderer PixiJS isolado
    stores/                 # Zustand stores
    types.ts                # Tipos e schemas Zod
lib/
  utils.ts                  # Utilitarios compartilhados do app
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

Rotas uteis:

- `/`: entrada simples do produto.
- `/rooms/demo`: sala demo com canvas PixiJS e movimento local.
- `/api/livekit/token`: rota server-side para token LiveKit. Use `POST` para gerar token.

## Variaveis de ambiente

Copie `apps/web/.env.example` para `apps/web/.env.local` e preencha quando for usar banco ou LiveKit.

```env
DATABASE_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
```

O endpoint LiveKit retorna erro se as variaveis LiveKit nao estiverem configuradas. Nao ha secrets hardcoded no codigo.

## Feature de sala

A feature inicial esta em `features/room`.

- `types.ts`: schemas Zod e tipos de `room`, `player`, `roomObject`, `avatarConfig` e `meetingType`.
- `stores/room-store.ts`: estado local da sala demo, player local, objetos estaticos e movimento por grid.
- `components/room-canvas.tsx`: componente client-side que monta o renderer e escuta teclado.
- `components/room-status-panel.tsx`: painel simples com dados do player local.
- `renderer/room-renderer.ts`: classe PixiJS que cria o app, desenha grid, objetos e player, atualiza a cena e limpa recursos no unmount.

## Client components e server-side code

Use `"use client"` apenas para codigo que depende do browser, como canvas, teclado, Zustand e componentes LiveKit client-side.

Codigo server-side deve ficar em rotas do App Router ou modulos server-only. O endpoint atual de LiveKit esta em `app/api/livekit/token/route.ts` e usa `livekit-server-sdk` apenas no servidor.

Banco de dados tambem deve permanecer no servidor. O schema inicial esta em `db/schema.ts`, mas ainda nao ha cliente de banco, migrations ou queries implementadas.

## MVP atual

Implementado:

- home simples;
- sala demo;
- canvas PixiJS;
- grid 2D;
- player local;
- movimento por WASD ou setas;
- objetos estaticos;
- estado local com Zustand;
- schemas Zod iniciais;
- schema Drizzle inicial;
- rota inicial de token LiveKit.

Limites atuais:

- nao ha servidor realtime;
- nao ha multiplayer real;
- nao ha persistencia conectada a banco;
- nao ha editor de sala;
- nao ha componente de chamada LiveKit conectado;
- nao ha autenticacao;
- nao ha testes automatizados.

## Comandos uteis

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
