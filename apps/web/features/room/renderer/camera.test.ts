import { describe, expect, test } from "bun:test";
import { calculateCameraTransform } from "./camera";

describe("calculateCameraTransform", () => {
  test("centers and enlarges a world that fits inside the viewport", () => {
    expect(
      calculateCameraTransform({
        viewportWidth: 1_200,
        viewportHeight: 800,
        worldWidth: 600,
        worldHeight: 400,
        targetX: 100,
        targetY: 100,
      }),
    ).toEqual({
      x: 0,
      y: 0,
      scale: 2,
    });
  });

  test("follows the target when the world is larger than the viewport", () => {
    expect(
      calculateCameraTransform({
        viewportWidth: 800,
        viewportHeight: 600,
        worldWidth: 1_600,
        worldHeight: 1_200,
        targetX: 900,
        targetY: 700,
      }),
    ).toEqual({
      x: -500,
      y: -400,
      scale: 1,
    });
  });

  test("stops at the world edges instead of exposing space outside it", () => {
    const nearStart = calculateCameraTransform({
      viewportWidth: 800,
      viewportHeight: 600,
      worldWidth: 1_600,
      worldHeight: 1_200,
      targetX: 100,
      targetY: 100,
    });
    const nearEnd = calculateCameraTransform({
      viewportWidth: 800,
      viewportHeight: 600,
      worldWidth: 1_600,
      worldHeight: 1_200,
      targetX: 1_550,
      targetY: 1_150,
    });

    expect(nearStart).toEqual({ x: 0, y: 0, scale: 1 });
    expect(nearEnd).toEqual({ x: -800, y: -600, scale: 1 });
  });

  test("keeps a small world centered on an axis that already fits", () => {
    expect(
      calculateCameraTransform({
        viewportWidth: 800,
        viewportHeight: 600,
        worldWidth: 1_200,
        worldHeight: 400,
        targetX: 600,
        targetY: 50,
      }),
    ).toEqual({
      x: -200,
      y: 100,
      scale: 1,
    });
  });
});
