# AGENTS.md

## Contexto do projeto

Este projeto é uma plataforma de workspace virtual colaborativo inspirada em experiências como Gather.

O objetivo do produto é permitir que usuários:

* criem e personalizem workspaces virtuais;
* acessem uma “cidade” ou ambiente de trabalho compartilhado;
* personalizem seus avatares;
* movam-se por um mapa 2D/isométrico;
* organizem salas com móveis e objetos interativos;
* comuniquem-se por chamadas ao vivo;
* utilizem fluxos próprios de equipes de desenvolvimento, como daily, planning, retrospectiva, review e pair programming.

A aplicação não deve ser tratada apenas como um sistema de chamadas. Ela combina:

1. aplicação web;
2. interface jogável;
3. renderização 2D/isométrica;
4. presença em tempo real;
5. chamadas de áudio/vídeo;
6. persistência de workspaces, salas, usuários e reuniões;
7. fluxos colaborativos próprios para times de software.

## Estado atual do projeto

O projeto está organizado como monorepo.

O app web está em:

```txt
apps/web
```

Os seguintes comandos já foram executados dentro de `apps/web`:

```bash
bun add pixi.js zustand zod @tanstack/react-query
bun add @livekit/components-react @livekit/components-styles livekit-client livekit-server-sdk
bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit tsx

bunx shadcn@latest init
```

Não reinstale essas dependências sem necessidade.

Use Bun como package manager/runtime.

## Stack preferencial

Use esta stack, salvo motivo técnico relevante para alterá-la:

* Monorepo: Turborepo ou estrutura equivalente;
* Runtime/package manager: Bun;
* Framework principal: Next.js com App Router;
* Linguagem: TypeScript;
* UI: React;
* Estilização: Tailwind CSS;
* Componentes: shadcn/ui;
* Renderização 2D: PixiJS;
* Estado local: Zustand;
* Server/query state: TanStack Query;
* Validação: Zod;
* Banco de dados: PostgreSQL, preferencialmente Neon;
* ORM: Drizzle ORM;
* Chamadas ao vivo: LiveKit;
* Realtime futuro: WebSocket, preferencialmente Cloudflare Durable Objects ou serviço separado.

## Princípios arquiteturais

### React não é o renderer do mapa

React deve controlar a interface da aplicação:

* páginas;
* formulários;
* menus;
* modais;
* painéis laterais;
* lista de participantes;
* controles de reunião;
* configurações;
* onboarding;
* seleção de workspace.

PixiJS deve controlar a cena jogável:

* mapa;
* grid;
* tiles;
* avatares;
* móveis;
* objetos interativos;
* animações;
* ordenação por profundidade;
* movimentação local;
* interação por mouse/teclado dentro do mapa.

Não renderize a cena jogável com componentes React comuns.

### Separar UI, domínio e renderização

Evite componentes grandes que misturem:

* JSX;
* regras de negócio;
* mocks;
* Zustand;
* PixiJS;
* chamadas de API;
* textos fixos;
* lógica de navegação.

Prefira organizar por domínio/feature.

Exemplo:

```txt
src/features/room/
  components/
  renderer/
  stores/
  schemas/
  types.ts
```

### Separar dados persistentes de estado efêmero

Dados persistentes pertencem ao PostgreSQL:

* usuários;
* players;
* workspaces;
* membros do workspace;
* salas;
* configurações de sala;
* objetos colocados na sala;
* mensagens;
* sessões de chamada;
* sessões de reunião;
* notas;
* action items.

Estado efêmero não deve ser persistido continuamente no banco relacional:

* posição atual do avatar;
* direção atual;
* usuários online neste instante;
* eventos de movimento;
* status temporário de áudio/vídeo;
* presença em tempo real.

Para o MVP, esse estado pode ser local/mockado. No futuro, deve ser movido para WebSocket, Durable Objects, Redis ou serviço realtime adequado.

### LiveKit deve ser tratado como provider

Use LiveKit para áudio/vídeo, mas não prenda o domínio do projeto ao LiveKit.

Use entidades internas como:

```txt
callSessions
callParticipants
meetingSessions
meetingParticipants
```

Dados específicos do provider devem ficar em campos como:

```txt
provider
providerRoomName
providerParticipantId
metadata
```

Não implemente WebRTC manualmente no MVP.

## Internacionalização obrigatória

O projeto deve usar internacionalização desde o início.

O idioma padrão é:

```txt
pt-BR
```

O app deve possuir arquivos de mensagens, preferencialmente:

```txt
messages/
  pt-BR.json
  en-US.json
```

Se a estrutura do projeto exigir outro local, mantenha um padrão claro e documente.

### Regra principal de i18n

