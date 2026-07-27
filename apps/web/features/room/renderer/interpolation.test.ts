import { describe, expect, test } from "bun:test";
import { dampValue } from "./interpolation";

describe("dampValue", () => {
  test("moves toward the target without overshooting it", () => {
    const next = dampValue({
      current: 0,
      target: 48,
      smoothing: 18,
      deltaMilliseconds: 16,
    });

    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(48);
  });

  test("does not move when no frame time has elapsed", () => {
    expect(
      dampValue({
        current: 12,
        target: 48,
        smoothing: 18,
        deltaMilliseconds: 0,
      }),
    ).toBe(12);
  });

  test("produces the same result across equivalent frame intervals", () => {
    const firstHalf = dampValue({
      current: 0,
      target: 48,
      smoothing: 18,
      deltaMilliseconds: 16,
    });
    const twoFrames = dampValue({
      current: firstHalf,
      target: 48,
      smoothing: 18,
      deltaMilliseconds: 16,
    });
    const oneFrame = dampValue({
      current: 0,
      target: 48,
      smoothing: 18,
      deltaMilliseconds: 32,
    });

    expect(twoFrames).toBeCloseTo(oneFrame, 10);
  });

  test("snaps to the target inside the configured threshold", () => {
    expect(
      dampValue({
        current: 47.98,
        target: 48,
        smoothing: 18,
        deltaMilliseconds: 16,
        snapThreshold: 0.05,
      }),
    ).toBe(48);
  });
});
