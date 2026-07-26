# TODO

Mapa vivo de pendências do projeto. Atualize este arquivo sempre que novas alterações forem feitas no código.

## Foundation

- [x] Criar fundação inicial do app web para o MVP.
- [x] Substituir a tela inicial do template por uma entrada do produto.
- [x] Criar rota inicial de sala em `/rooms/demo`.
- [x] Separar a feature de sala em `features/room`.
- [x] Criar fluxo inicial mockado Login -> seleção de workspace -> mapa principal.
- [x] Configurar i18n inicial com `pt-BR` como idioma padrão.
- [x] Substituir login mockado por autenticação com `better-auth`.
- [x] Adicionar PostgreSQL local via Docker Compose.
- [ ] Definir padrão final para organização entre `apps/web`, `packages/db` e `packages/shared`.
- [ ] Adicionar testes automatizados básicos.

## Web app

- [x] Criar entrada inicial do app.
- [x] Redirecionar `/` para `/auth/login`.
- [x] Criar tela de login real em `/auth/login`.
- [x] Criar tela de cadastro real em `/auth/register`.
- [x] Criar tela de seleção de workspaces em `/workspaces`.
- [x] Criar mapa principal por workspace em `/workspaces/[workspaceSlug]/map`.
- [x] Criar página de sala demo.
- [x] Adicionar painel simples de status da sala/player.
- [ ] Criar layout principal do produto com navegação mínima.
- [x] Proteger `/workspaces` e `/workspaces/[workspaceSlug]/map` por sessão server-side.
- [x] Adicionar ação de logout na área autenticada.
- [ ] Criar componentes de UI para painel de participantes, chat e chamada.
- [ ] Revisar responsividade da sala em viewports pequenas.

## Internacionalização

- [x] Instalar e configurar `next-intl`.
- [x] Criar `messages/pt-BR.json`.
- [x] Criar `messages/en-US.json`.
- [x] Mover textos principais das telas atuais para arquivos de mensagens.
- [x] Configurar locale padrão `pt-BR` sem prefixo obrigatório na URL.
- [x] Permitir rotas prefixadas para outros idiomas, como `/en-US/auth/login`.
- [ ] Adicionar teste automatizado para garantir que páginas principais não usem textos fixos.
- [ ] Criar convenção de revisão para novas chaves de tradução.
- [ ] Adicionar seletor de idioma quando houver necessidade de UI pública para troca de locale.
- [ ] Avaliar migração de `middleware.ts` para `proxy.ts` no Next.js 16.

## Workspaces

- [x] Criar mocks tipados de workspaces/cidades.
- [x] Listar workspaces com nome, descrição, membros e salas mockados.
- [x] Navegar da seleção para o mapa do workspace.
- [ ] Persistir workspaces reais no banco.
- [ ] Criar permissão e membership reais por workspace.
- [ ] Carregar sala padrão real do workspace.

## Autenticação

- [x] Instalar e configurar `better-auth`.
- [x] Criar rota `app/api/auth/[...all]/route.ts`.
- [x] Criar formulários reais de login e cadastro com Zod.
- [x] Adicionar tabelas Drizzle iniciais para `better-auth`.
- [x] Adicionar `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` aos exemplos de ambiente.
- [x] Gerar migration inicial para tabelas de autenticação.
- [ ] Aplicar migrations em um banco PostgreSQL configurado.
- [ ] Iniciar Docker Desktop/engine local e validar `bun run db:up`.
- [ ] Validar cadastro, login, sessão server-side e logout usando o PostgreSQL local.
- [ ] Implementar recuperação de senha.
- [ ] Implementar verificação de e-mail.
- [ ] Avaliar OAuth quando o fluxo principal estiver estável.
- [ ] Criar onboarding real após cadastro.

## Room renderer

