export function enforcesCollapsedRuntimeBody(source: string): boolean {
  const body = source
    .replace(/^import[\s\S]*?;\r?\n/gm, "")
    .replace(/^export type[\s\S]*?;\r?\n/gm, "");
  return !/\b(?:if|switch|for|while|reduce|filter|sort)\s*\(/.test(body);
}
