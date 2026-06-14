import {
  Application,
  Container,
  Graphics,
  Text,
  TextStyle,
  type Renderer,
} from "pixi.js";
import type { Player, Room, RoomObject } from "../types";

type RoomRendererOptions = {
  container: HTMLElement;
  room: Room;
  player: Player;
  objects: RoomObject[];
};

export class RoomRenderer {
  private readonly app = new Application<Renderer>();
  private readonly room: Room;
  private readonly playerLayer = new Container();
  private readonly objectLayer = new Container();
  private readonly gridLayer = new Container();
  private player: Player;
  private objects: RoomObject[];
  private playerBody?: Graphics;
  private playerLabel?: Text;

  private constructor(options: RoomRendererOptions) {
    this.room = options.room;
    this.player = options.player;
    this.objects = options.objects;
  }

  static async create(options: RoomRendererOptions): Promise<RoomRenderer> {
    const renderer = new RoomRenderer(options);
    await renderer.init(options.container);
    return renderer;
  }

  updatePlayer(player: Player): void {
    this.player = player;
    this.drawPlayer();
  }

  updateObjects(objects: RoomObject[]): void {
    this.objects = objects;
    this.drawObjects();
  }

  destroy(): void {
    this.app.destroy(true, { children: true });
  }

  private async init(container: HTMLElement): Promise<void> {
    await this.app.init({
      antialias: true,
      background: "#f8fafc",
      resizeTo: container,
    });

    container.appendChild(this.app.canvas);
    this.app.stage.addChild(this.gridLayer, this.objectLayer, this.playerLayer);

    this.drawGrid();
    this.drawObjects();
    this.drawPlayer();
  }

  private drawGrid(): void {
    this.gridLayer.removeChildren();

    const grid = new Graphics();
    const width = this.room.width * this.room.tileSize;
    const height = this.room.height * this.room.tileSize;

    grid.rect(0, 0, width, height).fill("#e2e8f0");

    for (let x = 0; x <= this.room.width; x += 1) {
      const screenX = x * this.room.tileSize;
      grid.moveTo(screenX, 0).lineTo(screenX, height);
    }

    for (let y = 0; y <= this.room.height; y += 1) {
      const screenY = y * this.room.tileSize;
      grid.moveTo(0, screenY).lineTo(width, screenY);
    }

    grid.stroke({ color: "#cbd5e1", width: 1 });
    this.gridLayer.addChild(grid);
  }

  private drawObjects(): void {
    this.objectLayer.removeChildren();

    for (const object of this.objects) {
      const tile = this.toScreenPosition(object.position.x, object.position.y);
      const item = new Graphics();
      const color =
        typeof object.state.color === "string" ? object.state.color : "#94a3b8";

      item
        .roundRect(
          tile.x + 8,
          tile.y + 8,
          this.room.tileSize - 16,
          this.room.tileSize - 16,
          6,
        )
        .fill(color)
        .stroke({ color: "#475569", width: 2 });

      this.objectLayer.addChild(item);
    }
  }

  private drawPlayer(): void {
    if (!this.playerBody) {
      this.playerBody = new Graphics();
      this.playerLabel = new Text({
        text: this.player.avatarConfig.displayName,
        style: new TextStyle({
          fill: "#0f172a",
          fontFamily: "Arial",
          fontSize: 12,
          fontWeight: "700",
        }),
      });
      this.playerLabel.anchor.set(0.5, 0);
      this.playerLayer.addChild(this.playerBody, this.playerLabel);
    }

    const playerBody = this.playerBody;
    const playerLabel = this.playerLabel;

    if (!playerBody || !playerLabel) {
      return;
    }

    const { x, y } = this.toScreenPosition(
      this.player.position.x,
      this.player.position.y,
    );
    const radius = this.room.tileSize * 0.32;
    const centerX = x + this.room.tileSize / 2;
    const centerY = y + this.room.tileSize / 2;

    playerBody
      .clear()
      .circle(centerX, centerY, radius)
      .fill(this.player.avatarConfig.bodyColor)
      .stroke({ color: this.player.avatarConfig.accentColor, width: 3 });

    playerLabel.text = this.player.avatarConfig.displayName;
    playerLabel.position.set(centerX, centerY + radius + 4);
  }

  private toScreenPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: x * this.room.tileSize,
      y: y * this.room.tileSize,
    };
  }
}
