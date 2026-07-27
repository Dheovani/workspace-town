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
  renderer/camera.ts
  renderer/camera.test.ts
  renderer/interpolation.ts
  renderer/interpolation.test.ts
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

## Movimento e colisão

O PixiJS não decide se um movimento é válido. `domain/player-movement.ts` recebe sala, player, objetos, catálogo e tentativa de movimento. A função atualiza a direção do avatar, mas mantém sua posição quando o destino está fora da sala ou contém um objeto bloqueante.

O campo `state.blocksMovement` de uma instância pode sobrescrever a definição do catálogo. Objetos sem definição conhecida são bloqueantes por segurança. Os testes cobrem movimento livre, limites da sala, objetos bloqueantes, objetos atravessáveis e overrides. A integração do store também verifica a colisão com o mapa demo e a proteção do tile ocupado pelo player durante a edição.

## Editor de sala

O editor mantém uma cópia local no Zustand durante a interação:

- o usuário ativa o modo de edição;
- seleciona um item do catálogo e clica em um tile vazio para adicioná-lo;
- seleciona um objeto existente no canvas;
- clica em outro tile vazio para movê-lo;
- pode girar ou remover o objeto selecionado pelo painel.

Enquanto o editor está ativo, o movimento do avatar por teclado é desabilitado para evitar conflito de interação. O store impede que dois objetos ocupem o mesmo tile e não permite posicionar um objeto sobre o player.

## Persistência e realtime

No mapa autenticado, o painel carrega o layout da sala padrão por uma API server-side e permite salvar ou recarregar os objetos. A gravação substitui os `roomObjects` da sala em uma transação.

A rota `/rooms/demo` continua exclusivamente local. Para habilitar persistência nos mapas autenticados, é necessário aplicar as migrations e executar o seed.

Posição atual do avatar e demais eventos de movimento continuam efêmeros e não devem ser persistidos continuamente no banco relacional. Multiplayer e presença dependem do futuro serviço realtime.

## Limitações atuais

- o avatar ainda não possui sprites ou animações direcionais;
- não há seleção por arraste;
- não há undo/redo;
- objetos ocupam um único tile;
- o catálogo ainda é local e fixo;
- membership e permissões específicas de edição por workspace ainda não foram implementadas.
