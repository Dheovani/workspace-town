# Renderer da sala

Este documento descreve a organização atual do renderer PixiJS e sua integração com a interface React.

## Responsabilidades

O PixiJS controla a cena da sala:

- grid 2D;
- objetos posicionados;
- avatar local;
- desenho e destaque de seleção;
- eventos de ponteiro para cliques em tiles e objetos.

O React controla a interface:

- painel do editor;
- catálogo de itens;
- botões de rotação e remoção;
- ativação do modo de edição;
- composição do shell da sala, incluindo cabeçalho e sidebar.

O Zustand mantém o estado local compartilhado entre essas camadas. O renderer não importa nem acessa o store diretamente.

## Arquivos principais

```txt
apps/web/features/room/
  components/room-canvas.tsx
  components/room-shell.tsx
  domain/player-movement.ts
  domain/player-movement.test.ts
  domain/find-room-path.ts
  domain/find-room-path.test.ts
  navigation/room-navigation-controller.ts
  navigation/room-navigation-controller.test.ts
  renderer/avatar-visual-state.ts
  renderer/avatar-visual-state.test.ts
  renderer/camera.ts
  renderer/camera.test.ts
  renderer/interpolation.ts
  renderer/interpolation.test.ts
  renderer/player-avatar-renderer.ts
  renderer/room-renderer.ts
  stores/room-store.ts
  stores/room-store.test.ts
  types.ts

apps/web/features/room-editor/
  catalog/item-definitions.ts
  components/room-editor-panel.tsx
```

`room-canvas.tsx` é a ponte client-side. Ele cria o renderer, envia atualizações de player, objetos e seleção e converte eventos do renderer em ações do store.

`room-renderer.ts` não contém JSX nem regras de persistência. A classe cria o `Application`, desenha as camadas e destrói os recursos no unmount.

`room-shell.tsx` não participa da renderização da cena. Ele organiza a experiência em tela cheia: cabeçalho compacto, canvas flexível e sidebar fixa no desktop ou sobreposta em telas menores.

O estado local distingue `user`, `editor` e `debug`. No modo usuário, a camada de grid continua recebendo interação, mas suas linhas não são desenhadas. Editor e debug usam overlays de grid com tratamentos visuais diferentes.

## Camadas da cena

A cena atual usa três containers, nesta ordem:

1. grid;
2. objetos;
3. player.

Objetos selecionados recebem um contorno visual. Mesa, cadeira, quadro e planta possuem formas simples distintas, sem assets externos nesta etapa.

As camadas pertencem a um container de mundo comum. Um `ResizeObserver` atualiza a câmera quando o espaço disponível muda.

O cálculo da câmera fica em `camera.ts` e não depende do PixiJS. Quando o mapa cabe na viewport, ele é centralizado e ampliado proporcionalmente. Quando é maior, os tiles preservam ao menos o tamanho natural, a câmera acompanha o centro do jogador e seu deslocamento é limitado às bordas do mundo.

O mapa local atual possui `32 x 20` tiles para exercitar esse comportamento em desktop e viewports menores. Os testes em `camera.test.ts` cobrem enquadramento, acompanhamento e limites.

## Interpolação visual

O store mantém a posição lógica inteira do player e aplica colisão imediatamente. O renderer mantém, separadamente, uma posição visual em pixels. A cada tick do PixiJS, `interpolation.ts` aproxima a posição visual do tile lógico usando amortecimento exponencial independente da taxa de quadros.

A câmera usa a posição visual intermediária como alvo. Assim, player e mundo se deslocam juntos sem alterar as regras discretas de colisão ou persistir coordenadas transitórias. Os testes validam progressão, ausência de overshoot, equivalência entre intervalos de frame e snap no destino.

## Avatar local

`player-avatar-renderer.ts` encapsula os elementos PixiJS do avatar e expõe um único container para a cena. O personagem atual é humanoide e usa uma composição de pixel art em camadas para cabeça, rosto, cabelo, tronco, braços, pernas, roupas, calçados e sombra.

O renderer desenha poses frontal, traseira e lateral, espelha a pose lateral para a esquerda e alterna braços e pernas durante o deslocamento. `avatar-visual-state.ts` calcula a pose de caminhada e detecta quando a posição visual ainda está em trânsito. Essas regras são puras e testadas sem inicializar PixiJS. A separação permite reutilizar uma instância do renderer para cada participante quando o multiplayer for implementado.

