const forbiddenTerms = [
  "css selector",
  "xpath",
  "dom node",
  "playwright",
  "scroll pixels",
  "viewport coordinates",
  "ffmpeg",
  "codec",
  "frame rate",
  "screenshot hash"
];

export function enforcesScenePlanBoundary(value: unknown): boolean {
  const serialized = JSON.stringify(value).toLowerCase();
  return forbiddenTerms.every((term) => !serialized.includes(term));
}
