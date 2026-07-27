export type CameraTransform = {
  x: number;
  y: number;
  scale: number;
};

type CalculateCameraTransformOptions = {
  viewportWidth: number;
  viewportHeight: number;
  worldWidth: number;
  worldHeight: number;
  targetX: number;
  targetY: number;
  minimumScale?: number;
};

function calculateAxisOffset(
  viewportSize: number,
  worldSize: number,
  targetPosition: number,
  scale: number,
): number {
  const scaledWorldSize = worldSize * scale;

  if (scaledWorldSize <= viewportSize) {
    return Math.round((viewportSize - scaledWorldSize) / 2);
  }

  const centeredOffset = viewportSize / 2 - targetPosition * scale;
  const minimumOffset = viewportSize - scaledWorldSize;

  return Math.round(Math.min(0, Math.max(minimumOffset, centeredOffset)));
}

export function calculateCameraTransform({
  viewportWidth,
  viewportHeight,
  worldWidth,
  worldHeight,
  targetX,
  targetY,
  minimumScale = 1,
}: CalculateCameraTransformOptions): CameraTransform {
  if (
    viewportWidth <= 0 ||
    viewportHeight <= 0 ||
    worldWidth <= 0 ||
    worldHeight <= 0
  ) {
    return { x: 0, y: 0, scale: minimumScale };
  }

  const fitScale = Math.min(
    viewportWidth / worldWidth,
    viewportHeight / worldHeight,
  );
  const scale = Math.max(minimumScale, fitScale);

  return {
    x: calculateAxisOffset(viewportWidth, worldWidth, targetX, scale),
    y: calculateAxisOffset(viewportHeight, worldHeight, targetY, scale),
    scale,
  };
}
