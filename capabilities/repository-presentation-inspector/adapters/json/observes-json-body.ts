export function observesJsonBody(text: string): Record<string, unknown> {
  return JSON.parse(text) as Record<string, unknown>;
}
