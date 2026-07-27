# Roadmap do Workspace Town

Este arquivo acompanha a evolução do produto desde a fundação técnica até um workspace virtual multiplayer voltado para equipes profissionais.

Use as checkboxes para tarefas verificáveis:

- `[x]`: concluído e disponível no projeto;
- `[ ]`: pendente, em andamento ou ainda não iniciado.

Os marcos são sequenciais em intenção, mas podem avançar parcialmente em paralelo quando uma dependência técnica justificar. Uma tarefa concluída não significa que a área está finalizada; o critério de saída de cada marco descreve o resultado esperado para o usuário.

## Visão geral

- [x] **Marco 0 — Fundação do MVP:** monorepo, app web, autenticação, banco, i18n e renderer inicial.
- [ ] **Marco 1 — Sala realmente jogável:** movimento sólido, câmera, colisão, avatar e interação local.
- [ ] **Marco 2 — Mundo persistente:** workspaces, membros, salas, layouts e permissões reais.
- [ ] **Marco 3 — Multiplayer e presença:** jogadores conectados e movimento sincronizado.
- [ ] **Marco 4 — Comunicação social:** chat e chamadas espaciais com LiveKit.
- [ ] **Marco 5 — Trabalho colaborativo:** reuniões e objetos úteis para equipes de software.
- [ ] **Marco 6 — Criação e governança:** editor avançado, catálogo, templates e administração.
- [ ] **Marco 7 — Escala e produção:** qualidade, segurança, observabilidade e desempenho.

## Marco 0 — Fundação do MVP

**Status:** concluído.

**Resultado:** o repositório possui uma aplicação web executável, autenticação, banco local, internacionalização, rotas iniciais e uma sala PixiJS local.

### 0.1 Monorepo e aplicação web

- [x] Criar a fundação do app web com Next.js, TypeScript e Bun.
- [x] Organizar o domínio inicial em features.
- [x] Configurar Tailwind CSS e componentes shadcn/ui.
- [x] Redirecionar `/` para `/auth/login`.
- [x] Criar as rotas `/auth/login`, `/auth/register`, `/workspaces`, `/workspaces/[workspaceSlug]/map` e `/rooms/demo`.
- [x] Criar o fluxo inicial Login → seleção de workspace → mapa.
- [x] Proteger as rotas de workspaces por sessão server-side.
- [x] Criar logout na área autenticada.
- [ ] Definir o padrão final de compartilhamento entre `apps/web`, `packages/db` e `packages/shared`.

### 0.2 Internacionalização

- [x] Configurar `next-intl`.
- [x] Definir `pt-BR` como idioma padrão sem prefixo obrigatório.
- [x] Adicionar mensagens iniciais em `pt-BR` e `en-US`.
- [x] Centralizar os textos visíveis das telas atuais.
- [x] Permitir rotas prefixadas, como `/en-US/auth/login`.
- [ ] Criar uma convenção automatizada para impedir textos fixos em novas interfaces.
- [ ] Adicionar seletor de idioma quando a troca de locale fizer parte da experiência.
- [ ] Migrar `middleware.ts` para `proxy.ts` conforme a convenção do Next.js 16.

### 0.3 Autenticação e desenvolvimento local

- [x] Configurar `better-auth` com e-mail e senha.
- [x] Criar login e cadastro com validação Zod.
- [x] Adicionar as tabelas Drizzle do Better Auth.
- [x] Configurar PostgreSQL local com Docker Compose.
- [x] Gerar e aplicar a migration inicial.
- [x] Validar cadastro, login, sessão e logout no banco local.
- [x] Documentar `DATABASE_URL`, `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL`.
- [ ] Implementar recuperação de senha.
- [ ] Implementar verificação de e-mail.
- [ ] Avaliar OAuth depois que o fluxo principal estiver estável.
- [ ] Formalizar a validação das variáveis de ambiente.

### 0.4 Base de domínio e integrações

- [x] Criar schemas Zod iniciais de player, avatar, sala, objetos e tipos de reunião.
- [x] Criar o schema Drizzle dos principais domínios persistentes.
- [x] Separar chamadas e reuniões do provider LiveKit.
- [x] Criar o endpoint server-side inicial para token LiveKit.
- [x] Criar testes automatizados iniciais com o runner nativo do Bun.

## Marco 1 — Sala realmente jogável

**Status:** em andamento.

**Resultado esperado:** uma pessoa consegue entrar na sala, explorar o mapa com movimentação consistente, reconhecer seu avatar e interagir com o ambiente sem atravessar objetos.

