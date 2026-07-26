import type { AuthorityContext } from "./repository-presentation-inspection.type.js";

export async function resolvesRepositoryPresentationInspectionAuthority(
  context: AuthorityContext
): Promise<unknown> {
  return context.edges.invokes(
    "resolve-repository-presentation-inspection-authority",
    context.inspectionContext
  );
}
