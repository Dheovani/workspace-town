import { describe, expect, test } from "bun:test";
import {
  calculateAvatarWalkPose,
  isVisualPositionMoving,
} from "./avatar-visual-state";

describe("calculateAvatarWalkPose", () => {
  test("keeps every character layer at rest while idle", () => {
    expect(calculateAvatarWalkPose(500, false)).toEqual({
      bodyOffsetY: 0,
      limbRotation: 0,
      stepOffsetY: 0,
    });
  });

  test("alternates limbs and raises the body while walking", () => {
    const forwardPose = calculateAvatarWalkPose(90, true);
    const backwardPose = calculateAvatarWalkPose(270, true);

    expect(forwardPose.bodyOffsetY).toBeLessThanOrEqual(0);
    expect(backwardPose.bodyOffsetY).toBeLessThanOrEqual(0);
    expect(Math.sign(forwardPose.limbRotation)).not.toBe(
      Math.sign(backwardPose.limbRotation),
    );
    expect(Math.sign(forwardPose.stepOffsetY)).not.toBe(
      Math.sign(backwardPose.stepOffsetY),
    );
  });
});

describe("isVisualPositionMoving", () => {
  test("detects movement on either axis", () => {
    expect(isVisualPositionMoving({ x: 10, y: 10 }, { x: 11, y: 10 })).toBe(
      true,
    );
    expect(isVisualPositionMoving({ x: 10, y: 10 }, { x: 10, y: 11 })).toBe(
      true,
    );
  });

  test("stops movement inside the snap threshold", () => {
    expect(
      isVisualPositionMoving({ x: 10, y: 10 }, { x: 10.02, y: 10.02 }, 0.05),
    ).toBe(false);
  });
});
