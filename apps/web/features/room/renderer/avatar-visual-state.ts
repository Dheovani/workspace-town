import type { PlayerDirection } from "../types";

type Point = {
  x: number;
  y: number;
};

export function getDirectionRotation(direction: PlayerDirection): number {
  switch (direction) {
    case "right":
      return Math.PI / 2;
    case "down":
      return Math.PI;
    case "left":
      return -Math.PI / 2;
    default:
      return 0;
  }
}

export function isVisualPositionMoving(
  current: Point,
  target: Point,
  threshold = 0.05,
): boolean {
  return (
    Math.abs(target.x - current.x) > threshold ||
    Math.abs(target.y - current.y) > threshold
  );
}