Não escreva textos visíveis ao usuário diretamente no JSX, em componentes, páginas ou mocks de UI.

Evite:

```tsx
<h1>Selecione uma cidade</h1>
<Button>Entrar</Button>
```

Prefira mensagens centralizadas:

```tsx
const t = useTranslations("workspaces");

<h1>{t("title")}</h1>
<Button>{t("actions.enter")}</Button>
```

Use a API adequada do `next-intl` para server components e client components.

Não transforme um server component em client component apenas para traduzir texto, se houver alternativa server-side.

### Português brasileiro

O português brasileiro deve seguir a norma culta e possuir acentuação correta.

Use grafia correta, por exemplo:

```txt
Seleção
Configuração
Usuário
Área
Você
Autenticação
Descrição
Reunião
Permissão
```

Antes de finalizar qualquer alteração de interface, revise todos os textos em português.

A interface em português deve ser natural, clara e tecnicamente correta.

### Organização das mensagens

Use chaves organizadas por domínio ou página.

Exemplo:

```json
{
  "common": {
    "actions": {
      "enter": "Entrar",
      "back": "Voltar",
      "continue": "Continuar"
    }
  },
  "auth": {
    "login": {
      "title": "Entrar no workspace",
      "description": "Acesse sua cidade virtual de trabalho.",
      "submit": "Entrar"
    }
  },
  "workspaces": {
    "title": "Selecione uma cidade",
    "description": "Escolha o workspace que deseja acessar."
  },
  "map": {
    "title": "Mapa principal",
    "backToWorkspaces": "Voltar para a seleção de cidades"
  }
}
```

Use nomes de chaves em inglês.

Não misture idiomas na mesma chave.

Não duplique mensagens desnecessariamente.

Não use mensagens genéricas demais quando o contexto exigir clareza.

### Quando adicionar nova UI

Toda nova tela, componente ou fluxo visível ao usuário deve:

1. adicionar suas mensagens em `messages/pt-BR.json`;
2. adicionar equivalentes em `messages/en-US.json`, mesmo que simples;
3. usar as mensagens via `next-intl`;
4. manter português com acentuação correta;
5. evitar texto hardcoded no JSX.

## Fluxo inicial do usuário

O fluxo inicial do MVP é:

```txt
Login
  → seleção de workspace/cidade
  → abertura do mapa principal
```

No código, use o conceito técnico `workspace`.

Na interface, a metáfora visual pode ser “cidade”, mas o domínio principal deve continuar sendo `workspace`.

Rotas iniciais desejadas:

```txt
/
/auth/login
/workspaces
/workspaces/[workspaceSlug]/map
```

Comportamento esperado:

* `/` redireciona ou aponta para `/auth/login`;
* `/auth/login` exibe login mockado;
* o botão de entrada leva para `/workspaces`;
* `/workspaces` lista workspaces/cidades mockados;
* ao escolher um workspace, o usuário vai para `/workspaces/[workspaceSlug]/map`;
* o mapa exibe o workspace selecionado e o renderer PixiJS ou placeholder claro.

Não implemente autenticação real até que seja solicitado.

Não implemente banco real, realtime ou LiveKit nesse fluxo inicial, salvo instrução explícita.

## Estrutura sugerida

A estrutura pode evoluir para:

```txt
apps/
  web/
    src/
      app/
      components/
      features/
      i18n/
      lib/
      styles/

  realtime/
    # Futuro serviço WebSocket/Durable Objects

packages/
  db/
    src/
      schema/
      index.ts
    drizzle.config.ts

  shared/
    src/
      schemas/
      types/
      constants/

  ui/
    src/
      components/
```

Não crie pacotes prematuramente se o MVP ainda não exigir.

Se a estrutura atual do projeto for mais simples, preserve-a e evolua de forma incremental.

## Organização por features

Prefira organizar código por domínio:

```txt
features/auth
features/session
features/workspaces
features/room
features/room-editor
features/player
features/calls
features/meetings
features/chat
```

Exemplo para o mapa:

```txt
src/features/room/
  components/
    room-canvas.tsx
  renderer/
    room-renderer.ts
  stores/
    use-room-store.ts
  schemas/
    room-schema.ts
  types.ts
```

Exemplo para workspaces:

```txt
src/features/workspaces/
  components/
  mocks/
  schemas/
  types.ts
```

## Modelo de domínio recomendado

### Identidade

```txt
users
players
playerSettings
```

`users` representam conta/autenticação.

`players` representam a identidade visual e jogável dentro do ambiente virtual.

Configurações de avatar devem ser preferencialmente JSON, não arquivos de imagem gerados.

Exemplo:

```json
{
  "skin": "#d8a47f",
  "hair": "short-black",
  "shirt": "#2d6cdf",
  "pants": "#222222"
}
```