- [x] Montar canvas PixiJS em componente client-side.
- [x] Isolar a lógica PixiJS em `features/room/renderer`.
- [x] Desenhar grid 2D simples.
- [x] Desenhar objetos estáticos iniciais.
- [x] Desenhar player/avatar básico.
- [x] Limpar o app Pixi no unmount.
- [ ] Adicionar câmera ou viewport para salas maiores.
- [ ] Avaliar grid isométrico depois do protótipo top-down.
- [ ] Adicionar colisão básica com objetos bloqueados.
- [ ] Adicionar interação por ponteiro no canvas.

## Player/avatar

- [x] Criar tipo e schema inicial de `avatarConfig`.
- [x] Criar player local com posição e direção.
- [x] Permitir movimento local por teclado.
- [ ] Criar tela ou painel de customização de avatar.
- [ ] Adicionar estados visuais de direção/movimento.
- [ ] Preparar modelo para múltiplos players quando houver realtime.

## Room editor

- [x] Criar tipo e schema inicial de `roomObject`.
- [ ] Criar catálogo inicial de item definitions.
- [ ] Criar modo de edição de sala.
- [ ] Permitir adicionar, mover e remover objetos.
- [ ] Persistir layout da sala no banco.

## Database

- [x] Criar schema Drizzle inicial em `apps/web/db/schema.ts`.
- [x] Modelar entidades persistentes principais.
- [x] Separar entidades de chamadas e reuniões do provider LiveKit.
- [x] Criar `drizzle.config.ts`.
- [x] Gerar migration inicial.
- [x] Configurar PostgreSQL local para desenvolvimento.
- [x] Documentar fluxo local de banco e migrations.
- [ ] Aplicar migration inicial em PostgreSQL.
- [ ] Validar a migration inicial contra o PostgreSQL local depois que o Docker engine estiver ativo.
- [ ] Configurar cliente de banco server-side.
- [ ] Implementar queries iniciais para workspaces, rooms e room objects.
- [ ] Avaliar migrar schema para `packages/db` quando o compartilhamento justificar.

## LiveKit/calls

- [x] Criar endpoint server-side inicial para token LiveKit.
- [x] Usar `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` e `LIVEKIT_URL`.
- [ ] Criar componente de painel de chamada.
- [ ] Conectar UI ao endpoint de token.
- [ ] Adicionar join/leave/mute básicos usando LiveKit.
- [ ] Registrar sessões de chamada no domínio interno.

## Realtime/presence

- [x] Manter movimento do player como estado local no MVP.
- [ ] Definir arquitetura do servidor realtime.
- [ ] Implementar presença online.
- [ ] Sincronizar movimento entre participantes.
- [ ] Separar eventos transientes de dados persistentes.

## Meeting workflows

- [x] Criar tipo/schema inicial de meeting type.
- [x] Modelar tabelas iniciais para templates, sessões, participantes, notas, action items e retro cards.
- [ ] Criar templates iniciais para daily, planning e retro.
- [ ] Criar UI de sessão de reunião.
- [ ] Criar fluxo de notas e action items.
- [ ] Criar fluxo específico de retro.

## Documentation

- [x] Atualizar README principal do repositório.
- [x] Criar TODO vivo do projeto.
- [x] Criar índice técnico em `docs/README.md`.
- [x] Atualizar README específico do app web.
- [x] Registrar regras iniciais de i18n no `AGENTS.md`.
- [x] Criar `docs/database.md`.
- [ ] Criar `docs/architecture.md`.
- [ ] Criar `docs/renderer.md`.
- [ ] Criar `docs/livekit.md`.
- [ ] Criar `docs/realtime.md`.
- [ ] Criar `docs/meetings.md`.
- [ ] Criar `docs/i18n.md`.

## Technical debt

- [ ] Adicionar testes para schemas Zod.
- [ ] Adicionar testes para rota de token LiveKit.
- [ ] Validar comportamento do renderer com resize.
- [ ] Revisar acessibilidade da página de sala.
- [ ] Remover qualquer conteúdo remanescente do template que não represente o produto.
- [ ] Adicionar testes do fluxo de autenticação, seleção de workspace e mapa.
- [ ] Remover fallback local de `DATABASE_URL` do código quando a validação de ambiente estiver formalizada.
