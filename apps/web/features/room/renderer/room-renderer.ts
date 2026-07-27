import {
  Application,
  Container,
  Graphics,
  type Renderer,
  type Ticker,
} from "pixi.js";
import type { Player, Room, RoomMode, RoomObject } from "../types";
import { isVisualPositionMoving } from "./avatar-visual-state";
import { calculateCameraTransform } from "./camera";
import { dampValue } from "./interpolation";
import { PlayerAvatarRenderer } from "./player-avatar-renderer";

const PLAYER_MOVEMENT_SMOOTHING = 18;

type Point = {
  x: number;
  y: number;
};

export type RoomEditorInteraction = {
  enabled: boolean;
  mode: RoomMode;
  selectedObjectId: string | null;
  onTileSelect: (position: { x: number; y: number }) => void;
  onObjectSelect: (objectId: string) => void;
};

export type RoomNavigationInteraction = {
  onDestinationSelect: (position: { x: number; y: number }) => void;
};

type RoomRendererOptions = {
  container: HTMLElement;
  room: Room;
  player: Player;
  playerDisplayName: string;
  objects: RoomObject[];
  editorInteraction: RoomEditorInteraction;
  navigationInteraction: RoomNavigationInteraction;
};

export class RoomRenderer {
  private readonly app = new Application<Renderer>();
  private readonly room: Room;
  private readonly worldLayer = new Container();
  private readonly floorLayer = new Container();
  private readonly objectLayer = new Container();
  private readonly gridLayer = new Container();
  private readonly navigationLayer = new Container();
  private player: Player;
  private playerDisplayName: string;
  private objects: RoomObject[];
  private editorInteraction: RoomEditorInteraction;
  private readonly navigationInteraction: RoomNavigationInteraction;
  private playerAvatar?: PlayerAvatarRenderer;
  private resizeObserver?: ResizeObserver;
  private container?: HTMLElement;
  private visualPlayerPosition?: Point;
  private animationElapsedMilliseconds = 0;

  private constructor(options: RoomRendererOptions) {
    this.room = options.room;
    this.player = options.player;
    this.playerDisplayName = options.playerDisplayName;
    this.objects = options.objects;
    this.editorInteraction = options.editorInteraction;
    this.navigationInteraction = options.navigationInteraction;
  }

  static async create(options: RoomRendererOptions): Promise<RoomRenderer> {
    const renderer = new RoomRenderer(options);
    await renderer.init(options.container);
    return renderer;
  }

  updatePlayer(
    player: Player,
    playerDisplayName = this.playerDisplayName,
  ): void {
    this.player = player;
    this.playerDisplayName = playerDisplayName;
    this.drawPlayer();
  }

  updateObjects(objects: RoomObject[]): void {
    this.objects = objects;
    this.drawObjects();
  }

  updateEditorInteraction(interaction: RoomEditorInteraction): void {
    this.editorInteraction = interaction;
    this.drawGrid();
    this.drawObjects();
  }

  setNavigationDestination(position: { x: number; y: number } | null): void {
    this.navigationLayer.removeChildren();

    if (!position) {
      return;
    }

    const centerX = (position.x + 0.5) * this.room.tileSize;
    const centerY = (position.y + 0.5) * this.room.tileSize;
    const marker = new Graphics()
      .circle(centerX, centerY, this.room.tileSize * 0.2)
      .fill({ color: "#14b8a6", alpha: 0.16 })
      .stroke({ color: "#0f766e", width: 2 });

    this.navigationLayer.addChild(marker);
  }

  destroy(): void {
    this.resizeObserver?.disconnect();
    this.app.ticker.remove(this.animate);
    this.container = undefined;
    this.app.destroy(true, { children: true });
  }

