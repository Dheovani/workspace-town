import { describe, expect, test } from "bun:test";
import {
  getDirectionRotation,
  isVisualPositionMoving,
} from "./avatar-visual-state";

describe("getDirectionRotation", () => {
  test("maps each player direction to the expected rotation", () => {
    expect(getDirectionRotation("up")).toBe(0);
    expect(getDirectionRotation("right")).toBe(Math.PI / 2);
    expect(getDirectionRotation("down")).toBe(Math.PI);
    expect(getDirectionRotation("left")).toBe(-Math.PI / 2);
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
