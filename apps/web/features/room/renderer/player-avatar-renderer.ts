import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { Player, PlayerDirection } from "../types";
import { getDirectionRotation } from "./avatar-visual-state";

type PlayerAvatarAnimation = {
  position: {
    x: number;
    y: number;
  };
  direction: PlayerDirection;
  isMoving: boolean;
  elapsedMilliseconds: number;
};

export class PlayerAvatarRenderer {
  readonly container = new Container();

  private readonly characterLayer = new Container();
  private readonly shadow = new Graphics();
  private readonly leftFoot = new Graphics();
  private readonly rightFoot = new Graphics();
  private readonly body = new Graphics();
  private readonly directionMarker = new Graphics();
  private readonly label: Text;
  private readonly radius: number;

  constructor(
    private readonly tileSize: number,
    player: Player,
  ) {
    this.radius = tileSize * 0.32;
    this.label = new Text({
      text: player.avatarConfig.displayName,
      style: new TextStyle({
        fill: "#0f172a",
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: "700",
      }),
    });
    this.label.anchor.set(0.5, 0);
    this.label.position.set(0, this.radius + 5);

    this.characterLayer.addChild(
      this.leftFoot,
      this.rightFoot,
      this.body,
      this.directionMarker,
    );
    this.container.addChild(this.shadow, this.characterLayer, this.label);

    this.drawShadow();
    this.updatePlayer(player);
  }

  updatePlayer(player: Player): void {
    const { accentColor, bodyColor, displayName } = player.avatarConfig;
    const footWidth = this.tileSize * 0.16;
    const footHeight = this.tileSize * 0.19;

    this.leftFoot
      .clear()
      .roundRect(-footWidth / 2, -footHeight / 2, footWidth, footHeight, 3)
      .fill(accentColor);
    this.rightFoot
      .clear()
      .roundRect(-footWidth / 2, -footHeight / 2, footWidth, footHeight, 3)
      .fill(accentColor);
    this.body
      .clear()
      .circle(0, 0, this.radius)
      .fill(bodyColor)
      .stroke({ color: accentColor, width: 3 });
    this.directionMarker
      .clear()
      .moveTo(0, -this.radius * 0.68)
      .lineTo(this.radius * 0.2, -this.radius * 0.34)
      .lineTo(-this.radius * 0.2, -this.radius * 0.34)
      .closePath()
      .fill(accentColor);
    this.directionMarker.rotation = getDirectionRotation(player.direction);
    this.label.text = displayName;
  }

  updateAnimation({
    position,
    direction,
    isMoving,
    elapsedMilliseconds,
  }: PlayerAvatarAnimation): void {
    const phase = isMoving ? Math.sin(elapsedMilliseconds * 0.018) : 0;
    const bob = isMoving ? -Math.abs(phase) * 1.5 : 0;
    const footY = this.radius * 0.72;
    const footX = this.radius * 0.46;

    this.container.position.set(position.x, position.y);
    this.characterLayer.position.y = bob;
    this.leftFoot.position.set(-footX, footY + phase * 2.5);
    this.rightFoot.position.set(footX, footY - phase * 2.5);
    this.directionMarker.rotation = getDirectionRotation(direction);
    this.shadow.scale.x = isMoving ? 0.92 + Math.abs(phase) * 0.08 : 1;
  }

  private drawShadow(): void {
    this.shadow
      .ellipse(0, this.radius * 0.82, this.radius * 0.82, this.radius * 0.32)
      .fill({ color: "#0f172a", alpha: 0.16 });
  }
}
