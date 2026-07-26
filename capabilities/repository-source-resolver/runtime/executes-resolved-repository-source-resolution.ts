import type { ExecutionContext } from "./repository-source-resolution.type.js";

export async function executesResolvedRepositorySourceResolution(context: ExecutionContext): Promise<unknown> {
  return context.edges.invokes(
    "execute-resolved-repository-source-resolution",
    context.authority
  );
}