A posição PixiJS do player representa a base dos pés, enquanto a composição do personagem se estende para cima e pode ultrapassar os limites visuais de um tile. O nome exibido é fornecido pela camada React com `next-intl`, sem depender do valor técnico armazenado no mock.

O label local usa texto pequeno com contorno, sem a antiga tarja escura. O preview da HUD é um componente React visual e não participa da cena nem das regras de movimento.

O painel React em `features/player/components/avatar-customizer-panel.tsx` altera tom de pele, penteado, expressão, modelo e cores das roupas no store. O `RoomCanvas` encaminha o player atualizado ao renderer, que redesenha a mesma instância do avatar. A configuração é local neste marco e ainda não é persistida.

## Movimento e colisão

O PixiJS não decide se um movimento é válido. `domain/player-movement.ts` recebe sala, player, objetos, catálogo e tentativa de movimento. A função atualiza a direção do avatar, mas mantém sua posição quando o destino está fora da sala ou contém um objeto bloqueante.

O campo `state.blocksMovement` de uma instância pode sobrescrever a definição do catálogo. Objetos sem definição conhecida são bloqueantes por segurança. Os testes cobrem movimento livre, limites da sala, objetos bloqueantes, objetos atravessáveis e overrides. A integração do store também verifica a colisão com o mapa demo e a proteção do tile ocupado pelo player durante a edição.

## Navegação por clique ou toque

`find-room-path.ts` encapsula o PathFinding.js e calcula uma rota A\* ortogonal entre o player e o tile selecionado. A matriz considera limites, catálogo de itens e overrides de `blocksMovement`. O ponto inicial não é devolvido como passo, e destinos bloqueados ou inacessíveis resultam em rota vazia.

`room-navigation-controller.ts` percorre a rota em passos discretos enviados ao store. Teclado e modo de edição cancelam o percurso. Cada passo é validado novamente, portanto um objeto adicionado durante a navegação interrompe o movimento. O renderer recebe apenas o destino para desenhar um marcador no mapa.

Eventos `pointertap` do PixiJS atendem mouse, caneta e toque pela mesma fronteira. Essa é a estratégia mobile inicial; controles direcionais dedicados continuam desnecessários enquanto o fluxo por toque for suficiente.

## Editor de sala

O editor mantém uma cópia local no Zustand durante a interação:

- o usuário ativa o modo de edição;
- seleciona um item do catálogo e clica em um tile vazio para adicioná-lo;
- seleciona um objeto existente no canvas;
- clica em outro tile vazio para movê-lo;
- pode girar ou remover o objeto selecionado pelo painel.

Enquanto o editor está ativo, o movimento do avatar por teclado é desabilitado para evitar conflito de interação. O store impede que dois objetos ocupem o mesmo tile e não permite posicionar um objeto sobre o player.

## Ambiente e profundidade

O piso, os limites e as zonas visuais são desenhados em uma camada de ambiente. Eles não alteram colisão nem persistência. Móveis continuam sendo `roomObjects`, mas cada tipo possui uma silhueta procedural própria, sombra, estado de hover e destaque de seleção.

A cena local usa `24 x 16` tiles e concentra entrada, estações de trabalho e daily próximas ao spawn. O piso usa um mosaico de baixo contraste em vez de faixas horizontais. Os nomes das zonas são recebidos como mensagens localizadas nas opções de criação do renderer.

Objetos e player compartilham uma camada ordenável. O `zIndex` usa a coordenada vertical da base de cada entidade, permitindo que o personagem passe visualmente à frente ou atrás dos móveis conforme se movimenta.

## Persistência e realtime

No mapa autenticado, o painel carrega o layout da sala padrão por uma API server-side e permite salvar ou recarregar os objetos. A gravação substitui os `roomObjects` da sala em uma transação.

A rota `/rooms/demo` continua exclusivamente local. Para habilitar persistência nos mapas autenticados, é necessário aplicar as migrations e executar o seed.

Posição atual do avatar e demais eventos de movimento continuam efêmeros e não devem ser persistidos continuamente no banco relacional. Multiplayer e presença dependem do futuro serviço realtime.

## Limitações atuais

- o catálogo inicial de cabelo, rosto e roupas ainda é pequeno e não possui persistência;
- a direção de arte definitiva e eventuais spritesheets autorais ainda não foram definidos;
- não há seleção por arraste;
- não há undo/redo;
- objetos ocupam um único tile;
- o catálogo ainda é local e fixo;
- membership e permissões específicas de edição por workspace ainda não foram implementadas.
