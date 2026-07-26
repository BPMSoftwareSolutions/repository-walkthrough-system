import type { AuthorityContext } from "./repository-source-resolution.type.js";

export async function observesRepositorySource(context: AuthorityContext): Promise<unknown> {
  return context.edges.invokes("observe-repository-source", context.resolutionContext);
}