**Próxima entrega:** validar o round-trip completo do layout persistente.

### 1.1 Área jogável e câmera

- [x] Isolar o renderer PixiJS da camada React.
- [x] Criar shell de sala em tela cheia com cabeçalho compacto.
- [x] Mover navegação, logout, status e edição para uma sidebar responsiva.
- [x] Fazer o canvas ocupar todo o espaço restante da viewport.
- [x] Separar visualmente os modos de usuário, editor e debug.
- [x] Ocultar o grid técnico no modo usuário e exibi-lo em editor/debug.
- [x] Criar piso, limites e zonas visuais para o mapa inicial.
- [x] Criar HUD contextual com painéis específicos por modo.
- [x] Criar câmera responsiva que acompanha o jogador em mapas maiores.
- [x] Limitar a câmera às bordas do mundo.
- [x] Testar enquadramento, acompanhamento e limites da câmera.
- [x] Adicionar interpolação ao movimento da câmera.
- [ ] Avaliar grid isométrico depois que o protótipo top-down estiver sólido.

### 1.2 Player e movimentação

- [x] Criar player local com posição e direção.
- [x] Permitir movimento por WASD e setas.
- [x] Restringir movimento aos limites da sala.
- [x] Impedir movimento sobre objetos com `blocksMovement`.
- [x] Adicionar interpolação visual entre tiles.
- [x] Adicionar estados visuais de direção e movimento.
- [x] Implementar movimento por clique ou toque com rota que respeita obstáculos.
- [x] Definir toque no mapa como estratégia inicial para dispositivos móveis.
- [x] Criar personagem humanoide em pixel art com poses direcionais e animação de caminhada.
- [x] Criar customização inicial de pele, rosto, cabelo e roupas.
- [x] Aumentar a escala visual e ancorar o personagem pela base dos pés.
- [x] Substituir selects por thumbnails, abas e swatches no editor de avatar.
- [x] Localizar o nome visível do player por i18n.
- [ ] Evoluir o catálogo visual com novos cabelos, rostos, roupas e acessórios.
- [ ] Avaliar spritesheets autorais quando a direção de arte do produto for definida.

### 1.3 Objetos e editor local

- [x] Desenhar objetos estáticos no PixiJS.
- [x] Criar catálogo inicial de mesa, cadeira, quadro e planta.
- [x] Adicionar interação por ponteiro em tiles e objetos.
- [x] Permitir adicionar, mover, girar e remover objetos.
- [x] Desabilitar movimento do player durante a edição.
- [x] Criar API autenticada para carregar e salvar layouts.
- [x] Criar seed idempotente de salas, itens e objetos iniciais.
- [x] Melhorar móveis procedurais com silhuetas reconhecíveis, sombras e hover.
- [x] Ordenar player e objetos por profundidade baseada na posição vertical.
- [ ] Validar o round-trip completo de layout com migration e seed.
- [ ] Adicionar undo e redo ao editor.
- [ ] Preparar objetos maiores que um único tile.
- [ ] Expandir o catálogo de ambiente com pisos, paredes, sofás, divisórias e decoração.
- [ ] Modelar footprints de colisão para móveis maiores que um tile.

### Critério de saída do Marco 1

- [x] O jogador percorre uma sala completa sem atravessar limites ou objetos bloqueantes.
- [x] Movimento e câmera possuem transições visuais adequadas para uma experiência de jogo.
- [ ] O layout editado de uma sala autenticada permanece após recarregar a página.
- [x] A interação principal funciona com teclado, ponteiro e toque.

## Marco 2 — Mundo persistente

**Status:** planejado.

**Resultado esperado:** contas reais entram apenas nos workspaces permitidos, carregam suas salas e preservam configurações, objetos e identidade do player.

### 2.1 Workspaces e membros

- [x] Criar mocks tipados para validar o fluxo inicial.
- [ ] Substituir a listagem mockada por queries de workspaces reais.
- [ ] Implementar membership de usuários em workspaces.
- [ ] Implementar papéis e permissões iniciais.
- [ ] Carregar a sala padrão real de cada workspace.
- [ ] Criar onboarding que associe novos usuários a um workspace.

### 2.2 Salas e layouts

- [x] Modelar `rooms`, `roomSettings`, `roomMembers`, `itemDefinitions` e `roomObjects`.
- [x] Implementar queries iniciais de salas e objetos.
- [x] Persistir layouts pela API autenticada.
- [ ] Validar acesso à sala pelo membership do workspace.
- [ ] Carregar dimensões e configurações reais da sala no renderer.
- [ ] Criar navegação entre múltiplas salas.
- [ ] Persistir pontos de entrada e portais entre salas.

