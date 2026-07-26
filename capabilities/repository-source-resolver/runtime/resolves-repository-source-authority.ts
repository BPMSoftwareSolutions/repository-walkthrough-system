import type { AuthorityContext } from "./repository-source-resolution.type.js";

export async function resolvesRepositorySourceAuthority(context: AuthorityContext): Promise<unknown> {
  return context.edges.invokes(
    "resolve-repository-source-authority",
    context.resolutionContext
  );
}