### Workspaces

```txt
workspaces
workspaceMembers
```

Um workspace representa uma empresa, time, projeto ou “cidade” virtual.

### Salas

```txt
rooms
roomSettings
roomMembers
roomPermissions
```

A primeira sala de um workspace pode ser a sala padrão/mapa principal.

Use campos como:

```txt
isDefault
kind: "main_map"
```

### Itens e objetos

Separe definições de itens de objetos colocados na sala:

```txt
itemDefinitions
roomObjects
```

`itemDefinitions` descrevem tipos de item, como cadeira, mesa, planta ou quadro.

`roomObjects` representam instâncias concretas posicionadas em uma sala.

Use `state jsonb` para dados flexíveis de objetos.

### Chat

```txt
chatMessages
```

Mensagens podem ser:

* públicas da sala;
* diretas;
* de sistema;
* relacionadas a reuniões.

### Chamadas

```txt
callSessions
callParticipants
```

Use essas entidades para registrar chamadas, participantes e metadados do provider.

### Reuniões

```txt
meetingTemplates
meetingSessions
meetingParticipants
meetingNotes
meetingActionItems
retroCards
```

Essas entidades sustentam fluxos como:

* daily;
* planning;
* retrospectiva;
* review;
* pair programming.

## Convenções de nomenclatura

Use nomes claros em inglês no código.

Prefira:

```txt
userId
playerId
roomId
workspaceId
createdAt
updatedAt
isPublic
positionX
positionY
avatarConfig
```

Evite abreviações legadas como:

```txt
cdplayer
nmroom
fgpublic
vlposx
dtcreate
```

No banco, use uma convenção consistente. Se o schema usar snake_case, mantenha snake_case. Se o código TypeScript usar camelCase, mantenha camelCase.

Não misture estilos sem necessidade.

## Banco de dados e Drizzle

Use Drizzle ORM para schema e queries.

O banco-alvo é PostgreSQL, preferencialmente Neon.

Use:

* `boolean` para flags;
* `timestamp` para datas com horário;
* `jsonb` para configurações flexíveis;
* enums/check constraints quando fizer sentido;
* IDs consistentes em todo o projeto.

Não crie migrations destrutivas sem instrução explícita.

Não persista movimentação contínua de players no PostgreSQL.

## Variáveis de ambiente

Não hardcode secrets.

Quando necessário, use variáveis como:

```txt
DATABASE_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
LIVEKIT_URL
```

Sempre que adicionar uma nova variável, atualize também:

```txt
.env.example
README.md
apps/web/README.md
```

## Next.js

Use App Router.

Prefira server components por padrão.

Use `"use client"` apenas quando necessário, por exemplo:

* PixiJS;
* Zustand;
* LiveKit client;
* interações com teclado/mouse;
* `useRouter`;
* browser APIs.

Mantenha código server-only separado de código client-side.

Não importe SDKs server-side em client components.

## Internacionalização

Use `next-intl` para textos de interface voltados ao usuário.

O português brasileiro (`pt-BR`) é o idioma padrão do projeto. Os arquivos atuais de mensagens são:

```txt
apps/web/messages/pt-BR.json
apps/web/messages/en-US.json
```

Não escreva textos fixos diretamente em páginas ou componentes de UI. Adicione as mensagens aos arquivos de locale e use:

* `getTranslations` em server components;
* `useTranslations` apenas em client components que já precisam de comportamento client-side.

Organize as chaves por domínio ou página e use nomes de chaves em inglês. Textos em português brasileiro devem seguir a norma culta e usar acentuação correta, como `Seleção`, `Configuração`, `Usuário`, `Área`, `Você`, `Repositório` e `Autenticação`.

O idioma padrão deve continuar funcionando sem prefixo obrigatório na URL. Idiomas adicionais podem usar prefixo, como `/en-US/auth/login`.

## Autenticação

Use `better-auth` para autenticação.

O fluxo atual usa e-mail e senha, com rotas em:

```txt
apps/web/app/[locale]/auth/login/page.tsx
apps/web/app/[locale]/auth/register/page.tsx
apps/web/app/api/auth/[...all]/route.ts
```

Arquivos principais:

```txt
apps/web/lib/auth/auth.ts
apps/web/lib/auth/client.ts
apps/web/lib/auth/session.ts
```

Rotas protegidas, como `/workspaces` e `/workspaces/[workspaceSlug]/map`, devem validar sessão server-side. Não proteja rotas sensíveis apenas no client.

