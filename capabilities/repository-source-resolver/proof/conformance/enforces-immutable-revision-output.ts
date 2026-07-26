export function enforcesImmutableRevisionOutput(result: unknown): boolean {
  const source = (result as any)?.source;
  return source === null
    || (
      /^[0-9a-f]{40}$/.test(source?.resolvedRevision?.commit)
      && source?.sourceId?.endsWith(`@${source.resolvedRevision.commit}`)
    );
}