  private async init(container: HTMLElement): Promise<void> {
    this.container = container;

    await this.app.init({
      antialias: true,
      background: "#f8fafc",
      resizeTo: container,
    });

    container.appendChild(this.app.canvas);
    this.app.canvas.style.display = "block";
    this.objectLayer.sortableChildren = true;
    this.worldLayer.addChild(
      this.floorLayer,
      this.gridLayer,
      this.navigationLayer,
      this.objectLayer,
    );
    this.app.stage.addChild(this.worldLayer);

    this.drawEnvironment();
    this.drawGrid();
    this.drawObjects();
    this.drawPlayer();
    this.snapPlayerToTarget();
    this.updateCamera();
    this.app.ticker.add(this.animate);

    this.resizeObserver = new ResizeObserver(() => {
      this.updateCamera();
    });
    this.resizeObserver.observe(container);
  }

  private readonly animate = (ticker: Ticker): void => {
    const current = this.visualPlayerPosition;

    if (!current) {
      return;
    }

    const target = this.getPlayerTargetPosition();
    const next = {
      x: dampValue({
        current: current.x,
        target: target.x,
        smoothing: PLAYER_MOVEMENT_SMOOTHING,
        deltaMilliseconds: ticker.deltaMS,
      }),
      y: dampValue({
        current: current.y,
        target: target.y,
        smoothing: PLAYER_MOVEMENT_SMOOTHING,
        deltaMilliseconds: ticker.deltaMS,
      }),
    };

    this.visualPlayerPosition = next;
    this.animationElapsedMilliseconds += ticker.deltaMS;
    this.playerAvatar?.updateAnimation({
      position: next,
      direction: this.player.direction,
      isMoving: isVisualPositionMoving(next, target),
      elapsedMilliseconds: this.animationElapsedMilliseconds,
    });
    if (this.playerAvatar) {
      this.playerAvatar.container.zIndex = next.y;
    }
    this.updateCamera();
  };

  private updateCamera(): void {
    if (!this.container) {
      return;
    }

    const worldWidth = this.room.width * this.room.tileSize;
    const worldHeight = this.room.height * this.room.tileSize;
    const playerPosition =
      this.visualPlayerPosition ?? this.getPlayerTargetPosition();
    const camera = calculateCameraTransform({
      viewportWidth: this.container.clientWidth,
      viewportHeight: this.container.clientHeight,
      worldWidth,
      worldHeight,
      targetX: playerPosition.x,
      targetY: playerPosition.y,
    });

    this.worldLayer.scale.set(camera.scale);
    this.worldLayer.position.set(camera.x, camera.y);
  }

  private drawGrid(): void {
    this.gridLayer.removeChildren();

    const interactionSurface = new Graphics();
    const width = this.room.width * this.room.tileSize;
    const height = this.room.height * this.room.tileSize;

    interactionSurface
      .rect(0, 0, width, height)
      .fill({ color: "#ffffff", alpha: 0.001 });
    interactionSurface.eventMode = "static";
    interactionSurface.cursor = this.editorInteraction.enabled
      ? "crosshair"
      : "pointer";
    interactionSurface.on("pointertap", (event) => {
      const localPosition = event.getLocalPosition(interactionSurface);
      const tileX = Math.floor(localPosition.x / this.room.tileSize);
      const tileY = Math.floor(localPosition.y / this.room.tileSize);

      if (
        tileX >= 0 &&
        tileX < this.room.width &&
        tileY >= 0 &&
        tileY < this.room.height
      ) {
        const position = { x: tileX, y: tileY };

        if (this.editorInteraction.enabled) {
          this.editorInteraction.onTileSelect(position);
        } else {
          this.navigationInteraction.onDestinationSelect(position);
        }
      }
    });

    this.gridLayer.addChild(interactionSurface);

    if (this.editorInteraction.mode === "user") {
      return;
    }

    const grid = new Graphics();
    const isDebug = this.editorInteraction.mode === "debug";

    for (let x = 0; x <= this.room.width; x += 1) {
      const screenX = x * this.room.tileSize;
      grid.moveTo(screenX, 0).lineTo(screenX, height);
    }

    for (let y = 0; y <= this.room.height; y += 1) {
      const screenY = y * this.room.tileSize;
      grid.moveTo(0, screenY).lineTo(width, screenY);
    }

    grid.stroke({
      color: isDebug ? "#334155" : "#0f766e",
      width: isDebug ? 1 : 1.5,
      alpha: isDebug ? 0.42 : 0.3,
    });
    this.gridLayer.addChild(grid);
  }

