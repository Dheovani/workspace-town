# TODO

Mapa vivo de pendencias do projeto. Atualize este arquivo sempre que novas alteracoes forem feitas no codigo.

## Foundation

- [x] Criar fundacao inicial do app web para o MVP.
- [x] Substituir a tela inicial do template por uma entrada do produto.
- [x] Criar rota inicial de sala em `/rooms/demo`.
- [x] Separar a feature de sala em `features/room`.
- [ ] Definir padrao final para organizacao entre `apps/web`, `packages/db` e `packages/shared`.
- [ ] Adicionar testes automatizados basicos.

## Web app

- [x] Criar home com link para a sala demo.
- [x] Criar pagina de sala demo.
- [x] Adicionar painel simples de status da sala/player.
- [ ] Criar layout principal do produto com navegacao minima.
- [ ] Criar componentes de UI para painel de participantes, chat e chamada.
- [ ] Revisar responsividade da sala em viewports pequenas.

## Room renderer

- [x] Montar canvas PixiJS em componente client-side.
- [x] Isolar a logica PixiJS em `features/room/renderer`.
- [x] Desenhar grid 2D simples.
- [x] Desenhar objetos estaticos iniciais.
- [x] Desenhar player/avatar basico.
- [x] Limpar o app Pixi no unmount.
- [ ] Adicionar camera ou viewport para salas maiores.
- [ ] Avaliar grid isometrico depois do prototipo top-down.
- [ ] Adicionar colisao basica com objetos bloqueados.
- [ ] Adicionar interacao por ponteiro no canvas.

## Player/avatar

- [x] Criar tipo e schema inicial de `avatarConfig`.
- [x] Criar player local com posicao e direcao.
- [x] Permitir movimento local por teclado.
- [ ] Criar tela ou painel de customizacao de avatar.
- [ ] Adicionar estados visuais de direcao/movimento.
- [ ] Preparar modelo para multiplos players quando houver realtime.

## Room editor

- [x] Criar tipo e schema inicial de `roomObject`.
- [ ] Criar catalogo inicial de item definitions.
- [ ] Criar modo de edicao de sala.
- [ ] Permitir adicionar, mover e remover objetos.
- [ ] Persistir layout da sala no banco.

## Database

- [x] Criar schema Drizzle inicial em `apps/web/db/schema.ts`.
- [x] Modelar entidades persistentes principais.
- [x] Separar entidades de chamadas e reunioes do provider LiveKit.
- [ ] Criar `drizzle.config.ts`.
- [ ] Gerar migrations iniciais.
- [ ] Configurar cliente de banco server-side.
- [ ] Implementar queries iniciais para workspaces, rooms e room objects.
- [ ] Avaliar migrar schema para `packages/db` quando o compartilhamento justificar.

## LiveKit/calls

- [x] Criar endpoint server-side inicial para token LiveKit.
- [x] Usar `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` e `LIVEKIT_URL`.
- [ ] Criar componente de painel de chamada.
- [ ] Conectar UI ao endpoint de token.
- [ ] Adicionar join/leave/mute basicos usando LiveKit.
- [ ] Registrar sessoes de chamada no dominio interno.

## Realtime/presence

- [x] Manter movimento do player como estado local no MVP.
- [ ] Definir arquitetura do servidor realtime.
- [ ] Implementar presenca online.
- [ ] Sincronizar movimento entre participantes.
- [ ] Separar eventos transientes de dados persistentes.

## Meeting workflows

- [x] Criar tipo/schema inicial de meeting type.
- [x] Modelar tabelas iniciais para templates, sessoes, participantes, notas, action items e retro cards.
- [ ] Criar templates iniciais para daily, planning e retro.
- [ ] Criar UI de sessao de reuniao.
- [ ] Criar fluxo de notas e action items.
- [ ] Criar fluxo especifico de retro.

## Documentation

- [x] Atualizar README principal do repositorio.
- [x] Criar TODO vivo do projeto.
- [x] Criar indice tecnico em `docs/README.md`.
- [x] Atualizar README especifico do app web.
- [ ] Criar `docs/architecture.md`.
- [ ] Criar `docs/database.md`.
- [ ] Criar `docs/renderer.md`.
- [ ] Criar `docs/livekit.md`.
- [ ] Criar `docs/realtime.md`.
- [ ] Criar `docs/meetings.md`.

## Technical debt

- [ ] Adicionar testes para schemas Zod.
- [ ] Adicionar testes para rota de token LiveKit.
- [ ] Validar comportamento do renderer com resize.
- [ ] Revisar acessibilidade da pagina de sala.
- [ ] Remover qualquer conteudo remanescente do template que nao represente o produto.