### 2.3 Identidade e inventário

- [x] Separar conta de usuário e identidade jogável do player.
- [ ] Persistir configuração de avatar.
- [ ] Criar inventário ou disponibilidade de itens por workspace.
- [ ] Carregar catálogo de itens a partir do banco.
- [ ] Definir ownership e regras de uso dos objetos.

### Critério de saída do Marco 2

- [ ] Um usuário autenticado visualiza somente seus workspaces e salas permitidas.
- [ ] Workspace, sala, avatar e layout são carregados do PostgreSQL sem depender de mocks.
- [ ] Alterações persistentes respeitam membership e permissões server-side.

## Marco 3 — Multiplayer e presença

**Status:** planejado.

**Resultado esperado:** várias pessoas compartilham a mesma sala e enxergam entradas, saídas e movimentos umas das outras com baixa latência.

### 3.1 Arquitetura realtime

- [ ] Definir o serviço realtime e a estratégia de deploy.
- [ ] Documentar o protocolo de presença e movimento.
- [ ] Separar eventos transientes de dados persistentes.
- [ ] Definir modelo autoritativo para validar movimento.
- [ ] Definir reconexão, heartbeat e expiração de presença.

### 3.2 Sincronização da sala

- [ ] Publicar entrada e saída de participantes.
- [ ] Sincronizar posição, direção e estado de movimento.
- [ ] Renderizar múltiplos players no PixiJS.
- [ ] Interpolar movimentos remotos.
- [ ] Sincronizar alterações de objetos feitas pelo editor.
- [ ] Resolver conflitos de edição concorrente.

### 3.3 Confiabilidade

- [ ] Tratar reconexão sem duplicar participantes.
- [ ] Impedir movimentos inválidos no servidor.
- [ ] Adicionar métricas de latência e conexões.
- [ ] Criar testes de integração e carga do protocolo realtime.

### Critério de saída do Marco 3

- [ ] Dois ou mais usuários compartilham uma sala e veem movimentos consistentes.
- [ ] Reconexões preservam a experiência sem duplicar presença.
- [ ] Movimento contínuo não é persistido no PostgreSQL.

## Marco 4 — Comunicação social

**Status:** planejado.

**Resultado esperado:** participantes conversam por texto, áudio e vídeo dentro do contexto espacial da sala.

### 4.1 Chat

- [x] Modelar `chatMessages`.
- [ ] Criar chat público da sala.
- [ ] Criar mensagens diretas.
- [ ] Adicionar mensagens de sistema para entradas, saídas e reuniões.
- [ ] Definir histórico, paginação e moderação.

### 4.2 LiveKit e chamadas

- [x] Criar endpoint inicial para geração de token LiveKit.
- [ ] Criar painel de participantes e chamada.
- [ ] Conectar a UI ao endpoint de token.
- [ ] Implementar entrada, saída, mute, câmera e compartilhamento de tela.
- [ ] Implementar áudio por proximidade ou zonas de conversa.
- [ ] Registrar `callSessions` e `callParticipants` no domínio interno.
- [ ] Tratar reconexão e troca de sala durante uma chamada.

### Critério de saída do Marco 4

- [ ] Usuários conversam por texto dentro da sala.
- [ ] Usuários iniciam áudio ou vídeo sem sair do mapa.
- [ ] Chamadas respeitam o contexto espacial sem acoplar o domínio ao LiveKit.

## Marco 5 — Trabalho colaborativo

**Status:** planejado.

**Resultado esperado:** o ambiente deixa de ser apenas social e passa a sustentar rotinas reais de equipes de software.

### 5.1 Reuniões

- [x] Modelar templates, sessões, participantes, notas, action items e retro cards.
- [ ] Criar templates iniciais de daily, planning e retrospectiva.
- [ ] Criar UI de sessão de reunião.
- [ ] Criar notas colaborativas e action items.
- [ ] Criar fluxo específico de retrospectiva.
- [ ] Adicionar review e pair programming.
- [ ] Relacionar reuniões a salas, objetos e chamadas.

### 5.2 Objetos profissionais

- [ ] Criar objetos interativos para quadro, documento, link e agenda.
- [ ] Criar zonas de reunião dentro das salas.
- [ ] Permitir abrir ferramentas sem abandonar a experiência espacial.
- [ ] Avaliar integrações com repositórios, calendários e ferramentas de gestão.
- [ ] Definir permissões para conteúdo profissional sensível.