Não exponha `BETTER_AUTH_SECRET` no client. Configure `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e `DATABASE_URL` no ambiente local ou de deploy.

## shadcn/ui

Use shadcn/ui quando estiver configurado corretamente.

Se o shadcn/ui ainda não estiver funcionando, use HTML/Tailwind simples e registre a pendência no `TODO.md`.

Não bloqueie features essenciais apenas porque um componente shadcn ainda não existe.

Antes de adicionar componentes shadcn, confira se já existem.

## PixiJS

Use PixiJS para renderizar a sala/mapa.

O renderer inicial deve ser simples:

* criar app Pixi;
* montar canvas;
* desenhar grid;
* desenhar player;
* permitir movimento local;
* limpar recursos no unmount.

Mantenha PixiJS isolado em módulos/classes do renderer.

Não espalhe lógica PixiJS diretamente dentro de componentes React grandes.

## LiveKit

Use LiveKit para chamadas de áudio/vídeo.

Para o MVP, quando solicitado, implemente apenas:

* endpoint server-side para token;
* componente de entrada em sala;
* controles básicos de chamada.

Não implemente WebRTC manualmente.

Não exponha `LIVEKIT_API_SECRET` no cliente.

## Realtime

Não implemente servidor realtime até que seja solicitado.

A presença e movimentação em tempo real devem ser planejadas para WebSocket/Durable Objects ou serviço separado.

Durante o MVP, simule localmente quando necessário.

## Documentação obrigatória

Ao concluir qualquer tarefa significativa, atualize a documentação relevante.

Arquivos principais:

```txt
README.md
TODO.md
docs/README.md
apps/web/README.md
AGENTS.md
```

### README.md da raiz

Deve conter:

* visão geral do projeto;
* objetivo do produto;
* arquitetura geral;
* tecnologias usadas;
* comandos principais;
* variáveis de ambiente;
* status atual;
* próximos passos;
* links para documentação interna.

### TODO.md

Deve funcionar como checklist vivo.

Use:

```md
- [ ] Tarefa pendente
- [x] Tarefa concluída
```

Organize por áreas:

* Foundation;
* Web app;
* i18n;
* Room renderer;
* Player/avatar;
* Workspaces;
* Room editor;
* Database;
* LiveKit/calls;
* Realtime/presence;
* Meeting workflows;
* Documentation;
* Technical debt.

Sempre que alterar código:

* marque tarefas concluídas;
* adicione pendências descobertas;
* registre débitos técnicos;
* não remova pendências relevantes sem justificativa.

### docs/README.md

Deve funcionar como índice técnico.

Inclua documentos existentes e planejados, como:

```txt
architecture.md
database.md
i18n.md
renderer.md
realtime.md
livekit.md
meetings.md
```

Não invente documentos como existentes se eles ainda não foram criados.

### apps/web/README.md

Deve documentar especificamente o app web:

* papel do app dentro do monorepo;
* estrutura de pastas;
* comandos;
* i18n;
* renderer PixiJS;
* rotas;
* variáveis de ambiente;
* limitações atuais.

## Regras de documentação

* Escreva documentação em português brasileiro.
* Use norma culta.
* Use acentuação correta.
* Não invente funcionalidades.
* Marque claramente o que é “planejado”, “futuro” ou “a implementar”.
* Mantenha a documentação coerente com o código real.
* Não use tom publicitário.
* Prefira clareza técnica.

## Estilo de código

Use TypeScript.

Prefira:

* módulos pequenos;
* tipos claros;
* validação com Zod;
* fronteiras bem definidas;
* componentes enxutos;
* nomes explícitos;
* código legível.

Evite:

* `any` sem justificativa;
* componentes enormes;
* duplicação de lógica;
* textos hardcoded;
* mistura de idioma;
* lógica PixiJS espalhada;
* persistência de estado efêmero no banco;
* dependência desnecessária de provider externo no domínio.

## Ordem recomendada do MVP

Implemente de forma incremental:

1. Fundação do app web.
2. i18n com `pt-BR` como padrão.
3. Login mockado.
4. Seleção de workspace/cidade.
5. Mapa principal mockado.
6. Renderer PixiJS local.
7. Movimento local do player.
8. Mocks organizados.
9. Schemas Zod iniciais.
10. Schema Drizzle inicial.
11. Endpoint LiveKit skeleton.
12. Room editor básico.
13. Realtime/presença.
14. Fluxos de reunião.

Não antecipe etapas complexas sem necessidade.

## Comunicação ao finalizar tarefas

Ao finalizar uma tarefa, responda com:

1. resumo do que foi feito;
2. arquivos criados;
3. arquivos alterados;
4. como rodar/testar;
5. documentação atualizada;
6. pendências registradas no `TODO.md`;
7. próximos passos recomendados.

Se algo não pôde ser feito, explique claramente o motivo.