  private drawObjects(): void {
    this.objectLayer.removeChildren();

    for (const object of this.objects) {
      const tile = this.toScreenPosition(object.position.x, object.position.y);
      const objectContainer = new Container();
      const visual = new Container();
      const item = new Graphics();
      const shadow = new Graphics();
      const highlight = new Graphics();
      const color =
        typeof object.state.color === "string" ? object.state.color : "#94a3b8";
      const isSelected =
        this.editorInteraction.enabled &&
        this.editorInteraction.selectedObjectId === object.id;

      objectContainer.position.set(tile.x, tile.y);
      objectContainer.zIndex = tile.y + this.room.tileSize;
      visual.position.set(this.room.tileSize / 2, this.room.tileSize / 2);
      visual.rotation = (object.rotation * Math.PI) / 180;
      this.drawObjectShape(shadow, item, object, color);

      if (isSelected) {
        highlight
          .roundRect(3, 3, this.room.tileSize - 6, this.room.tileSize - 6, 7)
          .fill({ color: "#f59e0b", alpha: 0.08 })
          .stroke({ color: "#d97706", width: 3 });
      }

      objectContainer.eventMode = "static";
      objectContainer.cursor = this.editorInteraction.enabled
        ? "pointer"
        : "default";
      objectContainer.hitArea = {
        contains: (x: number, y: number) =>
          x >= 2 &&
          y >= 2 &&
          x <= this.room.tileSize - 2 &&
          y <= this.room.tileSize - 2,
      };
      objectContainer.on("pointerover", () => {
        item.alpha = 0.88;
        highlight
          .clear()
          .roundRect(4, 4, this.room.tileSize - 8, this.room.tileSize - 8, 7)
          .stroke({ color: "#0f766e", width: 2, alpha: 0.7 });
      });
      objectContainer.on("pointerout", () => {
        item.alpha = 1;
        highlight.clear();

        if (isSelected) {
          highlight
            .roundRect(3, 3, this.room.tileSize - 6, this.room.tileSize - 6, 7)
            .fill({ color: "#f59e0b", alpha: 0.08 })
            .stroke({ color: "#d97706", width: 3 });
        }
      });
      objectContainer.on("pointertap", (event) => {
        if (!this.editorInteraction.enabled) {
          return;
        }

        event.stopPropagation();
        this.editorInteraction.onObjectSelect(object.id);
      });

      visual.addChild(shadow, item);
      objectContainer.addChild(visual, highlight);
      this.objectLayer.addChild(objectContainer);
    }

    if (this.playerAvatar) {
      this.objectLayer.addChild(this.playerAvatar.container);
    }
  }

  private drawObjectShape(
    shadow: Graphics,
    item: Graphics,
    object: RoomObject,
    color: string,
  ): void {
    const stroke = { color: "#334155", width: 2 };

    switch (object.itemDefinitionId) {
      case "chair":
        shadow.ellipse(2, 7, 16, 13).fill({
          color: "#0f172a",
          alpha: 0.18,
        });
        item
          .roundRect(-13, -11, 26, 25, 6)
          .fill(color)
          .stroke(stroke)
          .roundRect(-14, -16, 28, 8, 4)
          .fill(color)
          .stroke(stroke)
          .moveTo(-8, 10)
          .lineTo(-10, 17)
          .moveTo(8, 10)
          .lineTo(10, 17)
          .stroke({ color: "#334155", width: 3 });
        break;
      case "whiteboard":
        shadow.ellipse(2, 11, 24, 8).fill({
          color: "#0f172a",
          alpha: 0.16,
        });
        item
          .moveTo(-16, 8)
          .lineTo(-19, 18)
          .moveTo(16, 8)
          .lineTo(19, 18)
          .stroke({ color: "#475569", width: 3 })
          .roundRect(-22, -18, 44, 28, 4)
          .fill("#f8fafc")
          .stroke(stroke)
          .moveTo(-15, -8)
          .lineTo(9, -8)
          .moveTo(-15, -2)
          .lineTo(14, -2)
          .stroke({ color, width: 2, alpha: 0.85 });
        break;
      case "plant":
        shadow.ellipse(2, 11, 17, 8).fill({
          color: "#0f172a",
          alpha: 0.17,
        });
        item
          .ellipse(-7, -9, 8, 15)
          .fill("#3f8f67")
          .stroke(stroke)
          .ellipse(7, -8, 8, 15)
          .fill("#5aa879")
          .stroke(stroke)
          .ellipse(0, -15, 8, 16)
          .fill(color)
          .stroke(stroke)
          .roundRect(-11, 3, 22, 15, 4)
          .fill("#c96f4a")
          .stroke(stroke);
        break;
      default:
        shadow.ellipse(3, 8, 24, 17).fill({
          color: "#0f172a",
          alpha: 0.2,
        });
        item
          .moveTo(-16, 10)
          .lineTo(-16, 18)
          .moveTo(16, 10)
          .lineTo(16, 18)
          .stroke({ color: "#475569", width: 4 })
          .roundRect(-22, -15, 44, 30, 6)
          .fill(color)
          .stroke(stroke)
          .roundRect(-17, -10, 34, 20, 4)
          .stroke({ color: "#fef3c7", width: 2, alpha: 0.55 });
    }
  }

