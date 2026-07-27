import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { AvatarConfig, Player, PlayerDirection } from "../types";
import { calculateAvatarWalkPose } from "./avatar-visual-state";

const OUTLINE_COLOR = "#172033";

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
  private readonly labelLayer = new Container();
  private readonly labelBackground = new Graphics();
  private readonly shadow = new Graphics();
  private readonly backDetails = new Graphics();
  private readonly backArm = new Graphics();
  private readonly backLeg = new Graphics();
  private readonly torso = new Graphics();
  private readonly frontLeg = new Graphics();
  private readonly frontArm = new Graphics();
  private readonly head = new Graphics();
  private readonly face = new Graphics();
  private readonly hair = new Graphics();
  private readonly clothingDetails = new Graphics();
  private readonly label: Text;
  private readonly characterScale: number;
  private avatarConfig: AvatarConfig;
  private direction: PlayerDirection;
  private backLegBaseY = 0;
  private frontLegBaseY = 0;

  constructor(
    private readonly tileSize: number,
    player: Player,
    displayName: string,
  ) {
    this.characterScale = (tileSize / 48) * 1.35;
    this.avatarConfig = player.avatarConfig;
    this.direction = player.direction;
    this.label = new Text({
      text: displayName,
      style: new TextStyle({
        fill: "#ffffff",
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: "700",
      }),
    });
    this.label.anchor.set(0.5);
    this.labelLayer.position.set(0, -tileSize * 1.58);
    this.labelLayer.addChild(this.labelBackground, this.label);

    this.characterLayer.addChild(
      this.backDetails,
      this.backArm,
      this.backLeg,
      this.torso,
      this.frontLeg,
      this.frontArm,
      this.head,
      this.face,
      this.hair,
      this.clothingDetails,
    );
    this.container.addChild(this.shadow, this.characterLayer, this.labelLayer);

    this.drawShadow();
    this.updatePlayer(player, displayName);
  }

  updatePlayer(player: Player, displayName: string): void {
    this.avatarConfig = player.avatarConfig;
    this.direction = player.direction;
    this.label.text = displayName;
    this.drawLabel();
    this.drawCharacter();
  }

  updateAnimation({
    position,
    direction,
    isMoving,
    elapsedMilliseconds,
  }: PlayerAvatarAnimation): void {
    if (direction !== this.direction) {
      this.direction = direction;
      this.drawCharacter();
    }

    const pose = calculateAvatarWalkPose(elapsedMilliseconds, isMoving);

    this.container.position.set(position.x, position.y);
    this.characterLayer.position.y =
      -23 * this.characterScale + pose.bodyOffsetY * this.characterScale;
    this.backArm.rotation = pose.limbRotation;
    this.frontArm.rotation = -pose.limbRotation;
    this.backLeg.rotation = -pose.limbRotation * 0.72;
    this.frontLeg.rotation = pose.limbRotation * 0.72;
    this.backLeg.position.y = this.backLegBaseY - pose.stepOffsetY;
    this.frontLeg.position.y = this.frontLegBaseY + pose.stepOffsetY;
    this.shadow.scale.x = isMoving ? 0.92 : 1;
  }

  private drawCharacter(): void {
    this.clearCharacter();

    const isSideView = this.direction === "left" || this.direction === "right";
    const isBackView = this.direction === "up";
    const mirror = this.direction === "left" ? -1 : 1;

    this.characterLayer.scale.set(
      this.characterScale * mirror,
      this.characterScale,
    );

    if (isSideView) {
      this.drawSideCharacter();
    } else {
      this.drawStraightCharacter(isBackView);
    }

    this.backLegBaseY = this.backLeg.position.y;
    this.frontLegBaseY = this.frontLeg.position.y;
  }

  private clearCharacter(): void {
    for (const graphic of [
      this.backDetails,
      this.backArm,
      this.backLeg,
      this.torso,
      this.frontLeg,
      this.frontArm,
      this.head,
      this.face,
      this.hair,
      this.clothingDetails,
    ]) {
      graphic.clear();
      graphic.position.set(0, 0);
      graphic.rotation = 0;
    }
  }

  private drawStraightCharacter(isBackView: boolean): void {
    const {
      faceStyle,
      hairColor,
      hairStyle,
      pantsColor,
      shirtColor,
      shirtStyle,
      shoeColor,
      skinTone,
    } = this.avatarConfig;

    if (shirtStyle === "hoodie") {
      this.backDetails
        .roundRect(-8, -12, 16, 11, 4)
        .fill(shirtColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    }

    this.drawArm(this.backArm, shirtColor, skinTone, shirtStyle);
    this.backArm.position.set(-12, -5);
    this.drawLeg(this.backLeg, pantsColor, shoeColor);
    this.backLeg.position.set(-6, 9);

    this.torso
      .poly([-9, -6, -6, -9, 6, -9, 9, -6, 8, 10, -8, 10])
      .fill(shirtColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });

    this.drawLeg(this.frontLeg, pantsColor, shoeColor);
    this.frontLeg.position.set(2, 9);
    this.drawArm(this.frontArm, shirtColor, skinTone, shirtStyle);
    this.frontArm.position.set(9, -5);

    this.head
      .poly([-8, -24, 8, -24, 10, -21, 9, -11, 6, -7, -6, -7, -9, -11])
      .fill(skinTone)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });

    if (!isBackView) {
      this.drawFrontFace(faceStyle);
    }

    this.drawStraightHair(hairStyle, hairColor, isBackView);
    this.drawShirtDetails(shirtStyle, shirtColor, isBackView);
  }

  private drawSideCharacter(): void {
    const {
      faceStyle,
      hairColor,
      hairStyle,
      pantsColor,
      shirtColor,
      shirtStyle,
      shoeColor,
      skinTone,
    } = this.avatarConfig;

    if (shirtStyle === "hoodie") {
      this.backDetails
        .roundRect(-7, -12, 13, 11, 4)
        .fill(shirtColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    }

    this.drawArm(this.backArm, shirtColor, skinTone, shirtStyle);
    this.backArm.position.set(-4, -5);
    this.drawLeg(this.backLeg, pantsColor, shoeColor);
    this.backLeg.position.set(-3, 9);

    this.torso
      .poly([-7, -7, -4, -9, 6, -7, 7, 10, -6, 10])
      .fill(shirtColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });

    this.drawLeg(this.frontLeg, pantsColor, shoeColor);
    this.frontLeg.position.set(2, 9);
    this.drawArm(this.frontArm, shirtColor, skinTone, shirtStyle);
    this.frontArm.position.set(5, -5);

    this.head
      .poly([
        -7, -24, 6, -24, 9, -21, 9, -18, 12, -16, 9, -14, 8, -10, 5, -7, -5, -8,
        -8, -12,
      ])
      .fill(skinTone)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });

    this.drawSideFace(faceStyle);
    this.drawSideHair(hairStyle, hairColor);
    this.drawShirtDetails(shirtStyle, shirtColor, false);
  }

  private drawArm(
    graphic: Graphics,
    shirtColor: string,
    skinTone: string,
    shirtStyle: AvatarConfig["shirtStyle"],
  ): void {
    const sleeveHeight = shirtStyle === "jacket" ? 11 : 7;

    graphic
      .roundRect(-3, 0, 6, sleeveHeight, 2)
      .fill(shirtColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 })
      .rect(-2.5, sleeveHeight - 1, 5, 14 - sleeveHeight)
      .fill(skinTone)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 })
      .roundRect(-3, 13, 6, 5, 2)
      .fill(skinTone)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });
  }

  private drawLeg(
    graphic: Graphics,
    pantsColor: string,
    shoeColor: string,
  ): void {
    graphic
      .rect(-3, 0, 7, 10)
      .fill(pantsColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 })
      .roundRect(-3, 9, 9, 5, 2)
      .fill(shoeColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });
  }

  private drawFrontFace(faceStyle: AvatarConfig["faceStyle"]): void {
    this.face
      .rect(-5, -18, 2, 2)
      .fill(OUTLINE_COLOR)
      .rect(3, -18, 2, 2)
      .fill(OUTLINE_COLOR);

    if (faceStyle === "focused") {
      this.face
        .moveTo(-6, -20)
        .lineTo(-2, -19)
        .moveTo(2, -19)
        .lineTo(6, -20)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    }

    if (faceStyle === "smile") {
      this.face
        .moveTo(-3, -13)
        .lineTo(0, -11)
        .lineTo(3, -13)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    } else {
      this.face
        .moveTo(-2, -12)
        .lineTo(2, -12)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    }
  }

  private drawSideFace(faceStyle: AvatarConfig["faceStyle"]): void {
    this.face.rect(4, -18, 2, 2).fill(OUTLINE_COLOR);

    if (faceStyle === "focused") {
      this.face
        .moveTo(3, -20)
        .lineTo(7, -19)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    }

    const mouthY = faceStyle === "smile" ? -12 : -13;
    this.face
      .moveTo(5, mouthY)
      .lineTo(8, faceStyle === "smile" ? mouthY + 1 : mouthY)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });
  }

  private drawStraightHair(
    hairStyle: AvatarConfig["hairStyle"],
    hairColor: string,
    isBackView: boolean,
  ): void {
    if (hairStyle === "spiky") {
      this.hair
        .poly([
          -9, -21, -10, -27, -6, -25, -4, -30, 0, -26, 4, -30, 6, -25, 10, -27,
          9, -19, 5, -22, 1, -20, -4, -22,
        ])
        .fill(hairColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
      return;
    }

    this.hair
      .poly([
        -9, -19, -10, -25, -6, -28, 6, -28, 10, -24, 9, -19, 5, -22, 1, -20, -4,
        -22,
      ])
      .fill(hairColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });

    if (hairStyle === "bob") {
      this.hair
        .rect(-10, -22, 4, 13)
        .fill(hairColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 })
        .rect(6, -22, 4, 13)
        .fill(hairColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    } else if (isBackView) {
      this.hair.rect(-8, -22, 16, 9).fill(hairColor);
    }
  }

  private drawSideHair(
    hairStyle: AvatarConfig["hairStyle"],
    hairColor: string,
  ): void {
    if (hairStyle === "spiky") {
      this.hair
        .poly([
          -8, -19, -9, -26, -5, -25, -2, -30, 1, -26, 6, -29, 8, -24, 8, -20, 3,
          -22, -1, -20,
        ])
        .fill(hairColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
      return;
    }

    this.hair
      .poly([
        -8, -19, -8, -25, -4, -28, 5, -28, 8, -24, 7, -20, 2, -22, -2, -20,
      ])
      .fill(hairColor)
      .stroke({ color: OUTLINE_COLOR, width: 1.5 });

    if (hairStyle === "bob") {
      this.hair
        .rect(-8, -22, 4, 14)
        .fill(hairColor)
        .stroke({ color: OUTLINE_COLOR, width: 1.5 });
    }
  }

  private drawShirtDetails(
    shirtStyle: AvatarConfig["shirtStyle"],
    shirtColor: string,
    isBackView: boolean,
  ): void {
    if (shirtStyle === "hoodie" && !isBackView) {
      this.clothingDetails
        .moveTo(-3, -7)
        .lineTo(-2, -1)
        .moveTo(3, -7)
        .lineTo(2, -1)
        .stroke({ color: OUTLINE_COLOR, width: 1 })
        .roundRect(-4, 4, 8, 4, 1)
        .stroke({ color: OUTLINE_COLOR, width: 1 });
    }

    if (shirtStyle === "jacket") {
      this.clothingDetails
        .moveTo(0, -8)
        .lineTo(0, 9)
        .moveTo(-5, -7)
        .lineTo(0, -2)
        .lineTo(5, -7)
        .stroke({ color: OUTLINE_COLOR, width: 1.2 });
    }

    if (shirtStyle === "tshirt") {
      this.clothingDetails
        .moveTo(-7, -4)
        .lineTo(-4, -1)
        .moveTo(7, -4)
        .lineTo(4, -1)
        .stroke({ color: shirtColor, width: 1 });
    }
  }

  private drawShadow(): void {
    this.shadow
      .ellipse(0, 0, this.tileSize * 0.36, this.tileSize * 0.12)
      .fill({ color: "#0f172a", alpha: 0.24 });
  }

  private drawLabel(): void {
    const width = this.label.width + 16;
    const height = this.label.height + 8;

    this.labelBackground
      .clear()
      .roundRect(-width / 2, -height / 2, width, height, 6)
      .fill({ color: "#172033", alpha: 0.92 })
      .poly([-4, height / 2 - 1, 4, height / 2 - 1, 0, height / 2 + 5])
      .fill({ color: "#172033", alpha: 0.92 });
  }
}