### Critério de saída do Marco 5

- [ ] Uma equipe executa ao menos uma daily e uma retrospectiva completas dentro do produto.
- [ ] Notas e action items permanecem associados à reunião.
- [ ] Objetos da sala funcionam como pontos de acesso às ferramentas de trabalho.

## Marco 6 — Criação e governança

**Status:** planejado.

**Resultado esperado:** administradores e membros autorizados constroem espaços reutilizáveis sem alterar código.

### 6.1 Editor avançado

- [ ] Adicionar seleção múltipla, copiar, colar, undo e redo.
- [ ] Adicionar suporte a objetos de múltiplos tiles.
- [ ] Criar camadas, pisos, paredes e zonas.
- [ ] Criar portais e pontos de spawn.
- [ ] Validar colisões e acessibilidade durante a edição.
- [ ] Criar modo de pré-visualização antes de publicar.

### 6.2 Catálogo e templates

- [ ] Persistir catálogo de itens.
- [ ] Criar templates de salas e workspaces.
- [ ] Criar itens específicos para reuniões e trabalho técnico.
- [ ] Definir versionamento e publicação de layouts.
- [ ] Avaliar inventário, favoritos e itens customizados.

### 6.3 Administração

- [ ] Criar papéis de owner, admin, editor e member.
- [ ] Criar controles de acesso por workspace e sala.
- [ ] Registrar auditoria de mudanças importantes.
- [ ] Criar moderação de chat, conteúdo e participantes.

### Critério de saída do Marco 6

- [ ] Um administrador cria e publica um workspace utilizável sem editar código.
- [ ] Permissões controlam quem acessa, edita e administra cada espaço.
- [ ] Templates permitem repetir configurações de trabalho aprovadas.

## Marco 7 — Escala e produção

**Status:** planejado.

**Resultado esperado:** o produto opera com segurança, desempenho previsível e ferramentas suficientes para diagnóstico e evolução contínua.

### 7.1 Qualidade e testes

- [x] Adicionar testes unitários para a câmera.
- [x] Adicionar testes unitários para interpolação visual independente da taxa de quadros.
- [x] Adicionar testes unitários para orientação e estado visual do avatar.
- [x] Adicionar testes unitários e de integração local para movimentação e colisão.
- [x] Adicionar testes para pathfinding e controle de rotas locais.
- [ ] Adicionar testes para schemas Zod.
- [ ] Adicionar testes para autenticação e rotas protegidas.
- [ ] Adicionar testes para persistência de layouts.
- [ ] Adicionar testes para o endpoint LiveKit.
- [ ] Adicionar testes de UI para fluxos críticos.
- [ ] Adicionar testes end-to-end de login → workspace → sala.
- [ ] Revisar acessibilidade das páginas e controles da sala.

### 7.2 Desempenho e observabilidade

- [ ] Medir FPS, tempo de carregamento e uso de memória do renderer.
- [ ] Implementar culling ou divisão espacial para mapas maiores.
- [ ] Otimizar carregamento de sprites e assets.
- [ ] Adicionar logs estruturados, métricas e rastreamento de erros.
- [ ] Definir limites e testes de carga para realtime e chamadas.

### 7.3 Segurança e operação

- [ ] Formalizar validação de ambiente e secrets.
- [ ] Remover fallback local de `DATABASE_URL` do código.
- [ ] Definir nomes curtos para constraints que excedem 63 caracteres no PostgreSQL.
- [ ] Revisar autorização server-side em todas as APIs.
- [ ] Definir backup, recuperação e retenção de dados.
- [ ] Criar estratégia de deploy, ambientes e CI.
- [ ] Reavaliar `@neondatabase/serverless` após definir o ambiente de produção.

### 7.4 Documentação e manutenção

- [x] Manter README geral, README do app web e índice técnico.
- [x] Criar `docs/database.md` e `docs/renderer.md`.
- [ ] Criar `docs/architecture.md`.
- [ ] Criar `docs/i18n.md`.
- [ ] Criar `docs/livekit.md`.
- [ ] Criar `docs/realtime.md`.
- [ ] Criar `docs/meetings.md`.
- [ ] Remover conteúdo remanescente do template que não representa o produto.
- [ ] Remover o campo derivado `isEditing` após todos os consumidores migrarem para `roomMode`.

### Critério de saída do Marco 7

- [ ] Os fluxos críticos possuem testes automatizados e monitoramento.
- [ ] O renderer e o realtime operam dentro de metas de desempenho definidas.
- [ ] Deploy, segurança, backup e resposta a incidentes estão documentados.