  private drawPlayer(): void {
    if (!this.playerAvatar) {
      this.playerAvatar = new PlayerAvatarRenderer(
        this.room.tileSize,
        this.player,
        this.playerDisplayName,
      );
      this.objectLayer.addChild(this.playerAvatar.container);
    }

    this.playerAvatar.updatePlayer(this.player, this.playerDisplayName);
  }

  private snapPlayerToTarget(): void {
    const target = this.getPlayerTargetPosition();

    this.visualPlayerPosition = target;
    this.playerAvatar?.updateAnimation({
      position: target,
      direction: this.player.direction,
      isMoving: false,
      elapsedMilliseconds: this.animationElapsedMilliseconds,
    });
  }

  private getPlayerTargetPosition(): Point {
    return {
      x: (this.player.position.x + 0.5) * this.room.tileSize,
      y: (this.player.position.y + 0.78) * this.room.tileSize,
    };
  }

  private drawEnvironment(): void {
    this.floorLayer.removeChildren();

    const environment = new Graphics();
    const width = this.room.width * this.room.tileSize;
    const height = this.room.height * this.room.tileSize;
    const tileSize = this.room.tileSize;

    environment.rect(0, 0, width, height).fill("#dce5df");

    for (let y = 0; y < this.room.height; y += 2) {
      environment.rect(0, y * tileSize, width, tileSize * 2).fill({
        color: y % 4 === 0 ? "#e5ece8" : "#d3dfd8",
        alpha: 0.48,
      });
    }

    environment
      .roundRect(
        tileSize * 6.4,
        tileSize * 2.35,
        tileSize * 4.2,
        tileSize * 4.3,
        16,
      )
      .fill("#b8d4cc")
      .stroke({ color: "#6f9d90", width: 4, alpha: 0.75 })
      .roundRect(
        tileSize * 6.65,
        tileSize * 2.6,
        tileSize * 3.7,
        tileSize * 3.8,
        12,
      )
      .stroke({ color: "#e8f3ef", width: 3, alpha: 0.7 });

    environment
      .roundRect(tileSize * 14, tileSize * 8, tileSize * 6, tileSize * 4, 18)
      .fill({ color: "#f3c7bc", alpha: 0.55 })
      .stroke({ color: "#bd7565", width: 3, alpha: 0.5 });

    environment
      .rect(0, 0, width, 18)
      .fill("#274d45")
      .rect(0, 18, width, 7)
      .fill("#7ca69a")
      .rect(0, 0, 12, height)
      .fill("#315c53")
      .rect(width - 12, 0, 12, height)
      .fill("#315c53")
      .rect(0, height - 12, width, 12)
      .fill("#315c53");

    this.floorLayer.addChild(environment);
  }

  private toScreenPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: x * this.room.tileSize,
      y: y * this.room.tileSize,
    };
  }
}
