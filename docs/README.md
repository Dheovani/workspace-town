# Documentacao tecnica

Esta pasta concentra a documentacao tecnica do Workspace Town. O README da raiz serve como entrada geral do repositorio; aqui ficam notas mais detalhadas sobre arquitetura, dominios e decisoes tecnicas.

## Documentos atuais

- `README.md`: este indice tecnico.

## Documentos planejados

- `architecture.md`: arquitetura geral do monorepo, fronteiras entre app web, renderer, banco, chamadas e realtime.
- `database.md`: modelo persistente, convencoes de schema, Drizzle e migrations.
- `renderer.md`: organizacao do renderer PixiJS, ciclo de vida, grid, objetos e avatar.
- `livekit.md`: integracao com LiveKit, token endpoint, permissoes e relacao com o dominio interno de chamadas.
- `realtime.md`: arquitetura futura para presenca, movimento e eventos transientes.
- `meetings.md`: fluxos de daily, planning, retro, review e pair programming.

## Arquitetura em alto nivel

O projeto separa responsabilidades em camadas:

- `apps/web`: aplicacao Next.js, rotas, UI, server routes e integracao do MVP.
- `apps/web/features/room`: dominio client-side da sala virtual, incluindo componentes, store, renderer e schemas.
- `apps/web/db/schema.ts`: schema Drizzle inicial para dados persistentes.
- LiveKit: provedor de chamadas ao vivo, isolado atras de entidades internas como `callSessions` e `callParticipants`.
- Realtime server: futuro servico para presenca e movimento. Ainda nao implementado.

React deve controlar a interface da aplicacao. PixiJS deve controlar a cena da sala dentro do canvas. Movimento local, direcao e presenca atual sao dados efemeros e nao devem ser persistidos diretamente em SQL.

## Dominios principais

- Identidade e perfil: `users`, `players`, configuracao de avatar.
- Workspaces: espacos de time/projeto e membros.
- Rooms: salas persistentes, configuracoes, membros e objetos posicionados.
- Items: definicoes de itens e instancias colocadas na sala.
- Chat: mensagens de sala, diretas, sistema ou reuniao.
- Calls: sessoes de chamada e participantes, com LiveKit como provider atual.
- Meetings: templates, sessoes, participantes, notas, action items e retro cards.
- Presence/realtime: planejado para status online e movimento compartilhado.

## Decisoes tecnicas iniciais

- O MVP comeca com sala local e movimento no cliente.
- O renderer PixiJS fica isolado de componentes React grandes.
- O estado efemero inicial usa Zustand.
- Schemas de entrada e tipos compartilhados iniciais usam Zod.
- O schema persistente inicial fica em `apps/web/db/schema.ts` para evitar criar pacotes antes de haver necessidade.
- LiveKit e tratado como provider de chamada, nao como modelo de dominio completo.

## Como evoluir esta documentacao

Ao implementar novas frentes, crie documentos especificos nesta pasta e atualize este indice. Tambem atualize o `TODO.md` da raiz com tarefas concluidas, pendencias novas e debitos tecnicos descobertos.
