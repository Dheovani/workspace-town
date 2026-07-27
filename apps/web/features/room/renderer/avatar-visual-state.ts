type Point = {
  x: number;
  y: number;
};

export type AvatarWalkPose = {
  bodyOffsetY: number;
  limbRotation: number;
  stepOffsetY: number;
};

export function calculateAvatarWalkPose(
  elapsedMilliseconds: number,
  isMoving: boolean,
): AvatarWalkPose {
  if (!isMoving) {
    return {
      bodyOffsetY: 0,
      limbRotation: 0,
      stepOffsetY: 0,
    };
  }

  const phase = Math.sin(elapsedMilliseconds * 0.018);

  return {
    bodyOffsetY: -Math.abs(phase),
    limbRotation: phase * 0.16,
    stepOffsetY: phase * 1.5,
  };
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
