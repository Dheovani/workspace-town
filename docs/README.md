# Documentação técnica

Esta pasta concentra a documentação técnica do Workspace Town. O README da raiz serve como entrada geral do repositório; aqui ficam notas mais detalhadas sobre arquitetura, domínios e decisões técnicas.

## Documentos atuais

- `README.md`: este índice técnico.

## Documentos planejados

- `architecture.md`: arquitetura geral do monorepo, fronteiras entre app web, renderer, banco, chamadas e realtime.
- `database.md`: modelo persistente, convenções de schema, Drizzle e migrations.
- `renderer.md`: organização do renderer PixiJS, ciclo de vida, grid, objetos e avatar.
- `i18n.md`: estratégia de internacionalização, mensagens e revisão de textos.
- `livekit.md`: integração com LiveKit, token endpoint, permissões e relação com o domínio interno de chamadas.
- `realtime.md`: arquitetura futura para presença, movimento e eventos transientes.
- `meetings.md`: fluxos de daily, planning, retro, review e pair programming.

## Arquitetura em alto nível

O projeto separa responsabilidades em camadas:

- `apps/web`: aplicação Next.js, rotas, UI, server routes, i18n e integração do MVP.
- `apps/web/messages`: arquivos de mensagens por locale.
- `apps/web/i18n`: configuração do `next-intl`, routing e helpers de navegação.
- `apps/web/lib/auth`: configuração server-side e client-side do `better-auth`.
- `apps/web/features/room`: domínio client-side da sala virtual, incluindo componentes, store, renderer e schemas.
- `apps/web/features/workspaces`: mocks e helpers para o fluxo inicial de seleção de workspace/cidade.
- `apps/web/db/schema.ts`: schema Drizzle inicial para dados persistentes.
- `apps/web/app/api/auth/[...all]/route.ts`: rota HTTP do Better Auth.
- LiveKit: provedor de chamadas ao vivo, isolado atrás de entidades internas como `callSessions` e `callParticipants`.
- Realtime server: futuro serviço para presença e movimento. Ainda não implementado.

React deve controlar a interface da aplicação. PixiJS deve controlar a cena da sala dentro do canvas. Movimento local, direção e presença atual são dados efêmeros e não devem ser persistidos diretamente em SQL.

## Internacionalização

O idioma padrão é `pt-BR`. O app também possui mensagens iniciais em `en-US`.

Arquivos principais:

```txt
apps/web/messages/pt-BR.json
apps/web/messages/en-US.json
apps/web/i18n/config.ts
apps/web/i18n/request.ts
apps/web/i18n/navigation.ts
apps/web/middleware.ts
```

O locale padrão não exige prefixo na URL. Rotas como `/auth/login` usam `pt-BR`. Outros idiomas podem usar prefixo, por exemplo `/en-US/auth/login`.

Regras:

- não usar textos fixos diretamente em páginas ou componentes de UI;
- adicionar novas mensagens nos arquivos `messages/*.json`;
- organizar chaves por domínio ou página;
- usar nomes de chaves em inglês;
- escrever textos em português brasileiro com acentuação correta e norma culta.

## Autenticação

O projeto usa `better-auth` com login e cadastro por e-mail e senha. OAuth, recuperação de senha e verificação de e-mail ainda são pendências.

Arquivos principais:

```txt
apps/web/lib/auth/auth.ts
apps/web/lib/auth/client.ts
apps/web/lib/auth/session.ts
apps/web/app/api/auth/[...all]/route.ts
apps/web/features/auth/
```

Rotas protegidas:

- `/workspaces`;
- `/workspaces/[workspaceSlug]/map`.

A proteção acontece server-side por meio da sessão do Better Auth. Usuários sem sessão são redirecionados para `/auth/login`.

O schema Drizzle inclui tabelas iniciais para `better-auth`, mas as migrations ainda precisam ser geradas e aplicadas antes de usar autenticação real contra um banco novo.

## Domínios principais

- Identidade e perfil: `users`, `players`, configuração de avatar.
- Autenticação: `user`, `session`, `account` e `verification` para Better Auth.
- Workspaces: espaços de time/projeto e membros.
- Rooms: salas persistentes, configurações, membros e objetos posicionados.
- Items: definições de itens e instâncias colocadas na sala.
- Chat: mensagens de sala, diretas, sistema ou reunião.
- Calls: sessões de chamada e participantes, com LiveKit como provider atual.
- Meetings: templates, sessões, participantes, notas, action items e retro cards.
- Presence/realtime: planejado para status online e movimento compartilhado.

## Decisões técnicas iniciais

- O MVP começa com sala local e movimento no cliente.
- O fluxo inicial de usuário usa Better Auth: `/auth/login`, `/auth/register`, `/workspaces` e `/workspaces/[workspaceSlug]/map`.
- A rota raiz `/` redireciona para o login.
- O renderer PixiJS fica isolado de componentes React grandes.
- O estado efêmero inicial usa Zustand.
- Schemas de entrada e tipos compartilhados iniciais usam Zod.
- O schema persistente inicial fica em `apps/web/db/schema.ts` para evitar criar pacotes antes de haver necessidade.
- LiveKit é tratado como provider de chamada, não como modelo de domínio completo.
- Workspaces ainda não são carregados do banco; a seleção atual usa dados mockados.

## Como evoluir esta documentação

Ao implementar novas frentes, crie documentos específicos nesta pasta e atualize este índice. Também atualize o `TODO.md` da raiz com tarefas concluídas, pendências novas e débitos técnicos descobertos.
