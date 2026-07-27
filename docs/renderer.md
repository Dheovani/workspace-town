# Renderer da sala

Este documento descreve a organização atual do renderer PixiJS e sua integração com a interface React.

## Responsabilidades

O PixiJS controla a cena da sala:

- grid 2D;
- objetos posicionados;
- avatar local;
- desenho e destaque de seleção;
- eventos de ponte para cliques em tiles e objetos.

O React controla a interface:

- painel do editor;
- catálogo de itens;
- botões de rotação e remoção;
- ativação do modo de edição;
- composição da página.

O Zustand mantém o estado local compartilhado entre essas camadas. O renderer não importa nem acessa o store diretamente.

## Arquivos principais

```txt
apps/web/features/room/
  components/room-canvas.tsx
  renderer/room-renderer.ts
  stores/room-store.ts
  types.ts

apps/web/features/room-editor/
  catalog/item-definitions.ts
  components/room-editor-panel.tsx
```

`room-canvas.tsx` é a ponte client-side. Ele cria o renderer, envia atualizações de player, objetos e seleção e converte eventos do renderer em ações do store.

`room-renderer.ts` não contém JSX nem regras de persistência. A classe cria o `Application`, desenha as camadas e destrói os recursos no unmount.

## Camadas da cena

A cena atual usa três containers, nesta ordem:

1. grid;
2. objetos;
3. player.

Objetos selecionados recebem um contorno visual. Mesa, cadeira, quadro e planta possuem formas simples distintas, sem assets externos nesta etapa.

## Editor local

O editor atual funciona apenas em memória:

- o usuário ativa o modo de edição;
- seleciona um item do catálogo e clica em um tile vazio para adicioná-lo;
- seleciona um objeto existente no canvas;
- clica em outro tile vazio para movê-lo;
- pode girar ou remover o objeto selecionado pelo painel.

Enquanto o editor está ativo, o movimento do avatar por teclado é desabilitado para evitar conflito de interação. O store impede que dois objetos ocupem o mesmo tile.

## Persistência e realtime

O layout editado ainda não é enviado ao PostgreSQL. Persistência de `roomObjects` será implementada em uma etapa futura.

Posição atual do avatar e demais eventos de movimento continuam efêmeros e não devem ser persistidos continuamente no banco relacional. Multiplayer e presença dependem do futuro serviço realtime.

## Limitações atuais

- não há câmera para mapas maiores;
- não há seleção por arraste;
- não há undo/redo;
- objetos ocupam um único tile;
- colisão do player com objetos ainda não foi implementada;
- o catálogo ainda é local e fixo;
- alterações são perdidas ao recarregar a página.
