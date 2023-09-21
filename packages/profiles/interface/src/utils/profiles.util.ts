const DEFAULT_SCOREING_LEVEL_SCALE = [
  [0, 10],
  [10, 40],
  [50, 50],
  [500, 100],
  [1000, 200],
  [2000, 250],
  [3000, 500],
];

export function getScaledProgress(score: number, scale = DEFAULT_SCOREING_LEVEL_SCALE) {
  if (score <= 0) return 0;

  let applyScale = scale[scale.length - 1];
  for (let i = 1; i < scale.length; i++) {
    const currScale = scale[i];
    if (score < currScale[0]) {
      applyScale = scale[i - 1];
      break;
    }
  }

  const result = ((score - applyScale[0]) % applyScale[1]) / applyScale[1];
  return result === applyScale[1] ? 0 : result;
}
