export async function inspectsExample(context: unknown): Promise<unknown> {
  return edges.invokes("inspect-example", context);
}
