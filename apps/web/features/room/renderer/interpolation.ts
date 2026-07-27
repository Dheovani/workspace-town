type DampValueOptions = {
  current: number;
  target: number;
  smoothing: number;
  deltaMilliseconds: number;
  snapThreshold?: number;
};

export function dampValue({
  current,
  target,
  smoothing,
  deltaMilliseconds,
  snapThreshold = 0.05,
}: DampValueOptions): number {
  if (current === target || deltaMilliseconds <= 0) {
    return current;
  }

  const factor = 1 - Math.exp((-smoothing * deltaMilliseconds) / 1_000);
  const next = current + (target - current) * factor;

  return Math.abs(target - next) <= snapThreshold ? target : next;
}
