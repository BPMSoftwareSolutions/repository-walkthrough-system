import type { ExecutionContext } from "./repository-presentation-inspection.type.js";

export async function executesResolvedRepositoryPresentationInspection(
  context: ExecutionContext
): Promise<unknown> {
  return context.edges.invokes(
    "execute-resolved-repository-presentation-inspection",
    context.authority
  );
}
